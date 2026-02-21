
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { LegalLinks } from "../../constants"
import { PATHS } from "@/routers/Paths"
import OtpInput from 'react-otp-input';
import Spinner from "../common/Spinner"
import { useTranslation, Trans } from "react-i18next"
import toast from "react-hot-toast"

export function VerifyOtp() {
    const navigate = useNavigate()
    const location = useLocation()
    const [token, setToken] = useState("")
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { t } = useTranslation()

    // Get email from navigation state or query params
    const email = location.state?.email || new URLSearchParams(location.search).get('email')

    useEffect(() => {
        if (email) {
            setPageLoading(false)
            return
        }
        navigate(PATHS.SIGNUP)
    }, [email, navigate])

    const handleVerifyToken = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token || token.length < 6) {
            setError(t('auth.otp.error_invalid_length'))
            return
        }

        setLoading(true)
        setError(null)

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'signup', // adjust if used for login
            })

            if (verifyError) throw verifyError

            navigate(PATHS.ROOT)
        } catch (err: any) {
            setError(err.message || t('auth.otp.error_invalid'))
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        if (!email) return
        setLoading(true)
        setError(null)
        try {
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            })
            if (resendError) throw resendError
            toast.success(t('auth.otp.resend_success'))
        } catch (err: any) {
            setError(err.message || t('auth.otp.error_resend'))
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="relative flex flex-col items-center md:justify-center gap-14 w-full md:w-4/5 p-2 md:p-4 lg:p-8">

            {pageLoading
                ?
                <div className="flex flex-col gap-2">
                    <Spinner />
                    <span className="text-sm"> {t('auth.otp.loading_moment')} </span>
                </div>
                :
                <>
                    {/* Form Header */}
                    <div className="text-center space-y-3 md:space-y-4">
                        <div className="flex justify-center mb-2">
                            <span className="text-4xl">📬</span>
                        </div>
                        <h1 className="font-semibold text-2xl md:text-3xl"> {t('auth.otp.verify_account')} </h1>
                        <p className="text-2xs md:text-xs text-muted max-w-xs mx-auto leading-5">
                            <Trans
                                i18nKey="auth.otp.description"
                                values={{ email }}
                                components={{ b: <span className="font-semibold text-foreground" /> }}
                            />
                        </p>
                    </div>

                    <form onSubmit={handleVerifyToken} className="flex flex-col items-center gap-8">

                        <OtpInput
                            skipDefaultStyles={true}
                            containerStyle={"flex gap-3 xs:gap-4 md:gap-6 h-12 xs:h-14 md:h-16"}
                            value={token}
                            onChange={setToken}
                            numInputs={6}
                            renderInput={(props) => <input {...props} required className="font-semibold text-xl xs:text-2xl md:text-3xl text-center w-8 xs:w-10 md:w-12 h-full ring-1 ring-muted/15 bg-emphasis rounded-md outline-muted/25" />}
                        />


                        {error && <p className="text-xs text-danger text-center"> {error} </p>}

                        <div className="ring-2 ring-muted/10 hover:ring-primary/40 active::ring-primary/45 p-px w-full rounded-xl">
                            <button
                                type="submit"
                                disabled={loading || token.length < 6}
                                className="font-semibold text-white/95 w-full px-4 p-2 bg-primary rounded-xl disabled:opacity-50"
                            >
                                <Spinner status={loading} size="sm"> {t('auth.otp.verify_button')} </Spinner>
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-col items-center gap-3 w-full">
                        <p className="text-2xs text-muted">{t('auth.otp.resend_prompt')}</p>
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={loading}
                            className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                        >
                            {t('auth.otp.resend_button')}
                        </button>

                        <hr className="w-full border-t border-muted/25 my-2 mask-x-to-transparent mask-x-from-45%" />
                        {/* Legal Links */}
                        <nav className="flex flex-wrap items-center">
                            {LegalLinks.map((item, index) => (
                                <Link key={index} to={item.path} className="flex justify-center text-3xs sm:text-2xs text-muted hover:underline active:underline after:content-['•'] after:mx-2 rtl:after:mx-2 last:after:content-none"> {t(`footer.legal.${item.key}`)} </Link>
                            ))}
                        </nav>
                    </div>
                </>
            }
        </div>

    )
}

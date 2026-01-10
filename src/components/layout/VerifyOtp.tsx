
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Input } from "../ui/Input"
import { LegalLinks } from "../../constants"
import { PATHS } from "@/routers/Paths"

export function VerifyOtp() {
    const [token, setToken] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const location = useLocation()

    // Get email from navigation state or query params
    const email = location.state?.email || new URLSearchParams(location.search).get('email')

    useEffect(() => {
        if (!email) {
            navigate(PATHS.SIGNUP)
        }
    }, [email, navigate])

    const handleVerifyToken = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token || token.length < 6) {
            setError("Please enter a valid 6-digit code")
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

            navigate(PATHS.LANDING)
        } catch (err: any) {
            setError(err.message || "Invalid or expired code")
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
            alert("Verification code resent to your email")
        } catch (err: any) {
            setError(err.message || "Failed to resend code")
        } finally {
            setLoading(false)
        }
    }

    return (

        <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full md:mt-8 ">

            <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

            <div className="relative flex justify-center items-center w-full h-full px-4 py-4 md:py-8 ">
                <div className="absolute max-md:hidden top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/45 -z-10 mask-b-to-transparent mask-b-to-100%"></div>

                <div className="relative flex flex-col gap-8 w-full md:w-4/5 p-2 md:p-4 lg:p-8">

                    {/* Form Header */}
                    <div className="space-y-2 md:space-y-3">
                        <h1 className="font-semibold text-2xl md:text-3xl"> Verify your account </h1>
                        <p className="text-ellipsis-2line text-2xs md:text-xs text-muted">A 6-digit verification code has been sent to <b>{email}</b>. Enter it below to complete your signup.</p>
                    </div>

                    <form onSubmit={handleVerifyToken} className="flex flex-col items-center gap-8">

                        <div className="flex flex-col gap-4 w-full">
                            <Input
                                type="text"
                                placeholder="Enter 6-digit code"
                                value={token}
                                onChange={(e: any) => setToken(e.target.value)}
                                maxLength={6}
                                className="text-center text-xl tracking-widest font-bold"
                                required
                            />
                        </div>

                        {error && <p className="text-xs text-danger text-center"> {error} </p>}

                        <div className="ring-2 ring-muted/10 hover:ring-primary/40 active::ring-primary/45 p-px w-full rounded-xl">
                            <button
                                type="submit"
                                disabled={loading || token.length < 6}
                                className="font-semibold text-white/95 w-full px-4 p-2 bg-primary rounded-xl disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "Verify Code"}
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-col items-center w-full">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={loading}
                            className="text-xs text-muted hover:text-foreground underline"
                        >
                            Didn't receive a code? Resend
                        </button>

                        <hr className="w-full border-t border-muted/25 my-4 mask-x-to-transparent mask-x-from-45%" />
                        {/* Legal Links */}
                        <nav className="flex flex-wrap items-center">
                            {LegalLinks.map((item, index) => (
                                <Link key={index} to={item.path} className="flex justify-center text-3xs sm:text-2xs text-muted hover:underline active:underline after:content-['•'] after:mx-2 last:after:content-none"> {item.label} </Link>
                            ))}
                        </nav>
                    </div>
                </div>

            </div>

            <div className="absolute left-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
        </section>

    )
}

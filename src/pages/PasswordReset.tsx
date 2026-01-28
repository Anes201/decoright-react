import Spinner from "@/components/common/Spinner"
import HeroImg from "/password/password-reset.svg"
import { PButton } from "@/components/ui/Button"
import { SCTALink } from "@/components/ui/CTA"
import { EmailInput } from "@/components/ui/Input"
import { PATHS } from "@/routers/Paths"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { EMAIL_REGEX } from "@/utils/validators"
import { supabase } from "@/lib/supabase"


export default function PasswordReset () {

    const [email, setEmail] = useState('')
    const [emailValid, setEmailValid] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setEmailValid(EMAIL_REGEX.test(email.trim()))
    }, [email])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!emailValid) {
            setError("Please enter a valid email")
            return
        }

        setLoading(true)
        setError(null)

        const redirectTo = new URL(PATHS.CLIENT.PASSWORD_SET, window.location.origin);

        try {
            const { error: SubmitError } = await supabase.auth.resetPasswordForEmail(
                email.trim(),
                {redirectTo: redirectTo.toString()}
            )

            if (SubmitError) throw SubmitError

            navigate(PATHS.PASSWORD_SENT)
        } catch (err: any) {
            setError(err.message || "Something went wrong!, please try again later.")
        } finally {
            setLoading(false)
        }
    }

    const navigate = useNavigate();
    function handleGoBack(e:any){
        e.preventDefault();
        navigate(-1);
    }

    return (
        <main>
            <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full mt-8">

                <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>
                <div className="relative flex flex-col items-center gap-8 w-full h-full px-2 sm:px-8 md:px-16 p-4 md:py-8">
                    <div className="absolute max-md:hidden top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/45 -z-10 mask-b-to-transparent mask-b-to-100%"></div>


                    <div className="flex flex-col items-center w-full">
                        <div className="w-1/3">
                            <img src={HeroImg} alt="" className="w-full h-full" />
                        </div>

                        <div className="space-y-2 text-center">
                            <h1 className="font-semibold text-xl md:text-3xl"> Forgot your password ? </h1>
                            <p className="text-xs md:text-sm"> Lorem ipsum dolor sit amet consectetur adipisicing elit, unde sunt, sint suscipit est asperiores facere deleniti ipsa corrupti quo. </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} id="password-reset-form" className="w-full">
                        <div>
                            <label htmlFor="password"
                            className="text-xs text-muted mx-1"
                            > Email account </label>
                            <EmailInput id="email" onChange={(e:any)=>(setEmail(e.target.value))} />
                        </div>

                        {error && <p className="text-xs text-danger text-center"> {error} </p>}

                        {/* CTA */}
                        <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit mt-4">
                            <PButton type="submit" form="password-reset-form"
                            className={`w-full h-fit ${!email && 'cursor-not-allowed'}`}
                            disabled={ !emailValid || loading }
                            area-label="send email to recover password"
                            title={emailValid ? 'Send email to recover password' : 'Enter a valid email' }
                            >
                                <Spinner status={loading} size="sm"> Send Email </Spinner>
                            </PButton>
                            <SCTALink to={PATHS.LOGIN} onClick={handleGoBack} className="w-full"> Cancel </SCTALink>
                        </div>
                    </form>

                </div>

                <div className="absolute left-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
            </section>
        </main>
    )
}
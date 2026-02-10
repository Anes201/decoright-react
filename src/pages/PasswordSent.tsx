
import HeroImg from "/password/password-sent.svg"
import { ICONS } from "@/icons";
import { PATHS } from "@/routers/Paths";
import { Link, useNavigate } from "react-router-dom";


export default function PasswordSent() {

    // const location = useLocation()
    // const [loading, setLoading] = useState(false)
    // const [error, setError] = useState<string | null>(null)

    // // Get email from navigation state or query params
    // const email = location.state?.email || new URLSearchParams(location.search).get('email')

    // async function handleResend () {
    //     if (!email) return
    //     setLoading(true)
    //     setError(null)
    //     try {
    //         const { error: resendError } = await supabase.auth.resend({
    //             type: "password_reset", // !!!
    //             email: email,
    //         })
    //         if (resendError) throw resendError
    //         alert("Verification code resent to your email")
    //     } catch (err: any) {
    //         setError(err.message || "Failed to resend code")
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const navigate = useNavigate();
    function handleGoBack(e: any) {
        e.preventDefault();
        navigate(-1);
    }

    return (
        <main>
            <section className="h-hero min-h-hero max-w-220 mx-auto relative flex flex-col items-center justify-center w-full mt-8">

                <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden" />
                <div className="relative flex flex-col gap-8 w-full h-full px-2 sm:px-8 md:px-16 p-4 md:py-8">
                    <div className="absolute max-md:hidden top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/45 -z-10 mask-b-to-transparent mask-b-to-100%" />


                    <div className="flex flex-col items-center w-full">
                        <div className="w-1/3">
                            <img src={HeroImg} alt="" className="w-full h-full" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="font-semibold text-xl md:text-3xl"> Check Your Email </h1>
                            <p className="text-xs md:text-sm"> We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password. </p>
                        </div>
                    </div>


                    {/* CTA */}
                    <div className="flex items-center gap-4 w-full sm:w-fit">

                        {/* {error && <p className="text-xs text-danger text-center"> {error} </p>} */}

                        <Link to={PATHS.PASSWORD_RESET} onClick={handleGoBack}
                            className="flex items-center gap-2 font-medium text-xs md:text-sm text-center w-fit hover:underline active:underline"
                        > <ICONS.arrowLeft className="size-4" /> Go back </Link>

                        {/* <button
                            type="button"
                            onClick={handleResend}
                            disabled={loading}
                            className="font-medium text-xs md:text-sm text-center w-fit px-3 py-2 border border-muted/10 bg-surface rounded-full shadow-xs hover:bg-emphasis active:emphasis"
                        >
                            Resend
                        </button> */}
                    </div>

                </div>

                <div className="absolute left-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden" />
            </section>
        </main>
    )
}
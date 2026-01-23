
import Spinner from "@/components/common/Spinner";
import { PButton } from "@/components/ui/Button";
import { SCTALink } from "@/components/ui/CTA";
import { Input, PasswordInput } from "@/components/ui/Input";
import { PASSWORD_MIN_LENGTH } from "@/config";
import { PASSWORD_REGEX } from "@/config/regex";
import { ICONS } from "@/icons";
import { PATHS } from "@/routers/Paths";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordSet () {

    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Validate length + no whitespace
    useEffect(() => {
        setPasswordValid(PASSWORD_REGEX.test(password));
    }, [password]);

    // Check password match
    useEffect(() => {
        setPasswordsMatch(password !== "" && password === password2);
    }, [password, password2]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setLoading(true)
        setError(null)

        try {

            navigate(PATHS.VERIFY_OTP)
        } catch (err: any) {
            console.error("Password set error details:", err)
            setError(err.message || "Failed to set the new password")
        } finally {
            setLoading(false)
        }
    }

    return (

        <main>
            <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full mt-8">

                <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

                <div className="relative flex flex-col justify-center gap-4 w-full h-full px-2 sm:px-8 md:px-16 p-4 md:py-8">
                    <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/75 -z-10 mask-b-to-transparent mask-b-to-100%"></div>

                    <div className="flex flex-col items-center w-full mb-8">
                        <div className="w-1/3">
                            {/* <img src={HeroImg} alt="" className="w-full h-full" /> */}
                        </div>

                        <div className="space-y-2 text-center">
                            <h1 className="font-semibold text-xl md:text-3xl"> Forgot your password ? </h1>
                            <p className="text-xs md:text-sm"> Lorem ipsum dolor sit amet consectetur adipisicing elit, unde sunt, sint suscipit est asperiores facere deleniti ipsa corrupti quo. </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password"
                            className="font-medium text-xs text-muted"
                            > Password </label>
                            <PasswordInput id="password" onChange={(e:any) => setPassword(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="password2"
                            className="font-medium text-xs text-muted"
                            > Re-type Password </label>
                            <PasswordInput id="password2" onChange={(e:any) => setPassword2(e.target.value)} />
                        </div>

                    <ul className="flex flex-col gap-2 ">

                        <li className="flex items-center gap-2">
                            { passwordValid ? <ICONS.checkCircle className="size-4 text-success"/> : <ICONS.informationCircle className="size-4"/> }
                            <p className="text-xs text-muted">Password must be at least {PASSWORD_MIN_LENGTH} characters and contain no spaces.</p>
                        </li>

                        <li className="flex items-center gap-2">
                            { passwordsMatch ? <ICONS.checkCircle className="size-4 text-success"/> : <ICONS.informationCircle className="size-4"/> }
                            <p className="text-xs text-muted"> Passwords must have a match</p>
                        </li>

                    </ul>

                        {/* CTA */}
                        <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit mt-8">
                            <PButton type="submit" form="service-request-form"
                            className="w-full h-fit"
                            disabled={ !passwordValid || !passwordsMatch }
                            title="Set New Password"
                            >
                                <Spinner status={loading}> Set Password </Spinner>
                            </PButton>
                            <SCTALink to={-1} className="w-full"> Cancel </SCTALink>
                        </div>
                    </form>


                </div>

                <div className="absolute left-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
            </section>
        </main>

    )
}


import Spinner from "@/components/common/Spinner";
import { PButton } from "@/components/ui/Button";
import { SCTALink } from "@/components/ui/CTA";
import { PasswordInput } from "@/components/ui/Input";
import { PASSWORD_MIN_LENGTH } from "@/config";
import { PASSWORD_REGEX } from "@/utils/validators";
import { ICONS } from "@/icons";
import { supabase } from "@/lib/supabase";
import { PATHS } from "@/routers/Paths";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordSet() {

    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const [pageLoading, setPageLoading] = useState(true)
    const [allowed, setAllowed] = useState(false);

    // Form Loading State
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setError("Invalid or expired password reset link.");
                setPageLoading(false);
                return;
            }

            // Recovery session (page refresh safe)
            if (session.user.recovery_sent_at) {
                setAllowed(true);
                setPageLoading(false);
                return;
            }

            // Not a normal signed-in user
            setError("This page is only accessible from a password reset email.");
            setPageLoading(false);
        };

        checkSession();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (
                    event === "PASSWORD_RECOVERY" &&
                    session?.user.recovery_sent_at
                ) {
                    setAllowed(true);
                    setPageLoading(false);
                }
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    // Validate length + no whitespace
    useEffect(() => {
        setPasswordValid(PASSWORD_REGEX.test(newPassword));
    }, [newPassword]);

    // Check password match
    useEffect(() => {
        setPasswordsMatch(newPassword !== "" && newPassword === confirmPassword);
    }, [newPassword, confirmPassword]);


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setError(null)


        if (!passwordValid || !passwordsMatch) {
            setError("Invalid password or passwords does not match")
            return;
        }

        // Block if we don't have a verified recovery session
        if (!allowed) {
            setError(
                "This password reset link is invalid or expired. Please request a new password reset link."
            );
            return;
        }

        setLoading(true)
        try {

            // Re-check session before proceeding
            const { data: sessionData } = await supabase.auth.getSession();
            const session = sessionData?.session ?? null;
            if (!session || !session.user) {
                setError("Session is invalid. Open the password reset link from your email and try again.");
                return;
            }


            // All checks passed: perform the password update
            const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

            if (updateError) {
                console.error("updateUser error", updateError);
                // User-friendly message
                setError("Failed to set password. Try again or open the reset link again.");
                return;
            }

            // Success: clear url (defensive)
            try {
                history.replaceState(null, "", window.location.pathname);
            } catch { }


            // Success "Password updated. You can now sign in with your new password."
            setNewPassword("");
            setConfirmPassword("");

            navigate(PATHS.CLIENT.PASSWORD_DONE)

        } catch (err) {
            console.error("Unhandled error in set-password", err);
            setError("Unexpected error. Try again later.");
        } finally {
            setLoading(false);
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
                            <h1 className="font-semibold text-xl md:text-3xl"> Create New Password </h1>
                            <p className="text-xs md:text-sm"> Please enter your new password below. Make sure it's secure and something you'll remember. </p>
                        </div>
                    </div>

                    {error && <p className="text-xs text-danger text-center"> {error} </p>}

                    <form onSubmit={handleSubmit} id="password-set-form">
                        <div>
                            <label htmlFor="password"
                                className="font-medium text-xs text-muted"
                            > Password </label>
                            <PasswordInput id="password" disabled={pageLoading}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="confirm-password"
                                className="font-medium text-xs text-muted"
                            > Re-type Password </label>
                            <PasswordInput id="confirm-password" disabled={pageLoading}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} />
                        </div>

                        <ul className="flex flex-col gap-2 ">

                            <li className="flex items-center gap-2">
                                {passwordValid ? <ICONS.checkCircle className="size-4 text-success" /> : <ICONS.informationCircle className="size-4" />}
                                <p className="text-xs text-muted">Password must be at least {PASSWORD_MIN_LENGTH} characters and contain no spaces.</p>
                            </li>

                            <li className="flex items-center gap-2">
                                {passwordsMatch ? <ICONS.checkCircle className="size-4 text-success" /> : <ICONS.informationCircle className="size-4" />}
                                <p className="text-xs text-muted"> Passwords must have a match.</p>
                            </li>

                        </ul>

                        {/* CTA */}
                        <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit mt-8">
                            <PButton type="submit" form="password-set-form"
                                className="w-full h-fit"
                                disabled={!passwordValid || !passwordsMatch || loading || pageLoading}
                                title="Set New Password"
                            >
                                <Spinner status={loading} size="sm"> Set Password </Spinner>
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

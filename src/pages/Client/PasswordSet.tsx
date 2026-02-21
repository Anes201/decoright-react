
import Spinner from "@/components/common/Spinner";
import { PButton } from "@/components/ui/Button";
import { SCTALink } from "@/components/ui/CTA";
import { PasswordInput } from "@/components/ui/Input";
import { PASSWORD_MIN_LENGTH } from "@/config";
import { PASSWORD_REGEX } from "@/utils/validators";
import { CheckCircle, InformationCircle } from "@/icons";
import { supabase } from "@/lib/supabase";
import { PATHS } from "@/routers/Paths";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

    const { t } = useTranslation()

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setError(t('password.reset_access_error'));
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
            setError(t('password.reset_access_error'));
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
            setError(t('password.set_error_invalid_match'))
            return;
        }

        // Block if we don't have a verified recovery session
        if (!allowed) {
            setError(t('password.set_error_link_invalid'));
            return;
        }

        setLoading(true)
        try {

            // Re-check session before proceeding
            const { data: sessionData } = await supabase.auth.getSession();
            const session = sessionData?.session ?? null;
            if (!session || !session.user) {
                setError(t('password.set_error_session_invalid'));
                return;
            }


            // All checks passed: perform the password update
            const { error: updateError } = await supabase.auth.updateUser({ password: newPassword }); // !!! This won't update.

            if (updateError) {
                console.error("updateUser error", updateError);
                // User-friendly message
                setError(t('password.set_error_failed'));
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
            setError(t('errors.generic'));
        } finally {
            setLoading(false);
        }
    }

    return (

        <main>
            <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full mt-8">

                <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

                <div className="relative flex flex-col justify-center gap-4 w-full h-full px-2 sm:px-8 md:px-16 p-4 md:py-8">
                    <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/75 -z-10 mask-b-to-transparent mask-b-to-100%" />

                    <div className="flex flex-col items-center w-full mb-8">
                        <div className="w-1/3">
                            {/* <img src={HeroImg} alt="" className="w-full h-full" /> */}
                        </div>

                        <div className="space-y-4 text-center">
                            <h1 className="font-semibold text-xl md:text-3xl"> {t('password.set_title')} </h1>
                            <p className="text-xs md:text-sm"> {t('password.set_description')} </p>
                        </div>
                    </div>

                    {error && <p className="text-xs text-danger text-center"> {error} </p>}

                    <form onSubmit={handleSubmit} id="password-set-form" className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password"
                                className="font-medium text-xs text-muted px-1"
                            > {t('password.password_label')} </label>
                            <PasswordInput id="password" disabled={pageLoading}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirm-password"
                                className="font-medium text-xs text-muted px-1"
                            > {t('password.password_confirm_label')} </label>
                            <PasswordInput id="confirm-password" disabled={pageLoading}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} />
                        </div>

                        <ul className="flex flex-col gap-4">

                            <li className="flex items-center gap-2">
                                {passwordValid ? <CheckCircle className="size-4 text-success" /> : <InformationCircle className="size-4" />}
                                <p className="text-xs text-muted"> {t('password.helper_requirements', { PASSWORD_MIN_LENGTH: PASSWORD_MIN_LENGTH })}. </p>
                            </li>

                            <li className="flex items-center gap-2">
                                {passwordsMatch ? <CheckCircle className="size-4 text-success" /> : <InformationCircle className="size-4" />}
                                <p className="text-xs text-muted"> {t('password.helper_match')}. </p>
                            </li>

                        </ul>

                        {/* CTA */}
                        <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit mt-8">
                            <PButton type="submit" form="password-set-form"
                                className="w-full h-fit"
                                disabled={!passwordValid || !passwordsMatch || loading || pageLoading}
                                title="Set New Password"
                            >
                                <Spinner status={loading} size="sm"> {t('password.password_set_cta')} </Spinner>
                            </PButton>
                            <SCTALink to={PATHS.PASSWORD_RESET} className="w-full"> {t('common.cancel')} </SCTALink>
                        </div>
                    </form>


                </div>

                <div className="absolute left-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden" />
            </section>
        </main>

    )
}

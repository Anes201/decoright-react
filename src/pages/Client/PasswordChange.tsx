import Spinner from "@/components/common/Spinner";
import { PButton } from "@/components/ui/Button";
import { SCTALink } from "@/components/ui/CTA";
import { PasswordInput } from "@/components/ui/Input";
import { PASSWORD_REGEX } from "@/utils/validators";
import { supabase } from "@/lib/supabase";
import { PATHS } from "@/routers/Paths";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordChange () {

    const navigate = useNavigate()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [newPasswordValid, setNewPasswordValid] = useState(false);
    const [newPasswordsMatch, setNewPasswordsMatch] = useState(false);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Validate length + no whitespace
    useEffect(() => {
        setNewPasswordValid(PASSWORD_REGEX.test(newPassword));
    }, [newPassword]);

    // Check password match
    useEffect(() => {
        setNewPasswordsMatch(newPassword !== "" && newPassword === confirmPassword);
    }, [newPassword, confirmPassword]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError(null);

        if(!newPasswordValid || !newPasswordsMatch) {
            setError("Invalid password or passwords does not match")
            return;
        }

        setLoading(true);
        try {
            const {
                data: { user: currentUser },
                error: getUserError,
            } = await supabase.auth.getUser();

            if (getUserError) {
                console.error("getUser error", getUserError);
                setError("Unable to verify user session. Please login again.");
                return;
            }

            if (!currentUser?.email) {
                setError("No authenticated user. Please sign in again.");
                return;
            }

            const email = currentUser.email;

            // re-authenticate: try sign-in with email + current password.
            // If password is wrong, supabase will return an error.
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password: currentPassword,
            });

            if (signInError) {
                // Common reasons: wrong password, user disabled, etc.
                // Do not be verbose about which one for security; a simple message is fine.
                setError("Current password is incorrect.");
                return;
            }

            // Optional safety check: ensure the reauth returned the same user id
            if (signInData?.user && signInData.user.id !== currentUser.id) {
                // Extremely unlikely, but check anyway
                console.warn("Re-authenticated user id mismatch", { original: currentUser.id, reauth: signInData.user.id });
                setError("Authentication mismatch. Try logging out and logging back in.");
                return;
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
                // User data updated at ?
                }
            )

            if (updateError) {
                console.error("Password update failed", updateError);
                setError("Failed to update password. Please try again.");
                return;
            }

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            navigate(PATHS.CLIENT.PASSWORD_DONE)
        } catch (err: any) {
            console.error("Unhandled error in password change", err);
            setError("An unexpected error occurred. Try again later.");
        } finally {
            setLoading(false)
        }
    }

    return (

        <main>
            <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full mt-8">

                <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

                <div className="relative flex flex-col justify-center gap-8 w-full h-full px-2 sm:px-8 md:px-16 p-4 md:py-8">
                    <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/75 -z-10 mask-b-to-transparent mask-b-to-100%"></div>

                    {error && <p className="text-xs text-danger text-center"> {error} </p>}

                    <form onSubmit={handleSubmit} id="password-change-form">
                        <div>
                            <label htmlFor="current-password"
                            className="font-medium text-xs text-muted"
                            > Current Password </label>
                            <PasswordInput id="current-password" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="new-password"
                            className="font-medium text-xs text-muted"
                            > New Password </label>
                            <PasswordInput id="new-password" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="new-password2"
                            className="font-medium text-xs text-muted"
                            > Re-type New Password </label>
                            <PasswordInput id="new-password2" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} />
                        </div>

                        {/* CTA */}
                        <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit mt-4">
                            <PButton type="submit" form="password-change-form"
                            className="w-full h-fit"
                            disabled={!currentPassword || !newPassword || !confirmPassword || loading}
                            title="Submit request"
                            >
                                <Spinner status={loading}> Change Password </Spinner>
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

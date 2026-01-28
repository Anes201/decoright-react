import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "@/components/ui/Input";
import { PATHS } from "@/routers/Paths";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) throw updateError;

            alert("Password updated successfully!");
            navigate(PATHS.LOGIN);
        } catch (err: any) {
            setError(err.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full md:mt-8">
            <div className="relative flex justify-center items-center w-full h-full px-4 py-4 md:py-8">
                <div className="absolute max-md:hidden top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/45 -z-10 mask-b-to-transparent mask-b-to-100%"></div>
                <div className="relative flex flex-col gap-8 w-full md:w-4/5 p-2 md:p-4 lg:p-8">
                    <div className="space-y-2 md:space-y-3">
                        <h1 className="font-semibold text-2xl md:text-3xl"> Reset Your Password </h1>
                        <p className="text-2xs md:text-xs text-muted">Enter your new password below to regain access to your account.</p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="flex flex-col items-center gap-6">
                        <div className="flex flex-col gap-4 w-full">
                            <PasswordInput
                                id="new-password"
                                label="New Password"
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                                required
                            />
                            <PasswordInput
                                id="confirm-password"
                                label="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e: any) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {error && <p className="text-xs text-danger text-center"> {error} </p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="font-semibold text-white/95 w-full px-4 p-2 bg-primary rounded-xl disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

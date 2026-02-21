
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useNavigate, Link } from "react-router-dom"
import { PATHS } from "@/routers/Paths"
import { EmailInput, Input, PasswordInput } from "../ui/Input"
import { LegalLinks } from "../../constants"
import Spinner from "../common/Spinner"
import { useTranslation } from "react-i18next"

export function SignupLayout() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { t } = useTranslation()

    // Normalizes Algerian local phone formats to international E.164 format
    const normalizePhone = (raw: string): string => {
        let p = raw.trim().replace(/[\s\-().]/g, '');
        if (p.startsWith('05') || p.startsWith('06') || p.startsWith('07')) {
            return '+213' + p.slice(1);
        } else if (/^[567]\d{8}$/.test(p)) {
            return '+213' + p;
        } else if (p.startsWith('00213')) {
            return '+' + p.slice(2);
        } else if (p.startsWith('213') && p.length === 12) {
            return '+' + p;
        }
        return p; // already international or unknown format
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // --- Client-side validation ---
            if (!firstName.trim() || !lastName.trim()) {
                throw new Error(t('auth.error_name_required') || 'Please enter your full name.')
            }

            const phoneDigits = phone.trim().replace(/[\s\-().]/g, '')
            if (phoneDigits.length < 9) {
                throw new Error(t('auth.error_invalid_phone') || 'Please enter a valid phone number.')
            }

            const normalizedPhone = normalizePhone(phone)

            // --- Check for duplicate phone number ---
            const { data: existingPhone } = await supabase
                .from('profiles')
                .select('id')
                .eq('phone', normalizedPhone)
                .maybeSingle()

            if (existingPhone) {
                throw new Error(t('auth.error_phone_taken') || 'This phone number is already linked to an account.')
            }

            // --- Attempt signup (Supabase handles duplicate email) ---
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: `${firstName} ${lastName}`.trim(),
                        phone: normalizedPhone
                    }
                }
            })

            if (signupError) {
                // Map Supabase errors to human-readable messages
                if (signupError.message.toLowerCase().includes('already registered') ||
                    signupError.message.toLowerCase().includes('user already exists')) {
                    throw new Error(t('auth.error_email_taken') || 'An account with this email already exists. Try logging in.')
                }
                if (signupError.message.toLowerCase().includes('password')) {
                    throw new Error(t('auth.error_weak_password') || 'Password must be at least 6 characters.')
                }
                throw signupError
            }

            if (!data.user) throw new Error(t('auth.error_failed_signup'))

            navigate(PATHS.VERIFY_OTP, { state: { email } })
        } catch (err: any) {
            console.error("Signup error:", err)
            setError(err.message || t('auth.error_failed_signup'))
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="relative flex flex-col gap-8 w-full md:w-4/5 md:pt-8">

            {/* Form Header */}
            <div className="flex flex-col items-center gap-3">
                <h1 className="font-semibold text-center text-lg xs:text-2xl md:text-4xl"> {t('auth.signup_to')} <span className="text-transparent bg-linear-to-br from-foreground to-primary to-65% bg-clip-text">DecoRight</span> </h1>
                <p className="text-ellipsis-2line text-2xs md:text-xs text-muted">{t('auth.signup_description')}</p>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col items-center gap-8">

                <div className="flex flex-col gap-4 w-full">
                    <div className="flex max-xs:flex-col md:flex-col lg:flex-row gap-3 md:gap-4 w-full">
                        <Input type="text" placeholder={t('auth.placeholders.first_name')} value={firstName} onChange={(e: any) => setFirstName(e.target.value)} required />
                        <Input type="text" placeholder={t('auth.placeholders.last_name')} value={lastName} onChange={(e: any) => setLastName(e.target.value)} required />
                    </div>
                    <Input type="tel" placeholder={t('auth.placeholders.phone')} value={phone} onChange={(e: any) => setPhone(e.target.value)} required />
                    <EmailInput value={email} onChange={(e: any) => setEmail(e.target.value)} required />
                    <PasswordInput value={password} onChange={(e: any) => setPassword(e.target.value)} required />
                </div>

                {error && <p className="text-xs text-danger text-center"> {error} </p>}

                <div className="ring-2 ring-muted/10 hover:ring-primary/40 active::ring-primary/45 p-px w-full rounded-xl">
                    <button
                        type="submit"
                        disabled={loading}
                        className="font-semibold text-white/95 w-full px-4 p-2 bg-primary rounded-xl disabled:opacity-50"
                    >
                        <Spinner status={loading} size="sm"> {t('auth.signup')} </Spinner>
                    </button>
                </div>
            </form>

            <div className="flex flex-col items-center w-full">
                <Link to={'/login'}> <p className="text-xs text-muted"> {t('auth.already_have_account')} <span className="font-medium text-foreground hover:underline active:underline"> {t('auth.login_now')} </span> </p> </Link>
                <hr className="w-full border-t border-muted/25 my-4 mask-x-to-transparent mask-x-from-45%" />
                {/* Legal Links */}
                <nav className="flex flex-wrap items-center">
                    {LegalLinks.map((item, index) => (
                        <Link key={index} to={item.path} className="flex justify-center text-3xs sm:text-2xs text-muted hover:underline active:underline after:content-['•'] after:mx-2 rtl:after:mx-2 last:after:content-none"> {t(`footer.legal.${item.key}`)} </Link>
                    ))}
                </nav>
            </div>
        </div>

    )
}
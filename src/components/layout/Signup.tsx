
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useNavigate, Link } from "react-router-dom"
import { PATHS } from "@/routers/Paths"
import { EmailInput, Input, PasswordInput } from "../ui/Input"
import { LegalLinks } from "../../constants"
import Spinner from "../common/Spinner"

export function SignupLayout() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: `${firstName} ${lastName}`.trim(),
                    }
                }
            })

            if (signupError) throw signupError
            if (!data.user) throw new Error("Signup failed")

            navigate(PATHS.VERIFY_OTP, { state: { email } })
        } catch (err: any) {
            console.error("Signup error details:", err)
            setError(err.message || "Failed to sign up")
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="relative flex flex-col gap-8 w-full md:w-4/5 md:pt-8">

            {/* Form Header */}
            <div className="flex flex-col items-center gap-3">
                <h1 className="font-semibold text-2xl md:text-4xl"> Sign Up to <span className="text-transparent bg-linear-to-br from-foreground to-primary to-65% bg-clip-text">DecoRight</span> </h1>
                <p className="text-ellipsis-2line text-2xs md:text-xs text-muted">Create an account to start your design journey with us.</p>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col items-center gap-8">

                <div className="flex flex-col gap-4 w-full">
                    <div className="flex max-xs:flex-col md:flex-col lg:flex-row gap-3 md:gap-4 w-full">
                        <Input type="text" placeholder="First name" value={firstName} onChange={(e: any) => setFirstName(e.target.value)} required />
                        <Input type="text" placeholder="Last name" value={lastName} onChange={(e: any) => setLastName(e.target.value)} required />
                    </div>
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
                        <Spinner status={loading} size="sm"> Sign Up </Spinner>
                    </button>
                </div>
            </form>

            <div className="flex flex-col items-center w-full">
                <Link to={'/login'}> <p className="text-xs text-muted"> Already have an account? <span className="font-medium text-foreground hover:underline active:underline"> Login </span> </p> </Link>
                <hr className="w-full border-t border-muted/25 my-4 mask-x-to-transparent mask-x-from-45%" />
                {/* Legal Links */}
                <nav className="flex flex-wrap items-center">
                    {LegalLinks.map((item, index) => (
                        <Link key={index} to={item.path} className="flex justify-center text-3xs sm:text-2xs text-muted hover:underline active:underline after:content-['•'] after:mx-2 last:after:content-none"> {item.label} </Link>
                    ))}
                </nav>
            </div>
        </div>

    )
}
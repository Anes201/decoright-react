
import { Link } from "react-router-dom"

import { HeroSection } from "../ui/HeroSection"
import { EmailInput, EmailOrPhoneInput, Input, PasswordInput } from "../ui/Input"

import { images } from "../../constants"
import { LegalLinks } from "../../constants"


export function SignupHero(){
    return (

        <HeroSection>

            {/* Section Styling */}
            <div className="max-md:hidden absolute top-0 left-0 w-full h-full md:p-2 rounded-4xl -z-10 md:mask-r-to-transparent">
                <div className="w-full h-full bg-surface rounded-3xl"></div>
            </div>

            {/* Bg style */}
            {/* <div className="max-md:hidden absolute top-0 left-0 w-full h-full bg-primary/15 rounded-4xl -z-10 mask-l-to-transparent mask-l-to-30%"></div> */}

            {/* login form side  */}
            <div className="flex justify-center items-center w-full">

                <div className="relative flex flex-col gap-8 w-full md:w-4/5 p-2 md:p-4 lg:p-8">

                    {/* Form Header */}
                    <div className="space-y-2 md:space-y-3">
                        <h1 className="font-semibold text-2xl md:text-3xl"> Sign Up to <span className="text-transparent bg-linear-to-br from-foreground to-primary to-65% bg-clip-text">DecoRight</span> </h1>
                        <p className="text-ellipsis-2line text-2xs md:text-xs text-muted">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab dignissimos incidunt atque velit eos iusto deserunt sunt cupiditate quis illo facere nihil aliquid, magnam </p>
                    </div>

                    <form action="." className="flex flex-col items-center gap-8">

                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex max-xs:flex-col md:flex-col lg:flex-row gap-3 md:gap-4 w-full">
                                <Input type="text" placeholder="First name" />
                                <Input type="text" placeholder="Last name" />
                            </div>
                            <EmailOrPhoneInput />
                            <PasswordInput />
                        </div>

                        <div className="ring-2 ring-muted/10 hover:ring-primary/40 active::ring-primary/45 p-px w-full rounded-xl">
                            <button type="submit" className="font-semibold text-white/95 w-full px-4 p-2 bg-primary rounded-xl" > Sign Up </button>
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

            </div>

            {/* visual contact side */}
            <div className="max-md:hidden flex justify-center w-2/3 xl:w-full">
                <img src={images[6]} alt="" className="w-2/3" />
            </div>

        </HeroSection>

    )
}
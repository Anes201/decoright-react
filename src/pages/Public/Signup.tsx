
import { SignupLayout } from "@components/layout/Signup"

export default function SignupPage(){
    return (

        <main>
            <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full md:mt-8 ">
                <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden" />

                <div className="relative flex justify-center items-center w-full h-full md:py-8 ">
                    <div className="absolute max-md:hidden top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/45 -z-10 mask-b-to-transparent mask-b-to-100%" />
                    <SignupLayout />

                </div>

                <div className="absolute left-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden" />
            </section>
        </main>

    )
}
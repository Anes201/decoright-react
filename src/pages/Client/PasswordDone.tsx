import { LogoutButton } from "@/components/common/Confirm";
import { ICONS } from "@/icons";
import { PATHS } from "@/routers/Paths";
import { Link } from "react-router-dom";


export default function PasswordDone() {

    return (

        <main>
            <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full mt-8">

                <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

                <div className="relative flex flex-col justify-center gap-6 w-full h-full px-2 sm:px-8 md:px-16 p-4 md:py-8">
                    <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/75 -z-10 mask-b-to-transparent mask-b-to-100%"></div>

                    <div className="flex flex-col items-center w-full mb-8">
                        <div className="w-1/3">
                            {/* <img src={HeroImg} alt="" className="w-full h-full" /> */}
                        </div>

                        <div className="space-y-2 text-center">
                            <h1 className="font-semibold text-xl md:text-3xl"> Password Reset Successful </h1>
                            <p className="text-xs md:text-sm"> Your password has been successfully updated. You can now use your new password to access your account. </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-center gap-4 w-full">

                        <Link to={PATHS.ROOT}
                            className="flex items-center gap-2 font-medium text-xs md:text-sm text-center px-4 py-2 bg-emphasis rounded-lg"
                        > <ICONS.home /> Home </Link>

                        <LogoutButton
                            className="flex items-center gap-2 font-medium text-xs md:text-sm text-center px-3 py-2 border border-muted/25 rounded-lg"
                        > <span className="flex gap-4"> Logout <ICONS.arrowRightStartOnRectangle /></span> </LogoutButton>

                    </div>

                </div>

                <div className="absolute left-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
            </section>
        </main>

    )
}

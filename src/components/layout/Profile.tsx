import { Link } from "react-router-dom";
import { images } from "../../constants";
import { ICONS } from "../../icons";


export function Profile(){
    return (
        <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full mt-8">

            <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

            <div className="relative w-full h-full px-4 py-4 md:px-8 md:py-8 ">
                <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/75 -z-10 mask-b-to-transparent mask-b-to-100%"></div>
                <div className="absolute top-20 md:top-35 left-0 w-full border-b border-b-muted/15 -z-10"></div>

                <div className="flex flex-col gap-8 max-md:flex-col">

                    <div className="flex flex-col items-center gap-2">
                        {/* Profile Image */}
                        <div className="w-fit h-25 md:h-40 p-1 md:p-2 aspect-square border border-muted/15 rounded-full bg-background overflow-hidden">
                            <img src={images[7]} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                        </div>

                        <div className="flex flex-col text-center">
                            <h4 className="font-semibold text-lg"> Michael Pearson </h4>
                            <p className="text-2xs md:text-xs"> Joined at Jan 2, 2026 </p>
                        </div>
                    </div>

                    {/* User Information */}

                    <div className="space-y-8">

                        <div className="flex items-center gap-4">
                            <h3 className="font-semibold text-2xs md:text-xs text-foreground/75 min-w-max"> Personal Information </h3>
                            <hr className="w-full border-0 border-b border-muted/15" />
                            <Link to={'/profile-edit'} className="p-2 border border-muted/15 bg-surface/75 rounded-lg"> {ICONS.pencilSquare({})} </Link>
                        </div>
                        <ul className="flex flex-col gap-8 w-full">

                            <li className="flex w-full gap-4">
                                <div className="h-full aspect-square p-2 border border-muted/15 bg-surface rounded-lg">
                                    <ICONS.envelope className="size-6"/>
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="email-info" className="font-medium text-xs"> Email </label>
                                    <p id="email-info" className="text-xs text-foreground"> example@gmail.com </p>
                                </div>
                            </li>

                            <li className="flex w-full gap-4">
                                <div className="h-full aspect-square p-2 border border-muted/15 bg-surface rounded-lg">
                                    <ICONS.phone className="size-6"/>
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="phone-info" className="font-medium text-xs"> Phone </label>
                                    <p id="phone-info" className="text-xs text-foreground"> +123456789123 </p>
                                </div>
                            </li>

                            <li className="flex w-full gap-4">
                                <div className="h-full aspect-square p-2 border border-muted/15 bg-surface rounded-lg">
                                    <ICONS.userCircle className="size-6"/>
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="role-info" className="font-medium text-xs"> Role </label>
                                    <p id="role-info" className="text-xs text-foreground"> Customer </p>
                                </div>
                            </li>

                        </ul>
                    </div>

                </div>

            </div>

            <div className="absolute left-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
        </section>
    )
}
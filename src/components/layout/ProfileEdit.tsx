
import { images } from "../../constants";
import { ICONS } from "../../icons";
import { EmailInput, Input, PhoneInput } from "../ui/Input";
import { PButton } from "../ui/Button";
import { SCTALink } from "../ui/CTA";


export function ProfileEdit(){
    return (
        <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full mt-8">

            <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

            <div className="relative w-full h-full px-4 py-4 md:px-8 md:py-8">
                <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/75 -z-10 mask-b-to-transparent mask-b-to-100%"></div>
                <div className="absolute top-20 md:top-35 left-0 w-full border-b border-b-muted/15 -z-10"></div>

                <form action="." method="post" className="flex flex-col items-center gap-8 max-md:flex-col" encType="multipart/form-data">

                    {/* Profile Image */}
                    <div className="group/item relative w-fit h-25 md:h-40 p-1 md:p-2 aspect-square border border-muted/15 rounded-full bg-background overflow-hidden">
                        <label htmlFor="fileToUpload" className="absolute hidden group-hover/item:flex group-active/item:flex items-center justify-center top-0 left-0 w-full h-full bg-muted/35 cursor-pointer"> {ICONS.arrowUpTray({className:'text-white size-8'})} </label>
                        <input type="file" name="fileToUpload" id="fileToUpload" className="hidden" />
                        <img src={images[7]} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    </div>


                    <div className="flex flex-col w-full gap-3 md:gap-4">

                        <div className="flex max-xs:flex-col md:flex-col lg:flex-row gap-3 md:gap-4 w-full">
                            <Input type="text" placeholder="First name" className={'bg-surface/45'} />
                            <Input type="text" placeholder="Last name" className={'bg-surface/45'}  />
                        </div>

                        <EmailInput className={'bg-surface/45'} />

                        <PhoneInput className={'bg-surface/45'} />

                        {/* CTA */}
                        <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full">
                            <PButton type="submit" className="w-full"> Save </PButton>
                            <SCTALink to={'/profile'} className="w-full"> Cancel </SCTALink>
                        </div>

                    </div>



                </form>

            </div>

            <div className="absolute left-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
        </section>
    )
}
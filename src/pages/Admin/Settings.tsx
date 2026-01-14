
import { Input } from "@/components/ui/Input";
import { SocialMediaFields } from "@/constants";


export default function Settings () {
    return (
        <main>
            <section className="h-hero min-h-hero relative flex flex-col w-full h-full">

                <h1 className="font-semibold text-lg md:text-2xl mb-4"> Settings & Policies </h1>
                <div className="flex flex-col gap-2 md:gap-4 h-full md:p-4 md:bg-surface rounded-xl">
                    <h2 className="font-medium text-sm"> Company Contact </h2>

                    <form action="." method="POST" encType="multipart/form-data"
                    className="flex flex-col gap-4">

                        <div>
                            {SocialMediaFields.map((social)=>(
                                <Input id={social.id} type="url" placeholder={social.label} className="pl-8 sm:pl-10">
                                    <span className="absolute px-1.5 left-0.5 md:left-1"> {social.icon} </span>
                                </Input>
                            ))}
                        </div>
                    </form>
                </div>

            </section>
        </main>
    )
}

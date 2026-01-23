import Spinner from "@/components/common/Spinner";
import { PButton } from "@/components/ui/Button";
import { SCTALink } from "@/components/ui/CTA";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

export default function PasswordChange () {

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPassword2, setNewPassword2] = useState('')
    const [loading, setLoading] = useState(false)

    function handleSubmit() {}

    return (

        <main>
            <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full mt-8">

                <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

                <div className="relative flex flex-col justify-center gap-8 w-full h-full px-2 sm:px-8 md:px-16 p-4 md:py-8">
                    <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/75 -z-10 mask-b-to-transparent mask-b-to-100%"></div>


                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="current-password"
                            className="font-medium text-xs text-muted"
                            > Current Password </label>
                            <Input id="current-password" />
                        </div>
                        <div>
                            <label htmlFor="current-password"
                            className="font-medium text-xs text-muted"
                            > Current Password </label>
                            <Input id="current-password" />
                        </div>
                        <div>
                            <label htmlFor="current-password"
                            className="font-medium text-xs text-muted"
                            > Current Password </label>
                            <Input id="current-password" />
                        </div>

                        {/* CTA */}
                        <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit mt-4">
                            <PButton type="submit" form="service-request-form"
                            className="w-full h-fit"
                            disabled={!currentPassword || !newPassword || !newPassword2}
                            title="Submit request"
                            >
                                <Spinner status={loading}> Submit Request </Spinner>
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

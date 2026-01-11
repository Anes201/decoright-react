
import { serviceSpaceTypes, serviceTypes, userPhoneIsVerified } from '../../constants'
import { PButton } from '../ui/Button'
import { SCTALink } from '../ui/CTA'
import { SelectMenu } from '../ui/Select'
import { DateInput } from '../ui/Input'
import FileUploadPanel from '../ui/FileUploadPanel'
import { ICONS } from '@/icons'
import { Link } from 'react-router-dom'
import { PATHS } from '@/routers/Paths'

export function RequestService(){

    return (
        <section className="h-hero min-h-hero content-container relative flex flex-col items-center justify-center w-full">

            <div className="absolute right-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl bg-surface/25 mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

            <div className="relative flex flex-col gap-6 w-full h-full p-3 md:p-8">
                <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-3xl bg-surface -z-10 mask-b-to-transparent mask-b-to-100%"></div>

                {/* Header */}
                <div className="flex justify-between gap-4">
                    <div className="space-y-2 w-full">
                        <h2 className='font-semibold text-lg'> Request Service Form </h2>
                        <p className='text-2xs md:text-xs'> Submit your details to create a private conversation. Admins will evaluate the request in the chat and respond with next steps. </p>
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-fit">
                        <PButton type="submit" className="w-fit h-fit"> Submit Request </PButton>
                    </div>
                </div>

                { !userPhoneIsVerified &&

                    <div className="group/hint flex max-md:flex-col gap-6 justify-center md:items-end p-3 md:p-4 border border-warning/75 bg-warning/8 rounded-xl">
                        <div className="w-full">
                            <div>
                                <ICONS.exclamationTriangle className="size-6 text-warning" />
                                <span className="font-medium text-lg text-warning group-hover/hint:text-foreground group-active/hint:text-foreground"> Phone verification required </span>
                            </div>
                            <p className="text-xs md:text-sm text-warning group-hover/hint:text-foreground group-active/hint:text-foreground mix-blend-multiply"> Verify your phone to access this service request. We’ll send a code when you tap the button. </p>
                        </div>
                        <Link to={PATHS.CLIENT.VERIFY_PHONE}
                        className="font-medium text-sm text-center text-white min-w-max h-fit max-md:w-full px-3 py-1 border border-warning bg-warning/75 rounded-lg hover:text-white active:text-white hover:bg-warning active:bg-warning">
                            Get Verified
                        </Link>
                    </div>
                }

                <form action="." method="POST" encType="multipart/form-data" className="flex flex-col gap-8 w-full h-fit" id="service-request-form">

                    {/* Input Data */}
                    <div className="flex max-md:flex-col gap-8 w-full h-full">

                        <div className="flex flex-col gap-6 w-full h-full">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="select-service-design-style" className="font-medium text-xs text-muted px-1"> Service Type </label>
                                <SelectMenu options={serviceTypes} placeholder="Select a Service Type" id="select-service-design-style" required />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="select-service-space-type" className="font-medium text-xs text-muted px-1"> Space Category </label>
                                <SelectMenu options={serviceSpaceTypes} placeholder="Select a Space Type" id="select-service-space-type" required />
                            </div>

                            <div className="relative flex flex-col gap-2">
                                <label htmlFor="select-service-design-style" className="group/date font-medium text-xs text-muted px-1"> When do you need this completed? </label>
                                <DateInput name="service-request-date" id="service-request-date"
                                className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-xl cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                            </div>


                            <div className="flex flex-col gap-2 h-full">
                                <label htmlFor="request-service-description" className="font-medium text-xs text-muted px-1"> Description </label>
                                <textarea name="description" id="request-service-description" rows={5} placeholder='Write a description...' required
                                className="w-full h-full p-2.5 text-sm bg-emphasis/75 rounded-xl outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45">
                                </textarea>
                            </div>
                        </div>

                        {/* Upload Files Container */}
                        <div className="flex flex-col gap-6 w-full h-full">

                            <div className="relative flex flex-col gap-2">
                                <label htmlFor="service-request-area" className="group/date font-medium text-xs text-muted px-1"> Area in m² </label>

                                <div id="service-request-area" className="flex max-sm:flex-col gap-3 md:gap-4">
                                    <input type="number" name="service-request-area-width" id="service-request-area-width" placeholder="Width"
                                    className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-xl cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                                    <input type="number" name="service-request-area-height" id="service-request-area-height" placeholder="Height"
                                    className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-xl cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                                </div>
                            </div>


                            <FileUploadPanel />
                        </div>

                    </div>
                    {/* CTA */}
                    <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit">
                        <PButton type="submit" className="w-full"> Submit Request </PButton>

                        {/* TODO: Redirect to back in history, NOT HOME */}
                        <SCTALink to={'/home'} className="w-full"> Cancel </SCTALink>
                    </div>
                </form>

            </div>

            <div className="absolute left-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl bg-surface/25 mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
        </section>
    )
}


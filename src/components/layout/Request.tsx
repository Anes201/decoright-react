
import { serviceSpaceTypes, serviceDesignStyle } from '../../constants'
import { PButton } from '../ui/Button'
import { SCTALink } from '../ui/CTA'
import { SelectMenu } from '../ui/Select'
import { DateInput } from '../ui/Input'
import FileUploadPanel from '../ui/FileUploadPanel'

export function RequestService(){

    return (
        <section className="h-hero min-h-hero content-container relative flex flex-col items-center justify-center w-full">

            <div className="absolute right-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

            <div className="relative flex flex-col gap-6 w-full h-full p-3 md:p-8">
                <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-3xl -z-10 mask-b-to-transparent mask-b-to-100%"></div>

                {/* Header */}
                <div className='space-y-2'>
                    <h2 className='font-semibold text-lg'> Request Service Form </h2>
                    <p className='text-2xs md:text-xs'> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid accusamus est laudantium dignissimos. </p>
                </div>

                <form action="." method="POST" encType="multipart/form-data" className="flex flex-col gap-8 w-full h-fit">

                    {/* Input Data */}
                    <div className="flex max-md:flex-col gap-8 w-full h-full">

                        <div className="flex flex-col gap-6 w-full h-full">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="select-service-space-type" className="font-medium text-xs text-muted px-1"> Space Type </label>
                                <SelectMenu options={serviceSpaceTypes} placeholder="Select a Space Type" id="select-service-space-type" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="select-service-design-style" className="font-medium text-xs text-muted px-1"> Design Style </label>
                                <SelectMenu options={serviceDesignStyle} placeholder="Select a Design Style" id="select-service-design-style" />
                            </div>

                            <div className="relative flex flex-col gap-2">
                                <label htmlFor="select-service-design-style" className="group/date font-medium text-xs text-muted px-1"> Date Finish </label>
                                <DateInput name="service-request-date" id="service-request-date"
                                className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-xl cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                            </div>


                            <div className="flex flex-col gap-2 h-full">
                                <label htmlFor="request-service-description" className="font-medium text-xs text-muted px-1"> Description </label>
                                <textarea name="description" id="request-service-description" rows={5} placeholder='Write a description...'
                                className="w-full h-full p-2.5 text-sm bg-emphasis/75 rounded-xl outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45">
                                </textarea>
                            </div>
                        </div>

                        {/* Upload Files Container */}
                        <div className="flex flex-col gap-6 w-full h-full">
                            <FileUploadPanel />
                        </div>

                    </div>


                    {/* CTA */}
                    <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full">
                        <PButton type="submit" className="w-full"> Submit </PButton>

                        {/* TODO: Redirect to back in history, NOT HOME */}
                        <SCTALink to={'/home'} className="w-full"> Cancel </SCTALink>
                    </div>

                </form>

            </div>

            <div className="absolute left-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
        </section>
    )
}



import Select from 'react-select'
import { serviceTypes } from '../../constants'
import { PButton } from '../ui/Button'
import { SCTALink } from '../ui/CTA'
import { ICONS } from '../../icons'

export function RequestService(){
    return (
        <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full mt-8">

            <div className="absolute right-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

            <div className="relative flex flex-col gap-6 w-full h-full px-4 py-4 md:px-8 md:py-8">
                <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-3xl -z-10 mask-b-to-transparent mask-b-to-100%"></div>

                {/* Header */}
                <div className='space-y-2'>
                    <h2 className='font-semibold text-lg'> Request Service Form </h2>
                    <p className='text-2xs md:text-xs'> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid accusamus est laudantium dignissimos. </p>
                </div>

                <form action="." method="POST" encType="multipart/form-data" className="flex flex-col gap-8 w-full h-full">


                    <div className="flex flex-col gap-2">
                        <label htmlFor="select-project-type" className="font-medium text-xs text-muted px-1"> Project Type </label>
                    {/* TODO: Style this select element, to fit website styling | Make ur own */}
                        <Select options={serviceTypes} placeholder="Select a Project Type" classNamePrefix="react-select" id="select-project-type"
                        className="react-select-container placeholder:text-xs" unstyled
                        classNames={{
                            menuList: () => "min-scrollbar"
                        }} />

                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="request-service-description" className="font-medium text-xs text-muted px-1"> Description </label>
                        <textarea name="description" id="request-service-description" rows={5} placeholder='Write a description...'
                        className="w-full p-3 text-sm bg-emphasis/75 rounded-xl outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45">
                        </textarea>
                    </div>

                    <div className='w-full'>
                        <label htmlFor="filesToUpload" className='flex items-center justify-between gap-4 w-full h-full p-2 border border-muted/25 bg-emphasis/75 rounded-xl cursor-pointer'>

                            <div className="flex items-center px-2">
                                <span> <ICONS.documentArrowUp className='size-5 text-muted'/> </span>
                                <span className='text-sm text-muted px-2'> Attach Files </span>
                            </div>
                            <span className="font-semibold text-sm text-center min-w-max px-2 md:px-3 py-1.5 text-white/96 bg-primary rounded-lg"> Upload </span>
                        </label>
                        <input type="file" name="filesToUpload" id="filesToUpload" className="hidden" multiple />
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


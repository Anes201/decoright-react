import { useState } from 'react'
import { serviceSpaceTypes, serviceDesignStyle } from '../../constants'
import { PButton } from '../ui/Button'
import { SCTALink } from '../ui/CTA'
import { SelectMenu } from '../ui/Select'
import { Input } from '../ui/Input'
import FileUploadPanel from '../ui/FileUploadPanel'
import { RequestService as ReqSvc } from '@/services/request.service'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthProvider'
import { PATHS } from '@/routers/Paths'
import { useEffect } from 'react'

export function RequestService() {
    const { user, loading: authLoading } = useAuth()
    const [spaceType, setSpaceType] = useState<string>("")
    const [serviceType, setServiceType] = useState<string>("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    const [areaSqm, setAreaSqm] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!authLoading && !user) {
            navigate(PATHS.SIGNUP)
        }
    }, [user, authLoading, navigate])

    if (authLoading) return <div>Loading...</div>
    if (!user) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!spaceType || !serviceType || !location) {
            setError("Please fill in all required fields (Space Type, Service Type, Location)")
            return
        }

        setLoading(true)
        setError(null)

        try {
            await ReqSvc.createRequest({
                service_type: serviceType as any,
                space_type: spaceType as any,
                location: location,
                area_sqm: areaSqm ? parseFloat(areaSqm) : null,
                description: description,
            })

            navigate(PATHS.CLIENT.SERVICE_REQUEST_LIST)
        } catch (err: any) {
            setError(err.message || "Failed to submit request")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="h-hero min-h-hero content-container relative flex flex-col items-center justify-center w-full">

            <div className="absolute right-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

            <div className="relative flex flex-col gap-6 w-full h-full p-3 md:p-8">
                <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-3xl -z-10 mask-b-to-transparent mask-b-to-100%"></div>

                {/* Header */}
                <div className='space-y-2'>
                    <h2 className='font-semibold text-lg'> Request Service Form </h2>
                    <p className='text-2xs md:text-xs'> Fill in the details below to request a new design service. </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full h-fit">

                    {/* Input Data */}
                    <div className="flex max-md:flex-col gap-8 w-full h-full">

                        <div className="flex flex-col gap-6 w-full h-full">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="select-service-space-type" className="font-medium text-xs text-muted px-1"> Space Type </label>
                                <SelectMenu
                                    options={serviceSpaceTypes}
                                    placeholder="Select a Space Type"
                                    id="select-service-space-type"
                                    value={serviceSpaceTypes.find(s => s.value === spaceType)}
                                    onChange={(option: any) => setSpaceType(option.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="select-service-design-style" className="font-medium text-xs text-muted px-1"> Service Type </label>
                                <SelectMenu
                                    options={serviceDesignStyle}
                                    placeholder="Select a Service Type"
                                    id="select-service-design-style"
                                    value={serviceDesignStyle.find(s => s.value === serviceType)}
                                    onChange={(option: any) => setServiceType(option.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="request-location" className="font-medium text-xs text-muted px-1"> Location </label>
                                <Input
                                    id="request-location"
                                    placeholder="Enter physical location"
                                    value={location}
                                    onChange={(e: any) => setLocation(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="request-area" className="font-medium text-xs text-muted px-1"> Area (sqm) </label>
                                <Input
                                    id="request-area"
                                    type="number"
                                    placeholder="Optional area in square meters"
                                    value={areaSqm}
                                    onChange={(e: any) => setAreaSqm(e.target.value)}
                                />
                            </div>


                            <div className="flex flex-col gap-2 h-full">
                                <label htmlFor="request-service-description" className="font-medium text-xs text-muted px-1"> Description </label>
                                <textarea
                                    name="description"
                                    id="request-service-description"
                                    rows={5}
                                    placeholder='Write a description...'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full h-full p-2.5 text-sm bg-emphasis/75 rounded-xl outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45"
                                >
                                </textarea>
                            </div>

                            {error && <p className="text-xs text-danger"> {error} </p>}
                        </div>

                        {/* Upload Files Container */}
                        <div className="flex flex-col gap-6 w-full h-full">
                            <FileUploadPanel />
                        </div>

                    </div>


                    {/* CTA */}
                    <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full">
                        <PButton type="submit" className="w-full" disabled={loading}>
                            {loading ? "Submitting..." : "Submit"}
                        </PButton>

                        <SCTALink to={'/home'} className="w-full"> Cancel </SCTALink>
                    </div>

                </form>

            </div>

            <div className="absolute left-full w-full h-[calc(100svh-20rem)] md:h-[calc(100svh-18rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
        </section>
    )
}


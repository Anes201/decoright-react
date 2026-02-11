
import Spinner from "@/components/common/Spinner";
import { PButton } from "@/components/ui/Button";
import { SCTALink } from "@/components/ui/CTA";
import { Input, TextArea } from "@/components/ui/Input";
import type { ServiceTypeInsert } from "@/services/service-types.service";
import { SpaceTypesService } from "@/services/space-types.service";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { slugify } from "@/utils/texts";
import { PATHS } from "@/routers/Paths";
import { useForm, type SubmitHandler } from "react-hook-form"
import { ICONS } from "@/icons";

interface FormValues {
    'service-space-title-en': string;
    'service-space-title-fr': string;
    'service-space-title-ar': string;
    'service-space-description': string;
}

export default function ServiceSpaceCreateLayout() {

    const { register, formState: { errors }, setError, handleSubmit: handleValidate } = useForm<FormValues>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit: SubmitHandler<FormValues> = async (data, e?: React.BaseSyntheticEvent) => {
        e?.preventDefault();

        // const newErrors = {};
        // if (!formData[titleEN]) {newErrors[titleEN] = "Title is required"};
        // if(!slug) {setError("Title is invalid")};

        const titleEN = data['service-space-title-en'] as string;
        const titleFR = data['service-space-title-fr'];
        const titleAR = data['service-space-title-ar'];
        const description = data['service-space-description'];
        const slug = slugify(titleEN);

        setLoading(true);

        try {

            // Create the service space here
            const payload: ServiceTypeInsert = {
                name: slug, // ? Steeln: should this be used as a slug ?
                display_name_en: titleEN,
                display_name_fr: titleFR,
                display_name_ar: titleAR,
                description: description,
            }

            const result = await SpaceTypesService.create(payload);
            toast.success('Space service has been created!')

            navigate(PATHS.ADMIN.serviceSpaceListItem(result.id)); // Go back after success
        } catch (error: any) {
            console.error("Failed to create service:", error);
            if (error.code === '23505') {
                // Handle unique constraint violation
                console.error('Record already exists:', error.message);
                setError('root', { type: 'server', message: 'These details is already exists for another space service.' });
                setError('service-space-title-en', { type: 'server', message: 'This title must be unique and cannot be duplicated.' });
            }
            toast.error('Please fix the highlighted errors on the form.')
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleValidate(handleSubmit)} id="service-create-form" className="flex flex-col gap-10">

            {/* Inputs & Data */}
            <div className="flex max-lg:flex-col gap-8 w-full h-full">
                <div className="flex flex-col gap-6 w-full h-full">

                    {errors['root'] &&
                        <div className="flex items-center gap-2 w-full h-fit p-3 border border-danger/45 rounded-lg">
                            <ICONS.informationCircle className="size-5 text-danger" />
                            <p className="text-sm text-danger text-center">{errors['root']?.message}</p>
                        </div>
                    }

                    <div className="flex flex-col gap-2 w-full h-full">
                        <label htmlFor="service-space-title-en" className="font-medium text-xs text-muted px-1"> English Title </label>
                        <Input type="text" id="service-space-title-en" placeholder="Space Service Title"
                            // name="service-space-title-en" name is declared inside {...register} down blow.
                            className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg"
                            error={errors['service-space-title-en']?.message}
                            {...register('service-space-title-en', { required: 'Title is required' })}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full h-full">
                        <label htmlFor="service-space-title-fr" className="font-medium text-xs text-muted px-1"> French Title </label>
                        <Input type="text" id="service-space-title-fr" placeholder="Space Service Title"
                            className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg"
                            error={errors['service-space-title-fr']?.message}
                            {...register('service-space-title-fr')}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full h-full">
                        <label htmlFor="service-space-title-ar" className="font-medium text-xs text-muted px-1"> Arabic Title </label>
                        <Input type="text" id="service-space-title-ar" placeholder="Space Service Title"
                            className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg"
                            error={errors['service-space-title-ar']?.message}
                            {...register('service-space-title-ar')}
                        />

                    </div>

                    <div className="flex flex-col gap-2 h-full">
                        <label htmlFor="service-space-description" className="font-medium text-xs text-muted px-1"> Description </label>
                        <TextArea id="service-space-description" rows={5} placeholder='Space Service description...'
                            error={errors['service-space-description']?.message}
                            {...register('service-space-description')} />
                    </div>

                </div>
            </div>

            {/* CTA & Submit */}
            <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit">
                <PButton type="submit" className="w-full" disabled={loading}>
                    <Spinner status={loading} size="sm"> Create a Space </Spinner>
                </PButton>
                <SCTALink to={-1} className="w-full"> Cancel </SCTALink>
            </div>
        </form>
    )
}
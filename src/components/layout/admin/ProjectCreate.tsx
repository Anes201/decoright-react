import Spinner from "@/components/common/Spinner";
import { PButton } from "@/components/ui/Button";
import { SCTALink } from "@/components/ui/CTA";
import FileUploadPanel from "@/components/ui/FileUploadPanel";
import { DateInput, Input } from "@/components/ui/Input";
import { SelectMenu } from "@/components/ui/Select";
import { projectVisibility, serviceSpaceTypes, serviceTypes } from "@/constants";
import { AdminService } from "@/services/admin.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectCreateLayout() {
    const [loading, setLoading] = useState(false);
    const [serviceType, setServiceType] = useState<string>("");
    const [spaceType, setSpaceType] = useState<string>("");
    const [visibility, setVisibility] = useState<string>("public");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const payload: any = {
                title: formData.get('project-title') as string,
                description: formData.get('description') as string,
                service_type: serviceType as any,
                space_type: spaceType as any,
                visibility: visibility as any,
                construction_start_date: formData.get('project-construction-start-date') as string,
                construction_end_date: formData.get('project-construction-end-date') as string,
            }

            const areaSqm = formData.get('area-sqm') as any;
            if (areaSqm) payload.area_sqm = parseFloat(areaSqm);

            await AdminService.createProject(payload);
            navigate(-1); // Go back after success

        } catch (error) {
            console.error("Failed to create project:", error);
            alert("Failed to create project. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} id="create-project-form" className="flex flex-col gap-10">
            {/* Inputs & Data */}
            <div className="flex max-lg:flex-col gap-8 w-full h-full">
                <div className="flex flex-col gap-6 w-full h-full">

                    <div className="flex flex-col gap-2 h-full">
                        <label htmlFor="project-title" className="font-medium text-xs text-muted px-1"> Title </label>
                        <input type="text" name="project-title" id="project-title" placeholder="Project Title" required
                        className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                    </div>

                    <div className="flex flex-col gap-2 h-full">
                        <label htmlFor="project-description" className="font-medium text-xs text-muted px-1"> Description </label>
                        <textarea name="description" id="project-description" rows={5} placeholder='Project description...' required
                            className="w-full h-full p-2.5 text-sm bg-emphasis/75 rounded-lg outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45">
                        </textarea>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1"> Service Type </label>
                        <SelectMenu
                            options={serviceTypes}
                            placeholder="Select a Service Type"
                            id="select-service-design-style"
                            required
                            onChange={(val: any) => setServiceType(val.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1"> Space Category </label>
                        <SelectMenu
                            options={serviceSpaceTypes}
                            placeholder="Select a Space Type"
                            id="select-service-space-type"
                            required
                            onChange={(val: any) => setSpaceType(val.value)}
                        />
                    </div>

                    <div className="relative flex flex-col gap-2">
                        <label htmlFor="area-sqm" className="font-medium text-xs text-muted px-1"> Area in m² </label>
                        <Input
                            id="area-sqm"
                            name="area-sqm"
                            type="number"
                            placeholder="Area in square meters"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1" title="Project Visibility"> Visibility </label>
                        <SelectMenu
                            options={projectVisibility}
                            placeholder="Project Visibility"
                            id="project-visibility"
                            required
                            onChange={(val: any) => setVisibility(val.value)}
                        />
                    </div>

                    <div className="relative flex gap-4">
                        <div className="relative flex flex-col gap-2 w-full">
                            <label className="group/date font-medium text-xs text-muted px-1"> Project Start Date </label>
                            <DateInput name="project-construction-start-date" id="project-construction-start-date"
                                className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                        </div>

                        <div className="relative flex flex-col gap-2 w-full">
                            <label className="group/date font-medium text-xs text-muted px-1"> Project Finish Date </label>
                            <DateInput name="project-construction-end-date" id="project-construction-end-date"
                                className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                        </div>
                    </div>

                    <FileUploadPanel />
                </div>
            </div>

            {/* CTA & Submit */}
            <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit">
                <PButton type="submit" className="w-full" disabled={loading}>
                    <Spinner status={loading} size="sm"> Create Project </Spinner>
                </PButton>
                <SCTALink to={'/admin'} className="w-full"> Cancel </SCTALink>
            </div>
        </form>
    )
}
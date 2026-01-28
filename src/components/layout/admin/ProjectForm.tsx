import { PButton } from "@/components/ui/Button";
import { SCTALink } from "@/components/ui/CTA";
import FileUploadPanel from "@/components/ui/FileUploadPanel";
import { DateInput } from "@/components/ui/Input";
import { SelectMenu } from "@/components/ui/Select";
import { projectVisibility } from "@/constants";
import { AdminService } from "@/services/admin.service";
import { ServiceTypesService, type ServiceType } from "@/services/service-types.service";
import { SpaceTypesService, type SpaceType } from "@/services/space-types.service";
import { useState, useEffect } from "react";
import { useStagedFiles } from "@/hooks/useStagedFiles";
import Spinner from "@/components/ui/Spinner";

interface ProjectFormProps {
    project?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
    const [loading, setLoading] = useState(false);
    const [fetchingOptions, setFetchingOptions] = useState(true);
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
    const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);

    // Form State
    const [serviceType, setServiceType] = useState<string>("");
    const [spaceType, setSpaceType] = useState<string>("");
    const [visibility, setVisibility] = useState<string>("PUBLIC");

    const stagedFiles = useStagedFiles(AdminService.uploadProjectImage);
    const { files, setFiles } = stagedFiles;

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setFetchingOptions(true);
                const [services, spaces] = await Promise.all([
                    ServiceTypesService.getActive(),
                    SpaceTypesService.getActive(),
                ]);
                setServiceTypes(services);
                setSpaceTypes(spaces);
            } catch (error) {
                console.error("Failed to fetch form options:", error);
            } finally {
                setFetchingOptions(false);
            }
        };
        fetchOptions();
    }, []);

    // Initialize state when project prop changes (Edit Mode)
    useEffect(() => {
        if (project) {
            setServiceType(project.service_type_id || "");
            setSpaceType(project.space_type_id || "");
            setVisibility(project.visibility || "PUBLIC");

            if (project.project_images) {
                setFiles(project.project_images.map((img: any) => ({
                    id: img.id,
                    url: img.image_url,
                    status: 'complete',
                    file: null
                })));
            }
        } else {
            // Reset for Create Mode
            setServiceType("");
            setSpaceType("");
            setVisibility("PUBLIC");
            setFiles([]);
        }
    }, [project, setFiles]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get('project-title') as string;
        const description = formData.get('description') as string;
        const location = formData.get('project-location') as string;
        const width = Number(formData.get('project-area-width'));
        const height = Number(formData.get('project-area-height'));
        const startDate = formData.get('project-construction-start-date') as string;
        const endDate = formData.get('project-construction-end-date') as string;

        try {
            const uploading = files.some(f => f.status === 'uploading');
            if (uploading) {
                alert("Please wait for all images to finish uploading.");
                setLoading(false);
                return;
            }

            const imageUrls = files
                .filter(f => f.status === 'complete' && f.url)
                .map(f => f.url as string);

            const projectData = {
                title,
                description,
                location,
                service_type_id: serviceType,
                space_type_id: spaceType,
                area_sqm: width * height,
                visibility: visibility as any,
                construction_start_date: startDate || null,
                construction_end_date: endDate || null,
                thumbnail_url: imageUrls[0] || null,
            };

            if (project) {
                // UPDATE Existing Project
                await AdminService.updateProject(project.id, projectData);
                // Update images (overwrite existing)
                await AdminService.addProjectImages(project.id, imageUrls, true);
            } else {
                // CREATE New Project
                const newProject = await AdminService.createProject(projectData);
                if (imageUrls.length > 0) {
                    await AdminService.addProjectImages(newProject.id, imageUrls);
                }
            }

            onSuccess();
        } catch (error) {
            console.error("Failed to save project:", error);
            alert("Failed to save project.");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingOptions) return <div className="p-10 text-center"><Spinner className="w-8 h-8" /></div>;

    const areaWidth = project ? Math.sqrt(project.area_sqm || 0) : undefined;

    return (
        <form onSubmit={handleSubmit} id="project-form" className="flex flex-col gap-8 h-full">
            <div className="flex flex-col gap-6 flex-1 overflow-y-auto px-1 min-scrollbar">

                {/* Basic Info */}
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="project-title" className="font-medium text-xs text-muted px-1"> Title </label>
                        <input
                            type="text"
                            name="project-title"
                            id="project-title"
                            defaultValue={project?.title}
                            placeholder="e.g. Modern Villa Renovation"
                            required
                            className="w-full p-2.5 text-sm text-heading bg-surface border border-muted/20 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="project-location" className="font-medium text-xs text-muted px-1"> Location </label>
                        <input
                            type="text"
                            name="project-location"
                            id="project-location"
                            defaultValue={project?.location}
                            placeholder="e.g. Dubai, UAE"
                            required
                            className="w-full p-2.5 text-sm text-heading bg-surface border border-muted/20 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="project-description" className="font-medium text-xs text-muted px-1"> Description </label>
                        <textarea
                            name="description"
                            id="project-description"
                            rows={4}
                            defaultValue={project?.description}
                            placeholder="Describe the project..."
                            required
                            className="w-full p-2.5 text-sm text-heading bg-surface border border-muted/20 rounded-lg focus:outline-none focus:border-primary/50 transition-colors resize-none"
                        />
                    </div>
                </div>

                {/* Classification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1"> Service Type </label>
                        <SelectMenu
                            options={serviceTypes.map(s => ({ label: s.display_name_en, value: s.id }))}
                            defaultValue={project ? { label: project.service_types?.display_name_en, value: project.service_type_id } : undefined}
                            placeholder="Select Service"
                            id="select-service-type"
                            required
                            onChange={(val: any) => setServiceType(val.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1"> Space Category </label>
                        <SelectMenu
                            options={spaceTypes.map(s => ({ label: s.display_name_en, value: s.id }))}
                            defaultValue={project ? { label: project.space_types?.display_name_en, value: project.space_type_id } : undefined}
                            placeholder="Select Space"
                            id="select-space-type"
                            required
                            onChange={(val: any) => setSpaceType(val.value)}
                        />
                    </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1"> Area Dimensions (m) </label>
                        <div className="flex gap-4">
                            <input
                                type="number"
                                name="project-area-width"
                                placeholder="Width"
                                defaultValue={areaWidth ? Math.round(areaWidth) : undefined}
                                className="w-full p-2.5 text-sm text-heading bg-surface border border-muted/20 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                            />
                            <input
                                type="number"
                                name="project-area-height"
                                placeholder="Height"
                                defaultValue={areaWidth ? Math.round(areaWidth) : undefined}
                                className="w-full p-2.5 text-sm text-heading bg-surface border border-muted/20 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1"> Construction Dates </label>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <DateInput
                                    name="project-construction-start-date"
                                    id="project-construction-start-date"
                                    defaultValue={project?.construction_start_date}
                                    placeholder="Start Date"
                                    className="w-full p-2.5 text-sm text-heading bg-surface border border-muted/20 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                            <div className="w-full">
                                <DateInput
                                    name="project-construction-end-date"
                                    id="project-construction-end-date"
                                    defaultValue={project?.construction_end_date}
                                    placeholder="End Date"
                                    className="w-full p-2.5 text-sm text-heading bg-surface border border-muted/20 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media & Settings */}
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1"> Visibility </label>
                        <SelectMenu
                            options={projectVisibility}
                            defaultValue={projectVisibility.find(v => v.value.toUpperCase() === (project?.visibility || 'public').toUpperCase())}
                            placeholder="Project Visibility"
                            id="project-visibility"
                            required
                            onChange={(val: any) => setVisibility(val.value)}
                        />
                    </div>

                    <FileUploadPanel stagedFiles={stagedFiles} />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-muted/10 mt-auto">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2.5 text-sm font-semibold text-muted hover:text-heading hover:bg-emphasis/50 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <PButton type="submit" className="flex-[2]" disabled={loading}>
                    {loading ? (project ? "Updating..." : "Creating...") : (project ? "Save Changes" : "Create Project")}
                </PButton>
            </div>
        </form>
    );
}

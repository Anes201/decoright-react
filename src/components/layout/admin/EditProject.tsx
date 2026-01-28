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
import { useNavigate, useParams } from "react-router-dom";
import { useStagedFiles } from "@/hooks/useStagedFiles";
import Spinner from "@/components/ui/Spinner";

export default function EditProjectForm() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [project, setProject] = useState<any>(null);
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
    const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);
    const [serviceType, setServiceType] = useState<string>("");
    const [spaceType, setSpaceType] = useState<string>("");
    const [visibility, setVisibility] = useState<string>("PUBLIC");
    const navigate = useNavigate();

    const stagedFiles = useStagedFiles(AdminService.uploadProjectImage);
    const { files, setFiles } = stagedFiles;

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setFetching(true);
                const [services, spaces, projectData] = await Promise.all([
                    ServiceTypesService.getActive(),
                    SpaceTypesService.getActive(),
                    AdminService.getProjects({ slug: id }), // Or use id if needed, AdminService.getProjects handles both in some cases or we can adjust
                ]);

                setServiceTypes(services);
                setSpaceTypes(spaces);

                // If not found by slug, try by ID
                let targetProject = projectData && projectData.length > 0 ? projectData[0] : null;
                if (!targetProject) {
                    const dataById = await AdminService.getProjects(); // Fetch all and find, or we could add getProjectById
                    targetProject = dataById?.find((p: any) => p.id === id);
                }

                if (targetProject) {
                    setProject(targetProject);
                    setServiceType(targetProject.service_type_id);
                    setSpaceType(targetProject.space_type_id);
                    setVisibility(targetProject.visibility);

                    // Populate existing images
                    if (targetProject.project_images) {
                        setFiles(targetProject.project_images.map((img: any) => ({
                            id: img.id,
                            url: img.image_url,
                            status: 'complete',
                            file: null
                        })));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch project data:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!project) return;
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

            await AdminService.updateProject(project.id, {
                title,
                description,
                location,
                service_type_id: serviceType,
                space_type_id: spaceType,
                area_sqm: width * height,
                visibility: visibility as any,
                construction_start_date: startDate,
                construction_end_date: endDate,
                thumbnail_url: imageUrls[0] || null,
            });

            // Update images (simplistic approach: clear and re-add for now)
            // A more robust way would be needed for production
            await AdminService.addProjectImages(project.id, imageUrls);

            navigate(-1);
        } catch (error) {
            console.error("Failed to update project:", error);
            alert("Failed to update project.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 text-center"><Spinner className="w-10 h-10" /></div>;
    if (!project) return <div className="p-10 text-center text-muted">Project not found.</div>;

    const areaWidth = Math.sqrt(project.area_sqm || 0); // Approximation if width/height weren't saved separately

    return (
        <form onSubmit={handleSubmit} id="edit-project-form" className="flex flex-col gap-10">
            <div className="flex max-lg:flex-col gap-8 w-full h-full">
                <div className="flex flex-col gap-6 w-full h-full">
                    <div className="flex flex-col gap-2 h-full">
                        <label htmlFor="project-title" className="font-medium text-xs text-muted px-1"> Title </label>
                        <input type="text" name="project-title" id="project-title" defaultValue={project.title} required
                            className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                    </div>

                    <div className="flex flex-col gap-2 h-full">
                        <label htmlFor="project-location" className="font-medium text-xs text-muted px-1"> Location </label>
                        <input type="text" name="project-location" id="project-location" defaultValue={project.location} required
                            className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                    </div>

                    <div className="flex flex-col gap-2 h-full">
                        <label htmlFor="project-description" className="font-medium text-xs text-muted px-1"> Description </label>
                        <textarea name="description" id="project-description" rows={5} defaultValue={project.description} required
                            className="w-full h-full p-2.5 text-sm bg-emphasis/75 rounded-lg outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45">
                        </textarea>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1"> Service Type </label>
                        <SelectMenu
                            options={serviceTypes.map(s => ({ label: s.display_name_en, value: s.id }))}
                            defaultValue={{ label: project.service_types?.display_name_en, value: project.service_type_id }}
                            placeholder="Select a Service Type"
                            id="select-service-design-style"
                            required
                            onChange={(val: any) => setServiceType(val.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1"> Space Category </label>
                        <SelectMenu
                            options={spaceTypes.map(s => ({ label: s.display_name_en, value: s.id }))}
                            defaultValue={{ label: project.space_types?.display_name_en, value: project.space_type_id }}
                            placeholder="Select a Space Type"
                            id="select-service-space-type"
                            required
                            onChange={(val: any) => setSpaceType(val.value)}
                        />
                    </div>

                    <div className="relative flex flex-col gap-2">
                        <label htmlFor="project-area" className="font-medium text-xs text-muted px-1"> Area in m² (e.g. {project.area_sqm} m²) </label>
                        <div id="project-area" className="flex gap-3 md:gap-4">
                            <input type="number" name="project-area-width" id="project-area-width" placeholder="Width" defaultValue={Math.round(areaWidth)}
                                className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                            <input type="number" name="project-area-height" id="project-area-height" placeholder="Height" defaultValue={Math.round(areaWidth)}
                                className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full h-full">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1"> Visibility </label>
                        <SelectMenu
                            options={projectVisibility}
                            defaultValue={projectVisibility.find(v => v.value.toUpperCase() === project.visibility.toUpperCase())}
                            placeholder="Project Visibility"
                            id="project-visibility"
                            required
                            onChange={(val: any) => setVisibility(val.value)}
                        />
                    </div>

                    <div className="relative flex gap-4">
                        <div className="relative flex flex-col gap-2 w-full">
                            <label className="font-medium text-xs text-muted px-1"> Project Start Date </label>
                            <DateInput name="project-construction-start-date" id="project-construction-start-date" defaultValue={project.construction_start_date}
                                className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                        </div>

                        <div className="relative flex flex-col gap-2 w-full">
                            <label className="font-medium text-xs text-muted px-1"> Project Finish Date </label>
                            <DateInput name="project-construction-end-date" id="project-construction-end-date" defaultValue={project.construction_end_date}
                                className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                        </div>
                    </div>

                    <FileUploadPanel stagedFiles={stagedFiles} />
                </div>
            </div>

            <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit">
                <PButton type="submit" className="w-full" disabled={loading}>
                    {loading ? "Updating..." : "Update Project"}
                </PButton>
                <SCTALink to={PATHS.ADMIN.PROJECTS} className="w-full"> Cancel </SCTALink>
            </div>
        </form>
    );
}

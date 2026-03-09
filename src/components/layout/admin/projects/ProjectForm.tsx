import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { PButton, SButton } from "@/components/ui/Button";
import FileUploadPanel from "@/components/ui/FileUploadPanel";
import { DateInput } from "@/components/ui/Input";
import { SelectMenu } from "@/components/ui/Select";
import { projectVisibilityStags } from "@/constants";
import { AdminService } from "@/services/admin.service";
import { ServiceTypesService, type ServiceType } from "@/services/service-types.service";
import { SpaceTypesService, type SpaceType } from "@/services/space-types.service";
import { useStagedFiles } from "@/hooks/useStagedFiles";
import Spinner from "@/components/common/Spinner";
import { PATHS } from "@/routers/Paths";
import { useConfirm } from "@/components/confirm";
import { Trash } from "lucide-react";

interface ProjectFormProps {
    project?: any;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
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
                toast.error(t('admin.projects.form_options_failed'));
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
                    file: undefined,
                    name: img.id,
                    size: 0,
                    mime: 'image/jpeg',
                    progress: 100
                })));
            }
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
            const failed = files.some(f => f.status === 'failed');

            if (uploading) {
                toast.error(t('admin.projects.form_images_uploading'));
                setLoading(false);
                return;
            }

            if (failed) {
                toast.error(t('admin.projects.form_images_failed'));
                setLoading(false);
                return;
            }

            const imageUrls = files
                .filter(f => f.status === 'complete' && f.url)
                .map(f => f.url as string);

            const projectData = {
                title,
                title_ar: formData.get('title_ar') as string,
                title_fr: formData.get('title_fr') as string,
                description,
                description_ar: formData.get('description_ar') as string,
                description_fr: formData.get('description_fr') as string,
                location,
                location_ar: formData.get('location_ar') as string,
                location_fr: formData.get('location_fr') as string,
                service_type_id: serviceType,
                space_type_id: spaceType,
                width: width || null,
                height: height || null,
                visibility: visibility as any,
                construction_start_date: startDate || null,
                construction_end_date: endDate || null,
                thumbnail_url: imageUrls[0] || null,
            };

            if (project) {
                await AdminService.updateProject(project.id, projectData);
                await AdminService.addProjectImages(project.id, imageUrls, true);
                toast.success(t('admin.projects.form_save_success_update'));
            } else {
                const newProject = await AdminService.createProject(projectData);
                if (imageUrls.length > 0) {
                    await AdminService.addProjectImages(newProject.id, imageUrls);
                }
                toast.success(t('admin.projects.form_save_success_create'));
            }

            if (onSuccess) {
                onSuccess();
            } else {
                navigate(PATHS.ADMIN.PROJECT_LIST);
            }
        } catch (error) {
            console.error("Failed to save project:", error);
            toast.error(t('admin.projects.form_save_failed'));
        } finally {
            setLoading(false);
        }
    };

    function DeleteButton({ id }: { id: string }) {
        const confirm = useConfirm();
        const navigate = useNavigate();
        const { t } = useTranslation();
        const [deleting, setDeleting] = useState(false);

        const handleDelete = async () => {
            const isConfirmed = await confirm({
                title: t('admin.projects.form_confirm_delete_title'),
                description: t('admin.projects.form_confirm_delete_desc'),
                confirmText: t('admin.projects.form_confirm_delete_btn'),
                variant: "destructive"
            });

            if (!isConfirmed) return;

            setDeleting(true);
            try {
                await AdminService.deleteProject(id);
                toast.success(t('admin.projects.form_delete_success'));
                navigate(PATHS.ADMIN.PROJECT_LIST);
            } catch (error) {
                console.error("Delete failed:", error);
                toast.error(t('admin.projects.form_delete_failed'));
            } finally {
                setDeleting(false);
            }
        };

        return (
            <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg transition-colors hover:bg-danger/80 disabled:cursor-not-allowed disabled:bg-danger/50"
            >
                {deleting ? <Spinner status={true} size="sm" /> : <Trash className="size-4 text-white" />}
                {t('admin.projects.form_confirm_delete_btn')}
            </button>
        );
    }

    if (fetchingOptions) {
        return <div className="p-20 flex justify-center"><Spinner status={true} size="lg" /></div>;
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="project-title" className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_title')} </label>
                        <input
                            type="text"
                            name="project-title"
                            id="project-title"
                            defaultValue={project?.title}
                            placeholder="e.g. Modern Villa Renovation"
                            required
                            className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="title_ar" className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_title_ar')} </label>
                        <input type="text" name="title_ar" id="title_ar" defaultValue={project?.title_ar} placeholder="\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0628\u0627\u0644\u0639\u0631\u0628\u064a\u0629" className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45 text-right" dir="rtl" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="title_fr" className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_title_fr')} </label>
                        <input type="text" name="title_fr" id="title_fr" defaultValue={project?.title_fr} placeholder="Titre en fran\u00e7ais" className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="project-location" className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_location')} </label>
                        <input
                            type="text"
                            name="project-location"
                            id="project-location"
                            defaultValue={project?.location}
                            placeholder="e.g. Dubai, UAE"
                            required
                            className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="location_ar" className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_location_ar')} </label>
                        <input type="text" name="location_ar" id="location_ar" defaultValue={project?.location_ar} placeholder="\u0627\u0644\u0645\u0648\u0642\u0639 \u0628\u0627\u0644\u0639\u0631\u0628\u064a\u0629" className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45 text-right" dir="rtl" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="location_fr" className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_location_fr')} </label>
                        <input type="text" name="location_fr" id="location_fr" defaultValue={project?.location_fr} placeholder="Lieu en fran\u00e7ais" className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="project-description" className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_description')} </label>
                        <textarea
                            name="description"
                            id="project-description"
                            rows={6}
                            defaultValue={project?.description}
                            placeholder="Describe the project..."
                            required
                            className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45 resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="description_ar" className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_description_ar')} </label>
                        <textarea name="description_ar" id="description_ar" rows={4} defaultValue={project?.description_ar} placeholder="\u0627\u0644\u0648\u0635\u0641 \u0628\u0627\u0644\u0639\u0631\u0628\u064a\u0629..." className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45 resize-none text-right" dir="rtl" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description_fr" className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_description_fr')} </label>
                        <textarea name="description_fr" id="description_fr" rows={4} defaultValue={project?.description_fr} placeholder="Description en fran\u00e7ais..." className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45 resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_service_type')} </label>
                            <SelectMenu
                                options={serviceTypes.map(s => ({ label: s.display_name_en, value: s.id }))}
                                defaultValue={project ? { label: project.service_types?.display_name_en, value: project.service_type_id } : undefined}
                                placeholder="Select Service"
                                required
                                onChange={(val: any) => setServiceType(val.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_space_category')} </label>
                            <SelectMenu
                                options={spaceTypes.map(s => ({ label: s.display_name_en, value: s.id }))}
                                defaultValue={project ? { label: project.space_types?.display_name_en, value: project.space_type_id } : undefined}
                                placeholder="Select Space"
                                required
                                onChange={(val: any) => setSpaceType(val.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_visibility')} </label>
                        <SelectMenu
                            options={projectVisibilityStags}
                            defaultValue={projectVisibilityStags.find((v: any) => v.value.toUpperCase() === (project?.visibility || 'public').toUpperCase())}
                            placeholder="Project Visibility"
                            required
                            onChange={(val: any) => setVisibility(val.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_dimensions')} </label>
                        <div className="flex gap-4">
                            <input
                                type="number"
                                name="project-area-width"
                                placeholder={t('admin.projects.form_width')}
                                defaultValue={project?.width}
                                className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45"
                            />
                            <input
                                type="number"
                                name="project-area-height"
                                placeholder={t('admin.projects.form_height')}
                                defaultValue={project?.height}
                                className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_start_date')} </label>
                            <DateInput
                                name="project-construction-start-date"
                                defaultValue={project?.construction_start_date}
                                className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-xs text-muted px-1"> {t('admin.projects.form_finish_date')} </label>
                            <DateInput
                                name="project-construction-end-date"
                                defaultValue={project?.construction_end_date}
                                className="w-full p-2.5 text-sm text-heading bg-emphasis/50 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45"
                            />
                        </div>
                    </div>

                    <FileUploadPanel stagedFiles={stagedFiles} />
                </div>
            </div>

            <div className="flex gap-4 border-t border-muted/10 pt-8">
                <div className="flex gap-4">
                    <PButton type="submit" disabled={loading} className="min-w-[150px]">
                        <Spinner status={loading} size="sm"> {project ? t('admin.projects.form_submit_update') : t('admin.projects.form_submit_create')} </Spinner>
                    </PButton>
                    <SButton
                        type="button"
                        onClick={() => onCancel ? onCancel() : navigate(PATHS.ADMIN.PROJECT_LIST)}
                    >
                        {t('admin.projects.form_cancel')}
                    </SButton>
                </div>
                {project &&
                    <DeleteButton id={project.id} />
                }
            </div>
        </form>
    );
}

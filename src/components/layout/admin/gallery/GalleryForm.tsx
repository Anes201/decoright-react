import toast from "react-hot-toast";
import Spinner from "@/components/common/Spinner";
import ProgressBar from "@/components/ui/ProgressBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PButton } from "@/components/ui/Button";
import { SelectMenu } from "@/components/ui/Select";
import { projectVisibilityStags } from "@/constants";
import { AdminService, type GalleryItem } from "@/services/admin.service";
import { PATHS } from "@/routers/Paths";
import { useStagedFiles } from "@/hooks/useStagedFiles";
import { Photo, XMark, ArrowPath } from "@/icons";

interface GalleryFormProps {
    initialData?: GalleryItem;
    isEdit?: boolean;
}

export default function GalleryForm({ initialData, isEdit = false }: GalleryFormProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        title_ar: initialData?.title_ar || "",
        title_fr: initialData?.title_fr || "",
        description: initialData?.description || "",
        description_ar: initialData?.description_ar || "",
        description_fr: initialData?.description_fr || "",
        visibility: initialData?.visibility || "PUBLIC",
    });

    const beforeUpload = useStagedFiles(AdminService.uploadProjectImage);
    const afterUpload = useStagedFiles(AdminService.uploadProjectImage);

    // Initial URLs if any
    const [initialBeforeUrl] = useState(initialData?.before_image_url || "");
    const [initialAfterUrl] = useState(initialData?.after_image_url || "");

    const beforeFile = beforeUpload.files[0];
    const afterFile = afterUpload.files[0];

    const beforePreview = beforeFile?.status === 'complete' ? beforeFile.url : (beforeFile?.file ? URL.createObjectURL(beforeFile.file) : initialBeforeUrl);
    const afterPreview = afterFile?.status === 'complete' ? afterFile.url : (afterFile?.file ? URL.createObjectURL(afterFile.file) : initialAfterUrl);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
        if (type === 'before') {
            beforeUpload.addSingleFile(e.target.files);
        } else {
            afterUpload.addSingleFile(e.target.files);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check statuses of selected files
        const beforeStatus = beforeUpload.files[0]?.status;
        const afterStatus = afterUpload.files[0]?.status;

        const isUploading = beforeStatus === 'uploading' || afterStatus === 'uploading';
        const isFailed = beforeStatus === 'failed' || afterStatus === 'failed';
        const isIdle = (beforeUpload.files.length > 0 && beforeStatus === 'idle') ||
            (afterUpload.files.length > 0 && afterStatus === 'idle');

        if (isUploading || isIdle) {
            toast.error(t('admin.gallery.form_images_uploading'));
            return;
        }

        if (isFailed) {
            toast.error(t('admin.gallery.form_images_failed'));
            return;
        }

        const before_url = beforeUpload.files[0]?.url || initialBeforeUrl;
        const after_url = afterUpload.files[0]?.url || initialAfterUrl;

        if (!before_url || !after_url) {
            toast.error(t('admin.gallery.form_both_required'));
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                before_image_url: before_url,
                after_image_url: after_url,
                visibility: formData.visibility as any
            };

            if (isEdit && initialData) {
                await AdminService.updateGalleryItem(initialData.id, payload);
                toast.success(t('admin.gallery.form_save_success_update'));
            } else {
                await AdminService.createGalleryItem(payload);
                toast.success(t('admin.gallery.form_save_success_create'));
            }

            navigate(PATHS.ADMIN.GALLERY_LIST);
        } catch (error: any) {
            console.error("Failed to save gallery item:", error);
            toast.error(error?.message || t('admin.gallery.form_save_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-xs text-muted px-1"> {t('admin.gallery.form_title')} </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Project Title"
                        required
                        className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium text-xs text-muted px-1"> {t('admin.gallery.form_title_ar')} </label>
                    <input
                        type="text"
                        value={(formData as any).title_ar}
                        onChange={(e) => setFormData({ ...formData, title_ar: e.target.value } as any)}
                        placeholder="\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0628\u0627\u0644\u0639\u0631\u0628\u064a\u0629"
                        className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45 text-right"
                        dir="rtl"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-xs text-muted px-1"> {t('admin.gallery.form_title_fr')} </label>
                    <input
                        type="text"
                        value={(formData as any).title_fr}
                        onChange={(e) => setFormData({ ...formData, title_fr: e.target.value } as any)}
                        placeholder="Titre en fran\u00e7ais"
                        className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium text-xs text-muted px-1"> {t('admin.gallery.form_description')} </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={5}
                        placeholder="Project description..."
                        className="w-full p-2.5 text-sm bg-emphasis/75 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium text-xs text-muted px-1"> {t('admin.gallery.form_description_ar')} </label>
                    <textarea
                        value={(formData as any).description_ar}
                        onChange={(e) => setFormData({ ...formData, description_ar: e.target.value } as any)}
                        rows={4}
                        placeholder="\u0627\u0644\u0648\u0635\u0641 \u0628\u0627\u0644\u0639\u0631\u0628\u064a\u0629..."
                        className="w-full p-2.5 text-sm bg-emphasis/75 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45 text-right"
                        dir="rtl"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-xs text-muted px-1"> {t('admin.gallery.form_description_fr')} </label>
                    <textarea
                        value={(formData as any).description_fr}
                        onChange={(e) => setFormData({ ...formData, description_fr: e.target.value } as any)}
                        rows={4}
                        placeholder="Description en fran\u00e7ais..."
                        className="w-full p-2.5 text-sm bg-emphasis/75 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium text-xs text-muted px-1"> {t('admin.gallery.form_visibility')} </label>
                    <SelectMenu
                        options={projectVisibilityStags}
                        value={projectVisibilityStags.find((v: any) => v.value === formData.visibility)}
                        placeholder="Select Visibility"
                        onChange={(val: any) => setFormData({ ...formData, visibility: val.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Before Image */}
                    <div className="flex flex-col gap-2 border border-muted/15 bg-surface rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium">{t('admin.gallery.form_before_image')}</span>
                            <label className="cursor-pointer bg-emphasis px-3 py-1.5 rounded-md text-xs border border-muted/25 hover:bg-emphasis/80 transition-all">
                                {t('admin.gallery.form_upload')}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => onFileChange(e, 'before')} />
                            </label>
                        </div>
                        {beforePreview ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-muted/10 bg-black/5">
                                <img src={beforePreview} alt="Before" className="w-full h-full object-cover" />
                                {beforeFile?.status === 'uploading' && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-8">
                                        <ProgressBar value={beforeFile.progress} />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => beforeUpload.setFiles([])}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <XMark className="size-4" />
                                </button>
                                {beforeFile?.status === 'failed' && (
                                    <button
                                        type="button"
                                        onClick={() => beforeUpload.retryFile(beforeFile.id)}
                                        className="absolute bottom-2 right-2 p-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                        title="Retry Upload"
                                    >
                                        <ArrowPath className="size-4" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="aspect-video rounded-lg border-2 border-dashed border-muted/10 flex flex-col items-center justify-center text-muted">
                                <Photo className="size-8 mb-2 opacity-20" />
                                <span className="text-3xs uppercase tracking-widest font-bold">{t('admin.gallery.form_no_image')}</span>
                            </div>
                        )}
                    </div>

                    {/* After Image */}
                    <div className="flex flex-col gap-2 border border-muted/15 bg-surface rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium">{t('admin.gallery.form_after_image')}</span>
                            <label className="cursor-pointer bg-emphasis px-3 py-1.5 rounded-md text-xs border border-muted/25 hover:bg-emphasis/80 transition-all">
                                {t('admin.gallery.form_upload')}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => onFileChange(e, 'after')} />
                            </label>
                        </div>
                        {afterPreview ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-muted/10 bg-black/5">
                                <img src={afterPreview} alt="After" className="w-full h-full object-cover" />
                                {afterFile?.status === 'uploading' && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-8">
                                        <ProgressBar value={afterFile.progress} />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => afterUpload.setFiles([])}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <XMark className="size-4" />
                                </button>
                                {afterFile?.status === 'failed' && (
                                    <button
                                        type="button"
                                        onClick={() => afterUpload.retryFile(afterFile.id)}
                                        className="absolute bottom-2 right-2 p-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                        title="Retry Upload"
                                    >
                                        <ArrowPath className="size-4" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="aspect-video rounded-lg border-2 border-dashed border-muted/10 flex flex-col items-center justify-center text-muted">
                                <Photo className="size-8 mb-2 opacity-20" />
                                <span className="text-3xs uppercase tracking-widest font-bold">{t('admin.gallery.form_no_image')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 border-t border-muted/10 pt-8 pb-32">
                <PButton type="submit" disabled={loading} className="min-w-[150px]">
                    <Spinner status={loading} size="sm"> {isEdit ? t('admin.gallery.form_submit_update') : t('admin.gallery.form_submit_create')} </Spinner>
                </PButton>
                <button
                    type="button"
                    onClick={() => navigate(PATHS.ADMIN.GALLERY_LIST)}
                    className="p-button-ghost"
                >
                    {t('admin.gallery.form_cancel')}
                </button>
            </div>
        </form>
    );
}

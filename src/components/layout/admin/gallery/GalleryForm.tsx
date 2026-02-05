import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "@/components/common/Spinner";
import { PButton } from "@/components/ui/Button";
import { SCTALink } from "@/components/ui/CTA";
import { ICONS } from "@/icons";
import { SelectMenu } from "@/components/ui/Select";
import { projectVisibilityStags } from "@/constants";
import { AdminService, type GalleryItem } from "@/services/admin.service";
import { PATHS } from "@/routers/Paths";

interface GalleryFormProps {
    initialData?: GalleryItem;
    isEdit?: boolean;
}

export default function GalleryForm({ initialData, isEdit = false }: GalleryFormProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        visibility: initialData?.visibility?.toLowerCase() || "public",
    });

    const [beforeFile, setBeforeFile] = useState<File | null>(null);
    const [afterFile, setAfterFile] = useState<File | null>(null);
    const [beforePreview, setBeforePreview] = useState<string>(initialData?.before_image_url || "");
    const [afterPreview, setAfterPreview] = useState<string>(initialData?.after_image_url || "");

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === 'before') {
            setBeforeFile(file);
            setBeforePreview(URL.createObjectURL(file));
        } else {
            setAfterFile(file);
            setAfterPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let before_url = initialData?.before_image_url || "";
            let after_url = initialData?.after_image_url || "";

            if (beforeFile) {
                before_url = await AdminService.uploadProjectImage(beforeFile);
            }
            if (afterFile) {
                after_url = await AdminService.uploadProjectImage(afterFile);
            }

            const payload = {
                ...formData,
                before_image_url: before_url,
                after_image_url: after_url,
                visibility: formData.visibility as any
            };

            if (isEdit && initialData) {
                await AdminService.updateGalleryItem(initialData.id, payload);
                toast.success("Gallery item updated successfully!");
            } else {
                await AdminService.createGalleryItem(payload);
                toast.success("Gallery item created successfully!");
            }

            navigate(PATHS.ADMIN.GALLERY_LIST);
        } catch (error: any) {
            console.error("Failed to save gallery item:", error);
            toast.error(error?.message || "Failed to save gallery item.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-xs text-muted px-1"> Title </label>
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
                    <label className="font-medium text-xs text-muted px-1"> Description </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={5}
                        placeholder="Project description..."
                        className="w-full p-2.5 text-sm bg-emphasis/75 rounded-lg outline-1 outline-muted/15 focus:outline-primary/45"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium text-xs text-muted px-1"> Visibility </label>
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
                            <span className="text-sm font-medium">Before Image</span>
                            <label className="cursor-pointer bg-emphasis px-3 py-1.5 rounded-md text-xs border border-muted/25 hover:bg-emphasis/80 transition-all">
                                Upload
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => onFileChange(e, 'before')} />
                            </label>
                        </div>
                        {beforePreview ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-muted/10 bg-black/5">
                                <img src={beforePreview} alt="Before" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setBeforeFile(null); setBeforePreview(""); }}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <ICONS.xMark className="size-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="aspect-video rounded-lg border-2 border-dashed border-muted/10 flex flex-col items-center justify-center text-muted">
                                <ICONS.photo className="size-8 mb-2 opacity-20" />
                                <span className="text-3xs uppercase tracking-widest font-bold">No Image selected</span>
                            </div>
                        )}
                    </div>

                    {/* After Image */}
                    <div className="flex flex-col gap-2 border border-muted/15 bg-surface rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium">After Image</span>
                            <label className="cursor-pointer bg-emphasis px-3 py-1.5 rounded-md text-xs border border-muted/25 hover:bg-emphasis/80 transition-all">
                                Upload
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => onFileChange(e, 'after')} />
                            </label>
                        </div>
                        {afterPreview ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-muted/10 bg-black/5">
                                <img src={afterPreview} alt="After" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setAfterFile(null); setAfterPreview(""); }}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <ICONS.xMark className="size-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="aspect-video rounded-lg border-2 border-dashed border-muted/10 flex flex-col items-center justify-center text-muted">
                                <ICONS.photo className="size-8 mb-2 opacity-20" />
                                <span className="text-3xs uppercase tracking-widest font-bold">No Image selected</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <PButton type="submit" disabled={loading} className="min-w-[150px]">
                    <Spinner status={loading} size="sm"> {isEdit ? "Update Item" : "Create Item"} </Spinner>
                </PButton>
                <SCTALink to={PATHS.ADMIN.GALLERY_LIST}> Cancel </SCTALink>
            </div>
        </form>
    );
}

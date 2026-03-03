import { useState, useEffect, useRef } from 'react';
import { SpaceTypesService, type SpaceTypeWithImages, type SpaceTypeInsert, type SpaceTypeUpdate } from '@/services/space-types.service';
import { useStagedFiles } from '@/hooks/useStagedFiles';
import { Cog, Photo, Plus, XMark } from '@/icons';
import toast from 'react-hot-toast';

const MAX_IMAGES = 5;

interface SpaceTypeFormProps {
    isOpen: boolean;
    spaceType: SpaceTypeWithImages | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SpaceTypeForm({ isOpen, spaceType, onClose, onSuccess }: SpaceTypeFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        display_name_en: '',
        display_name_ar: '',
        display_name_fr: '',
        description: '',
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { files, setFiles, addFiles, removeFile } = useStagedFiles(
        SpaceTypesService.uploadImage.bind(SpaceTypesService)
    );

    // Reset form & pre-populate images on open
    useEffect(() => {
        if (!isOpen) return;

        if (spaceType) {
            setFormData({
                name: spaceType.name,
                display_name_en: spaceType.display_name_en,
                display_name_ar: spaceType.display_name_ar || '',
                display_name_fr: spaceType.display_name_fr || '',
                description: spaceType.description || '',
                is_active: spaceType.is_active ?? true,
            });

            // Pre-populate existing images as completed staged files
            const sorted = [...(spaceType.space_type_images ?? [])].sort(
                (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
            );
            setFiles(sorted.map((img) => ({
                id: img.id,
                name: img.image_url.split('/').pop() ?? 'image',
                size: 0,
                mime: 'image/jpeg',
                progress: 100,
                status: 'complete' as const,
                url: img.image_url,
            })));
        } else {
            setFormData({
                name: '',
                display_name_en: '',
                display_name_ar: '',
                display_name_fr: '',
                description: '',
                is_active: true,
            });
            setFiles([]);
        }
        setError(null);
    }, [spaceType, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const incoming = e.target.files;
        if (!incoming) return;

        const remaining = MAX_IMAGES - files.length;
        if (remaining <= 0) return;

        // Slice to remaining slots
        const dt = new DataTransfer();
        for (let i = 0; i < Math.min(incoming.length, remaining); i++) {
            dt.items.add(incoming[i]);
        }
        addFiles(dt.files);
        e.currentTarget.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Block if any image is still uploading
        const uploading = files.some(f => f.status === 'uploading');
        if (uploading) {
            toast.error('Please wait for all images to finish uploading.');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            let targetId: string;

            if (spaceType) {
                const updateData: SpaceTypeUpdate = {
                    display_name_en: formData.display_name_en,
                    display_name_ar: formData.display_name_ar || null,
                    display_name_fr: formData.display_name_fr || null,
                    description: formData.description || null,
                    is_active: formData.is_active,
                };
                await SpaceTypesService.update(spaceType.id, updateData);
                targetId = spaceType.id;
            } else {
                const insertData: SpaceTypeInsert = {
                    name: formData.name,
                    display_name_en: formData.display_name_en,
                    display_name_ar: formData.display_name_ar || null,
                    display_name_fr: formData.display_name_fr || null,
                    description: formData.description || null,
                    is_active: formData.is_active,
                };
                const created = await SpaceTypesService.create(insertData);
                targetId = created.id;
            }

            // Persist images (full overwrite)
            const imageUrls = files
                .filter(f => f.status === 'complete' && f.url)
                .map(f => f.url as string);
            await SpaceTypesService.setImages(targetId, imageUrls);

            onSuccess();
        } catch (err: any) {
            console.error('Failed to save space type:', err);
            setError(err.message || 'Failed to save space type');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const canAddMore = files.length < MAX_IMAGES;
    const completeCount = files.filter(f => f.status === 'complete').length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-muted/15">
                    <h2 className="text-xl font-bold text-heading">
                        {spaceType ? 'Edit Space Type' : 'Add Space Type'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-surface/50 rounded-lg transition-colors">
                        <XMark className="size-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Code — only shown on edit */}
                    {spaceType && (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Code (Machine ID)
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                disabled
                                className="w-full px-4 py-2 border border-muted/30 rounded-lg bg-surface/50 cursor-not-allowed font-mono text-muted"
                            />
                            <p className="text-xs text-muted mt-1">Code cannot be changed after creation</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* English Name */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                English Display Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.display_name_en}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const updates: any = { display_name_en: val };
                                    if (!spaceType) {
                                        updates.name = val
                                            .toUpperCase()
                                            .replace(/[\s-]/g, '_')
                                            .replace(/[^A-Z_]/g, '');
                                    }
                                    setFormData({ ...formData, ...updates });
                                }}
                                placeholder="Kitchen and Bath"
                                required
                                className="w-full px-4 py-2 border border-muted/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            {!spaceType && formData.name && (
                                <p className="text-xs text-muted mt-1.5 font-mono">
                                    Generated Code: <span className="text-primary font-bold">{formData.name}</span>
                                </p>
                            )}
                        </div>

                        {/* French Name */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                French Display Name
                            </label>
                            <input
                                type="text"
                                value={formData.display_name_fr}
                                onChange={(e) => setFormData({ ...formData, display_name_fr: e.target.value })}
                                placeholder="Cuisine et Salle de Bain"
                                className="w-full px-4 py-2 border border-muted/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    {/* Arabic Name */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Arabic Display Name
                        </label>
                        <input
                            type="text"
                            value={formData.display_name_ar}
                            onChange={(e) => setFormData({ ...formData, display_name_ar: e.target.value })}
                            placeholder="المطبخ والحمام"
                            dir="rtl"
                            className="w-full px-4 py-2 border border-muted/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Description / Space Info
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of the space type..."
                            rows={3}
                            className="w-full px-4 py-2 border border-muted/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                    </div>

                    {/* Images */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-foreground">
                                Images
                                <span className="text-xs text-muted font-normal ml-1.5">
                                    ({completeCount}/{MAX_IMAGES})
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={!canAddMore}
                                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-muted/30 hover:bg-emphasis transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Plus className="size-3.5" />
                                Add Image
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {files.length === 0 ? (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-muted/25 rounded-lg hover:border-primary/40 hover:bg-primary/5 transition-colors text-muted"
                            >
                                <Photo className="size-8 opacity-40" />
                                <span className="text-sm">Click to add images (up to {MAX_IMAGES})</span>
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {files.map((file, index) => (
                                    <div
                                        key={file.id}
                                        className="relative group aspect-video rounded-lg overflow-hidden border border-muted/15 bg-surface"
                                    >
                                        {/* Preview image */}
                                        {file.url ? (
                                            <img
                                                src={file.url}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : file.file ? (
                                            <img
                                                src={URL.createObjectURL(file.file)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Photo className="size-8 text-muted/30" />
                                            </div>
                                        )}

                                        {/* Upload progress overlay */}
                                        {file.status === 'uploading' && (
                                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                                                <Cog className="size-5 text-white animate-spin" />
                                                <span className="text-white text-xs">{file.progress}%</span>
                                            </div>
                                        )}

                                        {/* Failed overlay */}
                                        {file.status === 'failed' && (
                                            <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                                                <span className="text-white text-xs font-medium">Failed</span>
                                            </div>
                                        )}

                                        {/* Sort order badge */}
                                        <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                            {index + 1}
                                        </div>

                                        {/* Remove button */}
                                        <button
                                            type="button"
                                            onClick={() => removeFile(file.id)}
                                            className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <XMark className="size-3 text-white" />
                                        </button>
                                    </div>
                                ))}

                                {/* Add more slot */}
                                {canAddMore && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-video rounded-lg border-2 border-dashed border-muted/25 hover:border-primary/40 hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-colors text-muted"
                                    >
                                        <Plus className="size-5 opacity-50" />
                                        <span className="text-xs">Add</span>
                                    </button>
                                )}
                            </div>
                        )}
                        <p className="text-xs text-muted mt-1.5">
                            Images display in numbered order. To reorder: remove and re-add.
                        </p>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 text-primary border-muted/30 rounded focus:ring-2 focus:ring-primary/50"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-foreground">
                            Active (visible to users)
                        </label>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-muted/15">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-foreground hover:bg-surface/50 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading || files.some(f => f.status === 'uploading')}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Cog className="size-4 animate-spin" />}
                        {spaceType ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
}

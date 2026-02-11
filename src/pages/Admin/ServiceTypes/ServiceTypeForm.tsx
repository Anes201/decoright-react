import { useState, useEffect } from 'react';
import { ServiceTypesService, type ServiceType, type ServiceTypeInsert, type ServiceTypeUpdate } from '@/services/service-types.service';
import { ICONS } from '@/icons';

interface ServiceTypeFormProps {
    isOpen: boolean;
    serviceType: ServiceType | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ServiceTypeForm({ isOpen, serviceType, onClose, onSuccess }: ServiceTypeFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        display_name_en: '',
        display_name_ar: '',
        display_name_fr: '',
        image_url: '',
        description: '',
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (serviceType) {
            setFormData({
                name: serviceType.name,
                display_name_en: serviceType.display_name_en,
                display_name_ar: serviceType.display_name_ar || '',
                display_name_fr: serviceType.display_name_fr || '',
                image_url: serviceType.image_url || '',
                description: serviceType.description || '',
                is_active: serviceType.is_active,
            });
            setImagePreview(serviceType.image_url || null);
        } else {
            setFormData({
                name: '',
                display_name_en: '',
                display_name_ar: '',
                display_name_fr: '',
                image_url: '',
                description: '',
                is_active: true,
            });
            setImagePreview(null);
        }
        setSelectedFile(null);
        setError(null);
    }, [serviceType, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            let finalImageUrl = formData.image_url;

            if (selectedFile) {
                setUploading(true);
                finalImageUrl = await ServiceTypesService.uploadImage(selectedFile);
                setUploading(false);
            }

            if (serviceType) {
                // Update existing
                const updateData: ServiceTypeUpdate = {
                    display_name_en: formData.display_name_en,
                    display_name_ar: formData.display_name_ar || null,
                    display_name_fr: formData.display_name_fr || null,
                    image_url: finalImageUrl || null,
                    description: formData.description || null,
                    is_active: formData.is_active,
                };
                await ServiceTypesService.update(serviceType.id, updateData);
            } else {
                // Create new
                const insertData: ServiceTypeInsert = {
                    name: formData.name,
                    display_name_en: formData.display_name_en,
                    display_name_ar: formData.display_name_ar || null,
                    display_name_fr: formData.display_name_fr || null,
                    image_url: finalImageUrl || null,
                    description: formData.description || null,
                    is_active: formData.is_active,
                };
                await ServiceTypesService.create(insertData);
            }
            onSuccess();
        } catch (err: any) {
            console.error('Failed to save service type:', err);
            setError(err.message || 'Failed to save service type');
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-muted/15">
                    <h2 className="text-xl font-bold text-heading">
                        {serviceType ? 'Edit Service Type' : 'Add Service Type'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
                    >
                        <ICONS.xMark className="size-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name (Code) */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Code (Machine ID) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => {
                                const val = e.target.value
                                    .trimStart()
                                    .replace(/[\s-]+/g, '_') // Replace spaces and hyphens with underscores
                                    .toUpperCase()
                                    .replace(/[^A-Z0-9_]/g, ''); // Remove other non-alphanumeric characters
                                setFormData({ ...formData, name: val });
                            }}
                            placeholder="INTERIOR_DESIGN"
                            disabled={!!serviceType}
                            required
                            className="w-full px-4 py-2 border border-muted/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-surface/50 disabled:cursor-not-allowed font-mono"
                        />
                        <p className="text-xs text-muted mt-1">
                            {serviceType ? 'Code cannot be changed after creation' : 'Use SCREAMING_SNAKE_CASE (e.g., INTERIOR_DESIGN)'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* English Display Name */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                English Display Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.display_name_en}
                                onChange={(e) => setFormData({ ...formData, display_name_en: e.target.value })}
                                placeholder="Interior Design"
                                required
                                className="w-full px-4 py-2 border border-muted/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* French Display Name */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                French Display Name
                            </label>
                            <input
                                type="text"
                                value={formData.display_name_fr}
                                onChange={(e) => setFormData({ ...formData, display_name_fr: e.target.value })}
                                placeholder="Design d'Intérieur"
                                className="w-full px-4 py-2 border border-muted/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    {/* Arabic Display Name */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Arabic Display Name
                        </label>
                        <input
                            type="text"
                            value={formData.display_name_ar}
                            onChange={(e) => setFormData({ ...formData, display_name_ar: e.target.value })}
                            placeholder="تصميم داخلي"
                            dir="rtl"
                            className="w-full px-4 py-2 border border-muted/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Service Image
                        </label>
                        <div className="mt-1 flex items-center gap-4">
                            <div className="size-20 rounded-lg border border-muted/30 overflow-hidden bg-surface flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ICONS.photo className="size-8 text-muted/30" />
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-muted
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-primary/10 file:text-primary
                                        hover:file:bg-primary/20 transition-all
                                        cursor-pointer"
                                />
                                <p className="text-xs text-muted mt-1">Recommended size: 800x600px. Max 5MB.</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Description / Service Info
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of the service..."
                            rows={3}
                            className="w-full px-4 py-2 border border-muted/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
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
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {(loading || uploading) && <ICONS.cog className="size-4 animate-spin" />}
                        {uploading ? 'Uploading...' : serviceType ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
}

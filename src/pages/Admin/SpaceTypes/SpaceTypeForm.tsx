import { useState, useEffect } from 'react';
import { SpaceTypesService, type SpaceType, type SpaceTypeInsert, type SpaceTypeUpdate } from '@/services/space-types.service';
import { ICONS } from '@/icons';

interface SpaceTypeFormProps {
    isOpen: boolean;
    spaceType: SpaceType | null;
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

    useEffect(() => {
        if (spaceType) {
            setFormData({
                name: spaceType.name,
                display_name_en: spaceType.display_name_en,
                display_name_ar: spaceType.display_name_ar || '',
                display_name_fr: spaceType.display_name_fr || '',
                description: spaceType.description || '',
                is_active: spaceType.is_active ?? true,
            });
        } else {
            setFormData({
                name: '',
                display_name_en: '',
                display_name_ar: '',
                display_name_fr: '',
                description: '',
                is_active: true,
            });
        }
        setError(null);
    }, [spaceType, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (spaceType) {
                // Update existing
                const updateData: SpaceTypeUpdate = {
                    display_name_en: formData.display_name_en,
                    display_name_ar: formData.display_name_ar || null,
                    display_name_fr: formData.display_name_fr || null,
                    description: formData.description || null,
                    is_active: formData.is_active,
                };
                await SpaceTypesService.update(spaceType.id, updateData);
            } else {
                // Create new
                const insertData: SpaceTypeInsert = {
                    name: formData.name,
                    display_name_en: formData.display_name_en,
                    display_name_ar: formData.display_name_ar || null,
                    display_name_fr: formData.display_name_fr || null,
                    description: formData.description || null,
                    is_active: formData.is_active,
                };
                await SpaceTypesService.create(insertData);
            }
            onSuccess();
        } catch (err: any) {
            console.error('Failed to save space type:', err);
            setError(err.message || 'Failed to save space type');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-muted/15">
                    <h2 className="text-xl font-bold text-heading">
                        {spaceType ? 'Edit Space Type' : 'Add Space Type'}
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
                            onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase().replace(/[\s-]/g, '_').replace(/[^A-Z_]/g, '') })}
                            placeholder="KITCHEN_AND_BATH"
                            disabled={!!spaceType}
                            required
                            className="w-full px-4 py-2 border border-muted/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-surface/50 disabled:cursor-not-allowed font-mono"
                        />
                        <p className="text-xs text-muted mt-1">
                            {spaceType ? 'Code cannot be changed after creation' : 'Use SCREAMING_SNAKE_CASE (e.g., KITCHEN_AND_BATH)'}
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
                                placeholder="Kitchen and Bath"
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
                                placeholder="Cuisine et Salle de Bain"
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
                        {loading && <ICONS.cog className="size-4 animate-spin" />}
                        {spaceType ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
}

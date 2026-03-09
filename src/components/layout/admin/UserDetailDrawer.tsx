
import useAuth from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminService, type UserProfile, type ServiceRequest } from '@/services/admin.service';
import { User, Calendar, Cog, XMark, ArrowPath, RectangleStack, MapPin, ExclamationTriangle } from '@/icons';

interface UserDetailDrawerProps {
    user: (UserProfile & { total_requests?: number }) | null;
    isOpen: boolean;
    onClose: () => void;
    onUserUpdate: () => void;
    onRequestClick?: (requestId: string) => void;
}

export default function UserDetailDrawer({ user, isOpen, onClose, onUserUpdate, onRequestClick }: UserDetailDrawerProps) {
    const { user: currentUser, isSuperAdmin } = useAuth();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'actions'>('profile');
    const [requests, setRequests] = useState<(ServiceRequest & { service_types: { display_name_en: string } | null })[]>([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        internal_notes: '',
        is_active: true,
        role: 'customer'
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (user) {
                setFormData({
                    full_name: user.full_name || '',
                    phone: user.phone || '',
                    internal_notes: user.internal_notes || '',
                    is_active: user.is_active ?? true,
                    role: user.role || 'customer'
                });
                loadUserRequests(user.id);
            }
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen, user]);

    const loadUserRequests = async (userId: string) => {
        try {
            setIsLoadingRequests(true);
            const data = await AdminService.getRequestsByUser(userId);
            setRequests(data);
        } catch (error) {
            console.error("Failed to load user requests:", error);
        } finally {
            setIsLoadingRequests(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        try {
            setIsSaving(true);
            await AdminService.updateUserProfile(user.id, {
                full_name: formData.full_name,
                phone: formData.phone,
                internal_notes: formData.internal_notes
            });
            onUserUpdate();
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleBan = async () => {
        if (!user) return;
        if (currentUser?.id === user.id) {
            alert(t('admin.user_drawer.cannot_deactivate_self'));
            return;
        }
        try {
            const newStatus = !formData.is_active;
            setFormData(prev => ({ ...prev, is_active: newStatus }));
            await AdminService.updateUserProfile(user.id, {
                is_active: newStatus
            });
            onUserUpdate();
        } catch (error) {
            console.error("Failed to update ban status:", error);
            setFormData(prev => ({ ...prev, is_active: !prev.is_active }));
        }
    };

    const handleRoleChange = async (newRole: 'super_admin' | 'admin' | 'customer') => {
        if (!user) return;
        if (currentUser?.id === user.id) {
            alert(t('admin.user_drawer.cannot_change_own_role'));
            return;
        }
        const confirmed = window.confirm(t('admin.user_drawer.confirm_role_change', { role: newRole.toUpperCase() }));
        if (!confirmed) return;

        try {
            await AdminService.updateUserProfile(user.id, { role: newRole as any });
            setFormData(prev => ({ ...prev, role: newRole }));
            onUserUpdate();
        } catch (error) {
            console.error("Failed to change role:", error);
        }
    };


    if (!user) return null;

    const tabs = [
        { id: 'profile', label: t('admin.user_drawer.tab_profile'), icon: User },
        { id: 'history', label: t('admin.user_drawer.tab_history'), icon: Calendar },
        { id: 'actions', label: t('admin.user_drawer.tab_actions'), icon: Cog },
    ] as const;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-surface border-l border-muted/20 z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">

                    {/* Header */}
                    <div className="p-6 border-b border-muted/10 bg-background/50">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                                    {user.full_name?.[0] || 'U'}
                                </div>
                                <div>
                                        <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-heading">{user.full_name || t('admin.user_drawer.unknown_user')}</h2>
                                        {formData.role === 'super_admin' && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 uppercase border border-amber-500/20">
                                                {t('admin.users.role_super_admin')}
                                            </span>
                                        )}
                                        {formData.role === 'admin' && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 uppercase">
                                                {t('admin.users.role_admin')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted mt-1">{user.phone || t('admin.user_drawer.no_phone')}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-emphasis rounded-full transition-colors">
                                <XMark className="size-6 text-muted" />
                            </button>
                        </div>

                        {/* Quick Actions Bar */}
                        <div className="flex items-center justify-between bg-emphasis/30 p-3 rounded-xl border border-muted/10">
                            <span className="text-xs font-semibold text-muted uppercase tracking-wide px-2">{t('admin.user_drawer.account_status')}</span>
                            <button
                                onClick={handleToggleBan}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.is_active
                                    ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                                    : 'bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20'
                                    }`}
                            >
                                <span className={`size-2 rounded-full ${formData.is_active ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
                                {formData.is_active ? t('admin.user_drawer.status_active') : t('admin.user_drawer.status_banned')}
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center border-b border-muted/10 px-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all relative ${activeTab === tab.id ? 'text-primary' : 'text-muted hover:text-heading'
                                    }`}
                            >
                                <tab.icon className="size-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-background">

                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-surface border border-muted/10 space-y-3">
                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wide">{t('admin.user_drawer.section_account_info')}</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs text-muted">{t('admin.user_drawer.field_user_id')}</p>
                                            <p className="font-mono text-[10px] text-heading truncate">{user.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted">{t('admin.user_drawer.field_role')}</p>
                                            <p className="font-semibold text-heading">{user.role?.toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted">{t('admin.user_drawer.field_joined')}</p>
                                            <p className="text-heading">{new Date(user.created_at!).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted">{t('admin.user_drawer.field_last_updated')}</p>
                                            <p className="text-heading">{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : t('admin.user_drawer.field_never')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-sm font-medium text-heading mb-1 block">{t('admin.user_drawer.field_full_name')}</span>
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                            className="w-full px-4 py-2 bg-surface border border-muted/20 rounded-lg text-sm text-body focus:outline-none focus:border-primary/50 transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-medium text-heading mb-1 block">{t('admin.user_drawer.field_phone')}</span>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full px-4 py-2 bg-surface border border-muted/20 rounded-lg text-sm text-body focus:outline-none focus:border-primary/50 transition-colors"
                                            placeholder="+1 234 567 890"
                                        />
                                    </label>
                                    <label className="block">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-heading">{t('admin.user_drawer.field_internal_notes')}</span>
                                            <span className="text-[10px] bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded font-bold uppercase">{t('admin.user_drawer.field_internal_notes_admin')}</span>
                                        </div>
                                        <textarea
                                            value={formData.internal_notes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, internal_notes: e.target.value }))}
                                            className="w-full px-4 py-3 bg-yellow-50/50 border border-yellow-200/50 rounded-lg text-sm text-body focus:outline-none focus:border-yellow-400/50 transition-colors min-h-[120px] resize-none"
                                            placeholder="Add private notes about this client..."
                                        />
                                    </label>
                                </div>

                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <ArrowPath className="size-4 animate-spin" />
                                            {t('admin.user_drawer.saving')}
                                        </>
                                    ) : (
                                        t('admin.user_drawer.save_changes')
                                    )}
                                </button>
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-4">
                                {isLoadingRequests ? (
                                    <div className="py-10 text-center text-muted animate-pulse">{t('admin.user_drawer.history_loading')}</div>
                                ) : requests.length === 0 ? (
                                    <div className="py-10 text-center text-muted border border-dashed border-muted/20 rounded-xl">
                                        <RectangleStack className="size-8 mx-auto mb-2 opacity-50" />
                                        <p>{t('admin.user_drawer.history_no_requests')}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {requests.map(req => (
                                            <div
                                                key={req.id}
                                                onClick={() => onRequestClick?.(req.id)}
                                                className="p-4 rounded-xl bg-surface border border-muted/20 hover:border-primary/30 transition-all group cursor-pointer hover:shadow-md"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-xs font-mono text-muted group-hover:text-primary transition-colors">#{req.request_code}</span>
                                                        <h4 className="font-semibold text-heading text-sm">{req.service_types?.display_name_en || 'Unknown Service'}</h4>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                                                        ${req.status === 'Completed' ? 'bg-purple-500/10 text-purple-600' :
                                                            req.status === 'Submitted' ? 'bg-blue-500/10 text-blue-600' :
                                                                'bg-surface-tertiary text-muted'}
                                                    `}>
                                                        {req.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-muted">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="size-3" />
                                                        {new Date(req.created_at!).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="size-3" />
                                                        {req.location}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'actions' && (
                            <div className="space-y-6">
                                {formData.role === 'super_admin' ? (
                                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                                        <ExclamationTriangle className="size-5 text-amber-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-amber-600">{t('admin.user_drawer.super_admin_protected')}</p>
                                            <p className="text-xs text-muted mt-1">{t('admin.user_drawer.super_admin_protected_sub')}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-4">
                                        <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide flex items-center gap-2">
                                            <ExclamationTriangle className="size-4" />
                                            {t('admin.user_drawer.danger_zone')}
                                        </h3>

                                        <div className="space-y-4">
                                            {isSuperAdmin ? (
                                                <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-medium text-heading">{t('admin.user_drawer.change_role')}</p>
                                                        <p className="text-xs text-muted">{t('admin.user_drawer.current_role', { role: formData.role?.toUpperCase() })}</p>
                                                    </div>
                                                    <select
                                                        value={formData.role || 'customer'}
                                                        onChange={(e) => handleRoleChange(e.target.value as any)}
                                                        className="text-xs font-semibold bg-surface-tertiary border-none rounded-md py-1.5 focus:ring-0"
                                                    >
                                                        <option value="customer">{t('admin.user_drawer.role_customer')}</option>
                                                        <option value="admin">{t('admin.users.role_admin')}</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between p-3 bg-surface rounded-lg opacity-50">
                                                    <div>
                                                        <p className="text-sm font-medium text-heading">{t('admin.user_drawer.change_role')}</p>
                                                        <p className="text-xs text-muted">{t('admin.user_drawer.role_only_super_admin')}</p>
                                                    </div>
                                                    <span className="text-xs font-semibold text-muted bg-surface-tertiary px-3 py-1.5 rounded-md">
                                                        {formData.role?.toUpperCase()}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-heading">{formData.is_active ? t('admin.user_drawer.deactivate') : t('admin.user_drawer.reactivate')}</p>
                                                    <p className="text-xs text-muted">{formData.is_active ? t('admin.user_drawer.deactivate_sub') : t('admin.user_drawer.reactivate_sub')}</p>
                                                </div>
                                                <button
                                                    onClick={handleToggleBan}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${formData.is_active
                                                        ? 'bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white'
                                                        : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                                                        }`}
                                                >
                                                    {formData.is_active ? t('admin.user_drawer.btn_deactivate') : t('admin.user_drawer.btn_activate')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

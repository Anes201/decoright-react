
import React, { useEffect, useState } from 'react';
import { ICONS } from '@/icons';
import { AdminService, type UserProfile, type ServiceRequest } from '@/services/admin.service';
import { supabase } from '@/lib/supabase';

interface UserDetailDrawerProps {
    user: (UserProfile & { total_requests?: number }) | null;
    isOpen: boolean;
    onClose: () => void;
    onUserUpdate: () => void;
    onRequestClick?: (requestId: string) => void;
}

export default function UserDetailDrawer({ user, isOpen, onClose, onUserUpdate, onRequestClick }: UserDetailDrawerProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'actions'>('profile');
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(false);

    // Form State
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
            // Show success feedback if needed
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleBan = async () => {
        if (!user) return;
        try {
            // Optimistic update
            const newStatus = !formData.is_active;
            setFormData(prev => ({ ...prev, is_active: newStatus }));

            await AdminService.updateUserProfile(user.id, {
                is_active: newStatus
            });
            onUserUpdate();
        } catch (error) {
            console.error("Failed to update ban status:", error);
            // Revert on error
            setFormData(prev => ({ ...prev, is_active: !prev.is_active }));
        }
    };

    const handleRoleChange = async (newRole: 'admin' | 'customer') => {
        if (!user) return;
        const confirm = window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`);
        if (!confirm) return;

        try {
            await AdminService.updateUserProfile(user.id, { role: newRole });
            setFormData(prev => ({ ...prev, role: newRole }));
            onUserUpdate();
        } catch (error) {
            console.error("Failed to change role:", error);
        }
    };

    // Danger Zone actions
    const handleResetPassword = async () => {
        // Since we don't have the user's email in the profile table (usually in auth.users), 
        // we might not be able to trigger this easily without an edge function 
        // or stricter permissions.
        // Assuming we might not have the email, we'll placeholder this or
        // if user data includes email (it doesn't in profiles table usually).
        // BUT, notice we didn't add email to profiles. 
        // So this feature is blocked unless we fetch email from auth.users (requires service role).
        alert("This feature requires Admin API access to auth.users which is currently restricted.");
    };

    if (!user) return null;

    const tabs = [
        { id: 'profile', label: 'Profile Info', icon: ICONS.user },
        { id: 'history', label: 'Request History', icon: ICONS.calendar },
        { id: 'actions', label: 'Admin Actions', icon: ICONS.cog },
    ] as const;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
                                        <h2 className="text-xl font-bold text-heading">{user.full_name || 'Unknown User'}</h2>
                                        {formData.role === 'admin' && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 uppercase">Admin</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted mt-1">{user.phone || 'No phone number'}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-emphasis rounded-full transition-colors">
                                <ICONS.xMark className="size-6 text-muted" />
                            </button>
                        </div>

                        {/* Quick Actions Bar */}
                        <div className="flex items-center justify-between bg-emphasis/30 p-3 rounded-xl border border-muted/10">
                            <span className="text-xs font-semibold text-muted uppercase tracking-wide px-2">Account Status</span>
                            <button
                                onClick={handleToggleBan}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.is_active
                                    ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                                    : 'bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20'
                                    }`}
                            >
                                <span className={`size-2 rounded-full ${formData.is_active ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
                                {formData.is_active ? 'Active' : 'Banned / Inactive'}
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

                        {/* Tab: Profile */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                {/* Read-only Info */}
                                <div className="p-4 rounded-xl bg-surface border border-muted/10 space-y-3">
                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wide">Account Information</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs text-muted">User ID</p>
                                            <p className="font-mono text-[10px] text-heading truncate">{user.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted">Role</p>
                                            <p className="font-semibold text-heading">{user.role?.toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted">Joined</p>
                                            <p className="text-heading">{new Date(user.created_at!).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted">Last Updated</p>
                                            <p className="text-heading">{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Never'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Editable Fields */}
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-sm font-medium text-heading mb-1 block">Full Name</span>
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                            className="w-full px-4 py-2 bg-surface border border-muted/20 rounded-lg text-sm text-body focus:outline-none focus:border-primary/50 transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-medium text-heading mb-1 block">Phone Number</span>
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
                                            <span className="text-sm font-medium text-heading">Internal Notes</span>
                                            <span className="text-[10px] bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded font-bold uppercase">Admin Only</span>
                                        </div>
                                        <textarea
                                            value={formData.internal_notes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, internal_notes: e.target.value }))}
                                            className="w-full px-4 py-3 bg-yellow-50/50 border border-yellow-200/50 rounded-lg text-sm text-body focus:outline-none focus:border-yellow-400/50 transition-colors min-h-[120px] resize-none"
                                            placeholder="Add private notes about this client (e.g., preferred contact time, VIP status...)"
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
                                            <ICONS.arrowPath className="size-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Tab: History */}
                        {activeTab === 'history' && (
                            <div className="space-y-4">
                                {isLoadingRequests ? (
                                    <div className="py-10 text-center text-muted animate-pulse">Loading history...</div>
                                ) : requests.length === 0 ? (
                                    <div className="py-10 text-center text-muted border border-dashed border-muted/20 rounded-xl">
                                        <ICONS.rectangleStack className="size-8 mx-auto mb-2 opacity-50" />
                                        <p>No requests found for this user.</p>
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
                                                        <h4 className="font-semibold text-heading text-sm">{req.service_type.replace(/_/g, ' ')}</h4>
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
                                                        <ICONS.calendar className="size-3" />
                                                        {new Date(req.created_at!).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <ICONS.mapPin className="size-3" />
                                                        {req.location}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab: Actions */}
                        {activeTab === 'actions' && (
                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-4">
                                    <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide flex items-center gap-2">
                                        <ICONS.exclamationTriangle className="size-4" />
                                        Danger Zone
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-heading">Change Role</p>
                                                <p className="text-xs text-muted">Current: {formData.role?.toUpperCase()}</p>
                                            </div>
                                            <select
                                                value={formData.role || 'customer'}
                                                onChange={(e) => handleRoleChange(e.target.value as any)}
                                                className="text-xs font-semibold bg-surface-tertiary border-none rounded-md py-1.5 focus:ring-0"
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-surface rounded-lg opacity-60 cursor-not-allowed" title="Requires Auth Admin API">
                                            <div>
                                                <p className="text-sm font-medium text-heading">Reset Password</p>
                                                <p className="text-xs text-muted">Send reset email</p>
                                            </div>
                                            <button disabled onClick={handleResetPassword} className="px-3 py-1.5 bg-surface-tertiary hover:bg-emphasis text-heading text-xs font-semibold rounded-lg transition-colors">
                                                Send Email
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-heading">Deactivate Account</p>
                                                <p className="text-xs text-muted">Prevents login</p>
                                            </div>
                                            <button
                                                onClick={handleToggleBan}
                                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${formData.is_active
                                                    ? 'bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white'
                                                    : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                                                    }`}
                                            >
                                                {formData.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

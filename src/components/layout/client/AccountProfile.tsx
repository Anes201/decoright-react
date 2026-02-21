import useAuth from "@/hooks/useAuth";
import Spinner from "@/components/common/Spinner";
import type { Database } from "@/types/database.types";
import { Link, Navigate } from "react-router-dom";
import { Envelope, Phone, UserCircle, PencilSquare } from "@/icons";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PATHS } from "@/routers/Paths";
import { useTranslation } from "react-i18next";

type ProfileData = Database['public']['Tables']['profiles']['Row'];

// Returns capitalized initials from a full name string
function getInitials(name: string): string {
    return name
        .trim()
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(n => n[0].toUpperCase())
        .join('');
}

export default function AccountProfileLayout() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (error) throw error;
                setProfile(data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        if (!authLoading) fetchProfile();
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 h-64">
                <Spinner className="w-8 h-8" />
                <span className="text-xs text-muted">{t('profile.loading')}</span>
            </div>
        );
    }

    if (!user) return <Navigate to={PATHS.LOGIN} replace />;

    const joinDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' })
        : t('profile.not_provided');

    const displayName = profile?.full_name || t('profile.anonymous');
    const initials = getInitials(displayName);

    const infoItems = [
        {
            icon: <Envelope className="size-5" />,
            label: t('auth.email'),
            value: user.email || t('profile.not_provided'),
            id: 'email-info',
        },
        {
            icon: <Phone className="size-5" />,
            label: t('auth.phone'),
            value: profile?.phone || t('profile.not_provided'),
            id: 'phone-info',
        },
        {
            icon: <UserCircle className="size-5" />,
            label: t('profile.role'),
            value: profile?.role ? (profile.role.charAt(0).toUpperCase() + profile.role.slice(1)) : t('profile.client'),
            id: 'role-info',
        },
    ];

    return (
        <div className="flex flex-col gap-8">

            {/* ── Avatar + Name ─────────────────────────────────── */}
            <div className="flex flex-col items-center gap-3">
                <div className="w-fit h-25 md:h-36 p-1 md:p-1.5 aspect-square border border-muted/20 rounded-full bg-background overflow-hidden">
                    {/* Initials fallback — replace with real avatar when available */}
                    <div className="w-full h-full rounded-full bg-primary/15 flex items-center justify-center">
                        <span className="font-bold text-2xl md:text-3xl text-primary select-none">{initials}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center gap-0.5">
                    <h4 className="font-semibold text-lg leading-tight">{displayName}</h4>
                    <p className="text-2xs text-muted">{t('profile.joined_at', { date: joinDate })}</p>
                </div>
            </div>

            {/* ── Personal Info ─────────────────────────────────── */}
            <div className="space-y-5">
                <div className="flex items-center gap-3">
                    <h3 className="font-medium text-2xs text-muted min-w-max tracking-wide uppercase">{t('profile.personal_info')}</h3>
                    <hr className="w-full border-0 border-b border-muted/15" />
                    <Link
                        to={PATHS.CLIENT.ACCOUNT_SETTINGS}
                        title="Edit profile"
                        className="shrink-0 p-2 border border-muted/15 bg-surface/75 rounded-lg hover:border-primary/30 transition-colors"
                    >
                        <PencilSquare className="size-4" />
                    </Link>
                </div>

                <ul className="flex flex-col gap-3">
                    {infoItems.map(item => (
                        <li key={item.id} className="flex items-center gap-4 p-3 border border-muted/15 bg-surface rounded-xl">
                            <div className="shrink-0 p-2 border border-muted/20 bg-emphasis rounded-lg text-muted">
                                {item.icon}
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-2xs text-muted">{item.label}</span>
                                <p id={item.id} className="font-medium text-sm truncate">{item.value}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}
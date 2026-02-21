import useAuth from "@/hooks/useAuth";
import Spinner from "@/components/common/Spinner";
import type { Database } from "@/types/database.types";
import { Link, Navigate } from "react-router-dom";
import { Envelope, Phone, UserCircle, PencilSquare, CheckCircle, LockClosed } from "@/icons";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PATHS } from "@/routers/Paths";
import { useTranslation } from "react-i18next";

type ProfileData = Database['public']['Tables']['profiles']['Row'];

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
            <div className="flex flex-col items-center justify-center gap-4 w-full h-80">
                <Spinner className="w-8 h-8" />
                <span className="text-xs text-muted font-medium animate-pulse">{t('profile.loading')}</span>
            </div>
        );
    }

    if (!user) return <Navigate to={PATHS.LOGIN} replace />;

    const joinDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' })
        : t('profile.not_provided');

    const displayName = profile?.full_name || t('profile.anonymous');

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
        }
    ];

    return (
        <div className="flex flex-col gap-8 md:gap-12 w-full pb-10">

            {/* ── Profile Header ─────────────────────────────────── */}
            <div className="relative overflow-hidden bg-primary shadow-2xl shadow-primary/10 rounded-[2.5rem] p-8 md:p-12 border border-white/10 group">
                {/* Decorative background glass/blur elements */}
                <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 size-48 bg-black/10 rounded-full blur-2xl -translate-x-1/4 translate-y-1/4" />

                <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                                {profile?.role ? (profile.role.charAt(0).toUpperCase() + profile.role.slice(1)) : t('profile.client')}
                            </span>
                        </div>
                        <h4 className="font-bold text-4xl md:text-6xl text-white tracking-tight drop-shadow-sm">{displayName}</h4>
                        <div className="flex items-center gap-2.5 text-white/70 text-sm font-semibold">
                            <span className="size-2 bg-white/40 rounded-full animate-pulse" />
                            {t('profile.joined_at', { date: joinDate })}
                        </div>
                    </div>

                    <Link
                        to={PATHS.CLIENT.ACCOUNT_SETTINGS}
                        className="w-fit flex items-center gap-2.5 px-8 py-4 bg-white text-primary font-bold rounded-2xl hover:bg-white/95 transition-all active:scale-[0.98] shadow-xl shadow-black/5 group/btn"
                    >
                        <PencilSquare className="size-4.5 group-hover/btn:rotate-12 transition-transform" />
                        {t('common.edit')}
                    </Link>
                </div>
            </div>

            {/* ── Quick Info Grid ────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                {/* Contact Card */}
                <div className="flex flex-col gap-8 p-8 md:p-10 bg-surface border border-muted/15 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-xl border border-primary/10">
                            <UserCircle className="size-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-xs text-muted tracking-widest uppercase">{t('profile.personal_info')}</h3>
                    </div>

                    <ul className="flex flex-col gap-6">
                        {infoItems.map(item => (
                            <li key={item.id} className="group flex items-center gap-5">
                                <div className="shrink-0 p-3.5 bg-emphasis border border-muted/10 text-muted rounded-2xl group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/10 transition-all duration-300">
                                    {item.icon}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-muted/50 uppercase tracking-widest mb-0.5">{item.label}</span>
                                    <p className="font-bold text-foreground text-lg truncate tracking-tight">{item.value}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Account Security/Status Card */}
                <div className="flex flex-col gap-8 p-8 md:p-10 bg-surface border border-muted/15 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-success/10 rounded-xl border border-success/10">
                            <LockClosed className="size-5 text-success" />
                        </div>
                        <h3 className="font-bold text-xs text-muted tracking-widest uppercase">{t('settings.security')}</h3>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-start gap-5 p-6 bg-success/5 border border-success/10 rounded-[2rem] group/status">
                            <div className="shrink-0 p-3 bg-success text-white rounded-2xl shadow-lg shadow-success/20 group-hover/status:scale-110 transition-transform">
                                <CheckCircle className="size-6" />
                            </div>
                            <div className="flex flex-col gap-1.5 pt-0.5">
                                <span className="text-base font-bold text-success-foreground leading-none">Security Verified</span>
                                <p className="text-xs text-success-foreground/60 leading-relaxed font-medium">Your credentials are secure. All account features are fully active.</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 px-1 mt-auto">
                            <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase text-muted/60">
                                <span>Trust Score</span>
                                <span className="text-success">92%</span>
                            </div>
                            <div className="flex gap-1.5 h-2">
                                <div className="flex-1 rounded-full bg-success shadow-sm" />
                                <div className="flex-1 rounded-full bg-success shadow-sm" />
                                <div className="flex-1 rounded-full bg-success shadow-sm" />
                                <div className="flex-1 rounded-full bg-success shadow-sm" />
                                <div className="flex-1 rounded-full bg-muted/10" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
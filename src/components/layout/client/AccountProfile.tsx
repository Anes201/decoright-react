import useAuth from "@/hooks/useAuth";
import Spinner from "@/components/common/Spinner";
import type { Database } from "@/types/database.types";
import { Link, Navigate } from "react-router-dom";
import { images } from "@/constants";
import { ICONS } from "@/icons";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PATHS } from "@/routers/Paths";
import { useTranslation } from "react-i18next";

type ProfileData = Database['public']['Tables']['profiles']['Row'];

export default function AccountProfileLayout() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(false);
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

        if (!authLoading) {
            fetchProfile();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-hero">
                <Spinner className="w-80 h-80"> {t('profile.loading')} </Spinner>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={PATHS.LOGIN} replace />;
    }

    const joinDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' })
        : t('profile.not_provided');

    return (

        <div className="flex flex-col gap-8 max-md:flex-col">

            <div className="flex flex-col items-center gap-2">
                {/* Profile Image */}
                <div className="w-fit h-25 md:h-40 p-1 md:p-2 aspect-square border border-muted/15 rounded-full bg-background overflow-hidden">
                    <img src={images[7]} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                </div>

                <div className="flex flex-col text-center">
                    <h4 className="font-semibold text-lg"> {profile?.full_name || t('profile.anonymous')} </h4>
                    <p className="text-2xs md:text-xs"> {t('profile.joined_at', { date: joinDate })} </p>
                </div>
            </div>

            {/* User Information */}

            <div className="space-y-8">

                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-2xs md:text-xs text-foreground/75 min-w-max"> {t('profile.personal_info')} </h3>
                    <hr className="w-full border-0 border-b border-muted/15" />
                    <Link to={PATHS.CLIENT.ACCOUNT_SETTINGS} className="p-2 border border-muted/15 bg-surface/75 rounded-lg"> <ICONS.pencilSquare /> </Link>
                </div>
                <ul className="flex flex-col gap-6 w-full">

                    <li className="flex items-center w-full gap-4 p-3 border border-muted/15 bg-surface rounded-xl">
                        <div className="h-full aspect-square p-2 border border-muted/25 bg-surface rounded-lg">
                            <ICONS.envelope className="size-6" />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="phone-info" className="font-medium text-xs"> {t('auth.email')} </label>
                            <p id="phone-info" className="font-medium text-xs text-foreground"> {user.email} </p>
                        </div>
                    </li>
                    <li className="flex items-center w-full gap-4 p-3 border border-muted/15 bg-surface rounded-xl">
                        <div className="h-full aspect-square p-2 border border-muted/25 bg-surface rounded-lg">
                            <ICONS.phone className="size-6" />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="phone-info" className="font-medium text-xs"> {t('auth.phone')} </label>
                            <p id="phone-info" className="font-medium text-xs text-foreground"> {profile?.phone || t('profile.not_provided')} </p>
                        </div>
                    </li>
                    <li className="flex items-center w-full gap-4 p-3 border border-muted/15 bg-surface rounded-xl">
                        <div className="h-full aspect-square p-2 border border-muted/25 bg-surface rounded-lg">
                            <ICONS.userCircle className="size-6" />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="phone-info" className="font-medium text-xs"> {t('profile.role')} </label>
                            <p id="phone-info" className="font-medium text-xs text-foreground"> {profile?.role || t('profile.client')} </p>
                        </div>
                    </li>

                </ul>
            </div>

        </div>

    );
}
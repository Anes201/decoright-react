
import useAuth from "@/hooks/useAuth";
import Spinner from "@components/common/Spinner";
import toast from "react-hot-toast";
import React, { useCallback, useEffect, useState } from "react";
import { images, Languages } from "@/constants";
import { EmailInput, Input, PhoneInput } from "@components/ui/Input";
import { supabase } from "@/lib/supabase";
import { PATHS } from "@/routers/Paths";
import { Link, Navigate } from "react-router-dom";
import { SelectMenu } from "@components/ui/Select";
import { DEFAULT_AUTH_USER_LANGUAGE, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "@/config";
import { PHONE_REGEX, USERNAME_REGEX } from "@/utils/validators";
import { useTranslation } from "react-i18next";

// Unused types ProfileData and Settings removed to clear lint errors
export type FieldKey = "firstName" | "lastName" | "phone";

export default function AccountSettingsLayout() {
    // const navigate = useNavigate() - Removed unused variable to clear lint error

    const { user, loading: authLoading } = useAuth()
    const [settings, setSettings] = useState<Record<string, string>>({});
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || DEFAULT_AUTH_USER_LANGUAGE || 'en')
    const [_dataSaved, setDataSaved] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [_loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

    // Custom debounce function to avoid lodash dependency
    function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
        let timeout: ReturnType<typeof setTimeout>;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    function handleChange(field: string, value: string) {
        setSettings(prev => ({ ...prev, [field]: value }))

        // validate/local rules here if needed, e.g. don't save empty names
        if ((field === "first_name" || field === "last_name") && value.trim() === "") return;

        // save full_name only when user edits first/last
        if (field === "first_name" || field === "last_name") {
            const currentFirst = field === "first_name" ? value : settings.first_name;
            const currentLast = field === "last_name" ? value : settings.last_name;
            const fullName = `${currentFirst} ${currentLast}`.trim();
            debouncedSave('full_name', fullName);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {

            if (!user) return;
            setError(null);

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                // populate form fields with fetched data (use `data`, not `profile` state)
                const fullName = data?.full_name ?? '';
                const [first = '', ...rest] = fullName.split(' ');
                setSettings(
                    {
                        first_name: first,
                        last_name: rest.join(' '),
                        phone: data?.phone ?? ''
                    }
                )

            } catch (err: any) {
                console.error("Error fetching profile:", err);
                setError(err?.message ?? t('settings.error_load'));
            } finally {
                setInitializing(false);
            }
        };

        if (!authLoading) fetchProfile();

    }, [user, authLoading]);

    const debouncedSave = useCallback(
        debounce(async (key: string, rawValue: string) => {

            if (!user?.id) {
                setError(t('settings.error_missing_user'));
                return;
            }

            setLoading(true);
            try {

                const value = (rawValue ?? "").trim();

                switch (key) {
                    case "firstName":
                    case "lastName":
                        if (value.length < USERNAME_MIN_LENGTH) return t('settings.error_required');
                        if (value.length > USERNAME_MAX_LENGTH) return t('settings.error_max_length', { max: USERNAME_MAX_LENGTH });
                        if (!USERNAME_REGEX.test(value)) return t('settings.error_invalid_chars');
                        return null;

                    case "phone":
                        // phone is optional — empty is allowed
                        if (value === "") return null;
                        if (!PHONE_REGEX.test(value)) return t('settings.error_invalid_phone');
                        return null;

                    default: null;
                }

                const normalized = value.trim() === "" ? null : value.trim();

                console.log({ [key]: normalized })
                const { error } = await supabase
                    .from('profiles')
                    .update({ [key]: normalized })
                    .eq('id', user?.id);

                if (error) throw error

                toast.success(t('settings.saved'))
                setDataSaved(true);
                setTimeout(() => setDataSaved(false), 2000);

            } catch (error) {
                console.error("Failed to save setting:", error);
            } finally {
                setLoading(false);
            }
        }, 1000),
        []
    );

    if (!user) return <Navigate to={PATHS.LOGIN} replace />;

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault()
    //     if (!firstName || !lastName ) {
    //         setError("First and Last name are required.")
    //         return
    //     }

    //     setLoading(true)
    //     setError(null)

    //     try {
    //         // checking for active requests with specific status
    //         const CHECK_STATUS = 'in_progress';

    //         // check if user has any request with that status to prevent phone update
    //         const requests = await RequestService.getMyRequests();
    //         const activeReq = requests?.find((req: any) => req.status === CHECK_STATUS);

    //         if (activeReq) {
    //             setError(`You have an active request with status "${CHECK_STATUS}". Cannot update phone while that request is active.`);
    //             setLoading(false);
    //             return;
    //         }

    //         const fullName = `${firstName} ${lastName}`.trim();
    //         const { error } = await supabase
    //             .from('profiles')
    //             .update({ full_name: fullName, phone })
    //             .eq('id', user?.id);

    //         if (error) throw error;

    //         // optional: navigate back to profile on success
    //         navigate(PATHS.CLIENT.ACCOUNT_PROFILE);

    //     } catch (err: any) {
    //         console.error("Error updating profile:", err);
    //         setError(err?.message ?? String(err));
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    function handleUploadProfilePicture(e: any) {
        e.preventDefault()

    }

    function handleRemoveProfilePicture(e: any) {
        e.preventDefault()
    }

    if (initializing) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                <Spinner status={initializing} />
                <span className="text-xs"> {t('profile.loading')} </span>
            </div>
        )
    }

    return (

        <div className="flex flex-col gap-16 w-full mb-16">

            {/* toast message would do better */}
            {/* {loading
                ? <span className="font-medium text-xs text-foreground/75 animate-pulse"> <Spinner size="sm"/> Saving Data... </span>
                : dataSaved
                    ? <span className="font-medium text-xs text-success pulse"> ✓ Data-Saved </span>
                    : <span className="font-medium text-xs text-muted/75"> Auto-Save enabled </span>
            } */}

            {error && <p className="text-xs text-danger"> {error} </p>}

            <form className="flex flex-col gap-16 w-full">

                {/* Profile Information container */}
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-4 w-full">
                        <h2 className="text-xs min-w-max"> {t('settings.profile_info')} </h2>
                        <hr className="w-full border-0 border-b border-b-muted/15 mask-x-from-99%" />
                    </div>

                    {/* Profile Image */}
                    <div className="flex max-sm:flex-col items-center gap-6 w-full">
                        <div className="group/item relative w-fit h-30 md:h-35 p-1 md:p-2 aspect-square border border-muted/15 rounded-full bg-background overflow-hidden">
                            {/* <label htmlFor="fileToUpload" className="absolute hidden group-hover:item:flex group-active:item:flex items-center justify-center top-0 left-0 w-full h-full bg-muted/35 cursor-pointer"> {ICONS.arrowUpTray({className:'text-white size-8'})} </label>
                            <input type="file" name="fileToUpload" id="fileToUpload" className="hidden" /> */}
                            <img src={images[7]} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="flex flex-col max-sm:items-center justify-center gap-2">

                            <div>
                                <label htmlFor="upload-profile-picture" className="text-xs text-muted cursor-pointer hover:underline active:underline"> {t('settings.upload_picture')} </label>
                                <input id="upload-profile-picture" className="hidden" onClick={handleUploadProfilePicture} />
                            </div>
                            <div>
                                <label htmlFor="remove-profile-picture"
                                    className="text-sm text-danger cursor-pointer hover:underline active:underline"
                                > {t('settings.remove_picture')} </label>
                                <input id="remove-profile-picture" className="hidden" onClick={handleRemoveProfilePicture} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-3 md:gap-4 lg:w-3/5">

                        <div className="flex max-xs:flex-col md:flex-col lg:flex-row gap-3 md:gap-4 w-full">
                            <div className="w-full">
                                <label htmlFor="first-name-field" className="text-xs text-muted mx-1"> {t('settings.first_name')} </label>
                                <Input type="text" id="first-name-field" placeholder={t('settings.first_name')} className="bg-emphasis/75"
                                    value={settings.first_name ?? ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('first_name', e.target.value)} />
                            </div>

                            <div className="w-full">
                                <label htmlFor="last-name-field" className="text-xs text-muted mx-1"> {t('settings.last_name')} </label>
                                <Input type="text" id="last-name-field" placeholder={t('settings.last_name')}
                                    className="bg-emphasis/75"
                                    value={settings.last_name ?? ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('last_name', e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email-field" className="text-xs text-muted mx-1"> {t('settings.email')} </label>
                            <EmailInput id="email-field" className="bg-muted/5" readOnly={true} defaultValue={user.email} />
                        </div>

                        <div>
                            <label htmlFor="phone-field" className="text-xs text-muted mx-1"> {t('settings.phone')} </label>
                            <PhoneInput id="phone-field"
                                className="bg-emphasis/75"
                                value={settings.phone ?? ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phone', e.target.value)} />
                        </div>

                    </div>

                </div>


                {/* preferences container */}
                <div className="flex flex-col gap-8 mb-8">

                    <div className="flex items-center gap-4 w-full">
                        <h2 className="text-xs min-w-max"> {t('settings.preferences')} </h2>
                        <hr className="w-full border-0 border-b border-b-muted/15 mask-x-from-99%" />
                    </div>

                    {/* Inputs Container */}
                    <div className="flex flex-col w-full gap-3 md:gap-4 lg:w-3/5">

                        <div className="flex flex-col gap-2">
                            <label htmlFor="select-language" className="font-medium text-xs text-muted px-1"> {t('settings.language')} </label>
                            <SelectMenu
                                options={Languages}
                                placeholder={t('settings.language_placeholder')}
                                id="select-language"
                                value={Languages.find(s => s.value === language)}
                                onChange={(option: any) => {
                                    setLanguage(option.value);
                                    i18n.changeLanguage(option.value);
                                    debouncedSave('language', option.value);
                                }}
                                isSearchable={false}
                                required
                            />
                        </div>
                    </div>
                </div>
            </form>

            {/* Security container */}
            <div className="flex flex-col gap-4">

                <div className="flex items-center gap-4 w-full">
                    <h2 className="text-xs min-w-max"> {t('settings.security')} </h2>
                    <hr className="w-full border-0 border-b border-b-muted/15 mask-x-from-99%" />
                </div>

                {/* Container */}
                <div className="flex flex-col gap-3 md:gap-4 w-full lg:w-3/5">

                    <ul className="flex flex-col gap-4">
                        <li> <Link to={PATHS.CLIENT.PASSWORD_CHANGE}
                            className="flex items-center gap-2 w-full h-full px-2.5 py-2 bg-surface border border-muted/15 rounded-lg hover:underline active:underline"
                        > <ICONS.lockClosed className="size-5 text-muted" /> <span className="font-medium text-xs md:text-sm"> {t('settings.change_password')} </span> </Link>
                        </li>

                        <li> <Link to={PATHS.CLIENT.PASSWORD_CHANGE}
                            className="flex items-center gap-2 w-full h-full px-2.5 py-2 bg-surface border border-muted/15 rounded-lg hover:underline active:underline"
                        > <ICONS.questionMarkCircle className="size-5 text-muted" /> <span className="font-medium text-xs md:text-sm"> {t('settings.forgot_password')} </span> </Link>
                        </li>

                        <li> <Link to={PATHS.CLIENT.PASSWORD_CHANGE}
                            className="flex items-center gap-2 w-full h-full px-2.5 py-2 bg-surface border border-muted/15 rounded-lg hover:underline active:underline"
                        > <ICONS.bookOpen className="size-5 text-muted" /> <span className="font-medium text-xs md:text-sm"> {t('settings.privacy_policy')} </span> </Link>
                        </li>

                    </ul>
                </div>
            </div>
        </div>



    )
}
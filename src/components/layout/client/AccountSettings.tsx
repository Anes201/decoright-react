
import useAuth from "@/hooks/useAuth";
import Spinner from "@components/common/Spinner";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { allowedLocales } from "@/constants";
import { EmailInput, Input, PhoneInput } from "@components/ui/Input";
import { supabase } from "@/lib/supabase";
import { PATHS } from "@/routers/Paths";
import { Link, Navigate } from "react-router-dom";
import { SelectDropDownMenu } from "@components/ui/Select";
import { useTranslation } from "react-i18next";
import { CheckCircle, LockClosed, QuestionMarkCircle } from "@/icons";
import { PButton } from "@components/ui/Button";

// Normalize Algerian phone numbers to E.164 international format
function normalizePhone(raw: string): string {
    let p = raw.trim().replace(/[\s\-().]/g, '');
    if (p.startsWith('05') || p.startsWith('06') || p.startsWith('07')) return '+213' + p.slice(1);
    if (/^[567]\d{8}$/.test(p)) return '+213' + p;
    if (p.startsWith('00213')) return '+' + p.slice(2);
    if (p.startsWith('213') && p.length === 12) return '+' + p;
    return p;
}

export default function AccountSettingsLayout() {
    const { t, i18n } = useTranslation();
    const { user, loading: authLoading } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [language, setLanguage] = useState<string>(i18n.language || 'en');
    const [initializing, setInitializing] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);

    // ── Fetch profile data on mount ──────────────────────────────────────────
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('full_name, phone')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                const fullName = data?.full_name ?? '';
                const [first = '', ...rest] = fullName.split(' ');
                setFirstName(first);
                setLastName(rest.join(' '));
                setPhone(data?.phone ?? '');
            } catch (err: any) {
                console.error('Error fetching profile:', err);
                setGlobalError(err?.message ?? t('settings.error_load'));
            } finally {
                setInitializing(false);
            }
        };

        if (!authLoading) fetchProfile();
    }, [user, authLoading]);

    if (!user) return <Navigate to={PATHS.LOGIN} replace />;

    if (initializing) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 w-full h-64">
                <Spinner status={initializing} />
                <span className="text-xs text-muted">{t('profile.loading')}</span>
            </div>
        );
    }

    // ── Validation ────────────────────────────────────────────────────────────
    function validate(): boolean {
        const errors: Record<string, string> = {};

        if (!firstName.trim()) errors.firstName = t('settings.error_required');
        else if (firstName.length > 50) errors.firstName = t('settings.error_max_length', { max: 50 });

        if (!lastName.trim()) errors.lastName = t('settings.error_required');
        else if (lastName.length > 50) errors.lastName = t('settings.error_max_length', { max: 50 });

        const phoneDigits = phone.trim().replace(/[\s\-().]/g, '');
        if (phoneDigits && phoneDigits.length < 9) {
            errors.phone = t('settings.error_invalid_phone');
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    // ── Save Handler ─────────────────────────────────────────────────────────
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError(null);

        if (!validate()) return;

        const normalizedPhone = phone.trim() ? normalizePhone(phone) : null;

        // Check for duplicate phone (only if user changed it)
        if (normalizedPhone) {
            const { data: existing } = await supabase
                .from('profiles')
                .select('id')
                .eq('phone', normalizedPhone)
                .neq('id', user.id)
                .maybeSingle();

            if (existing) {
                setFieldErrors(prev => ({ ...prev, phone: t('auth.error_phone_taken') || 'This phone number is already linked to another account.' }));
                return;
            }
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
                    phone: normalizedPhone,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success(t('settings.saved'));
        } catch (err: any) {
            console.error('Failed to save settings:', err);
            setGlobalError(t('settings.error_generic'));
        } finally {
            setSaving(false);
        }
    };

    // ── Language (instant, no Save needed) ───────────────────────────────────
    function handleLanguageChange(option: any) {
        if (!allowedLocales.includes(option.value)) return;
        setLanguage(option.value);
        i18n.changeLanguage(option.value);
    }


    const languageChoices = [
        { id: 'en', label: t('common.english'), value: 'en', icon: null },
        { id: 'fr', label: t('common.french'), value: 'fr', icon: null },
        { id: 'ar', label: t('common.arabic'), value: 'ar', icon: null },
    ];

    return (
        <div className="flex flex-col gap-10 md:gap-16 w-full mb-16 px-1">

            {globalError && (
                <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                    {globalError}
                </p>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-10 md:gap-16 w-full">

                {/* ── Profile Information ────────────────────────────── */}
                <div className="flex flex-col gap-6 md:gap-8">
                    <div className="flex items-center gap-4 w-full">
                        <h2 className="text-xs font-medium text-muted min-w-max">{t('settings.profile_info')}</h2>
                        <hr className="w-full border-0 border-b border-b-muted/15" />
                    </div>

                    {/* Fields */}
                    <div className="flex flex-col w-full gap-4 lg:max-w-2xl">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="w-full">
                                <label htmlFor="first-name-field" className="block text-xs text-muted mb-1.5 mx-1">{t('settings.first_name')}</label>
                                <Input
                                    type="text"
                                    id="first-name-field"
                                    placeholder={t('settings.first_name')}
                                    className="bg-emphasis/75"
                                    value={firstName}
                                    error={fieldErrors.firstName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setFirstName(e.target.value);
                                        setFieldErrors(prev => ({ ...prev, firstName: '' }));
                                    }}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="last-name-field" className="block text-xs text-muted mb-1.5 mx-1">{t('settings.last_name')}</label>
                                <Input
                                    type="text"
                                    id="last-name-field"
                                    placeholder={t('settings.last_name')}
                                    className="bg-emphasis/75"
                                    value={lastName}
                                    error={fieldErrors.lastName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setLastName(e.target.value);
                                        setFieldErrors(prev => ({ ...prev, lastName: '' }));
                                    }}
                                />
                            </div>
                        </div>

                        {/* Email — read-only */}
                        <div>
                            <label htmlFor="email-field" className="block text-xs text-muted mb-1.5 mx-1">{t('settings.email')}</label>
                            <EmailInput dir="ltr" id="email-field" className="bg-muted/5 opacity-70" readOnly={true} defaultValue={user.email} />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone-field" className="block text-xs text-muted mb-1.5 mx-1">{t('settings.phone')}</label>
                            <PhoneInput
                                dir="ltr"
                                id="phone-field"
                                className="bg-emphasis/75"
                                value={phone}
                                error={fieldErrors.phone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setPhone(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, phone: '' }));
                                }}
                            />
                            <p className="text-2xs text-muted mt-1 mx-1">e.g. 0550 123 456 — saved as +213...</p>
                        </div>

                    </div>
                </div>

                {/* ── Preferences ───────────────────────────────────── */}
                <div className="flex flex-col gap-6 md:gap-8">
                    <div className="flex items-center gap-4 w-full">
                        <h2 className="text-xs font-medium text-muted min-w-max">{t('settings.preferences')}</h2>
                        <hr className="w-full border-0 border-b border-b-muted/15" />
                    </div>

                    <div className="flex flex-col w-full gap-4 lg:max-w-xl">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="select-language" className="text-xs text-muted px-1">{t('settings.language')}</label>
                            <SelectDropDownMenu
                                options={languageChoices}
                                placeholder={t('settings.language_placeholder')}
                                id="select-language"
                                value={languageChoices.find(s => s.value === language)}
                                onChange={handleLanguageChange}
                                isSearchable={false}
                                required
                            />
                            <p className="text-2xs text-muted px-1">Language changes apply instantly.</p>
                        </div>
                    </div>
                </div>

                {/* ── Save Button ────────────────────────────────────── */}
                <div className="flex items-center gap-4">
                    <PButton
                        type="submit"
                        loading={saving}
                        className="w-full sm:w-auto px-10 py-3 rounded-xl"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle className="size-4" />
                            {t('common.save')}
                        </div>
                    </PButton>
                </div>

            </form>

            {/* ── Security ──────────────────────────────────────────── */}
            <div className="flex flex-col gap-6 md:gap-8">
                <div className="flex items-center gap-4 w-full">
                    <h2 className="text-xs font-medium text-muted min-w-max">{t('settings.security')}</h2>
                    <hr className="w-full border-0 border-b border-b-muted/15" />
                </div>

                <div className="flex flex-col gap-3 w-full lg:max-w-xl">
                    <ul className="flex flex-col gap-3">
                        <li>
                            <Link
                                to={PATHS.CLIENT.PASSWORD_CHANGE}
                                className="flex items-center gap-3 w-full px-3 py-2.5 bg-surface border border-muted/15 rounded-xl hover:border-muted/30 transition-colors"
                            >
                                <LockClosed className="size-5 text-muted shrink-0" />
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{t('settings.change_password')}</span>
                                    <span className="text-2xs text-muted">Update your current password</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={PATHS.PASSWORD_RESET}
                                className="flex items-center gap-3 w-full px-3 py-2.5 bg-surface border border-muted/15 rounded-xl hover:border-muted/30 transition-colors"
                            >
                                <QuestionMarkCircle className="size-5 text-muted shrink-0" />
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{t('settings.forgot_password')}</span>
                                    <span className="text-2xs text-muted">Reset via email link</span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
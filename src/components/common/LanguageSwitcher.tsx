import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { ICONS } from '@/icons';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    useEffect(() => {
        const dir = i18n.language.startsWith('ar') ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    const languages = [
        { code: 'en', label: 'English', flag: 'EN' },
        { code: 'fr', label: 'Français', flag: 'FR' },
        { code: 'ar', label: 'العربية', flag: 'AR' },
    ];

    const currentLang = languages.find(l => i18n.language.startsWith(l.code)) || languages[0];

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-muted/10 transition-colors border border-muted/20">
                <span className="text-xs font-bold">{currentLang.flag}</span>
                <span className="text-xs font-medium hidden sm:inline">{currentLang.label}</span>
                {ICONS.chevronDown({ className: 'size-3 text-muted/60' })}
            </button>

            {/* Dropdown */}
            <div className="absolute top-full right-0 mt-2 w-32 bg-background border border-muted/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-1">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => i18n.changeLanguage(lang.code)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${i18n.language.startsWith(lang.code) ? 'bg-primary/10 text-primary' : 'hover:bg-muted/5'
                                }`}
                        >
                            {lang.label}
                            {i18n.language.startsWith(lang.code) && ICONS.check({ className: 'size-3' })}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

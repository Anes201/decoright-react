
import { ICONS } from '@/icons';
import { languages } from '@/constants/navigation';
import { useTranslation } from 'react-i18next';
import { allowedLocales } from '@/constants';
import i18n from '@/utils/i18n';
import toast from 'react-hot-toast';

interface LanguageSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function MenuLanguageSelectorModal({ isOpen, onClose, onSuccess }: LanguageSelectorModalProps) {

    if (!isOpen) return null;

    const { t } = useTranslation('nav')

    function handleChange(value: string) {

        if (!allowedLocales.includes(value)) return;
        i18n.changeLanguage(value); // This is the global trigger

        onSuccess()
    };

    return (
        <div dir={document.documentElement.dir} className="fixed flex justify-center top-0 right-0 w-full md:w-w-[22rem] lg:w-1/3 xl:w-1/4 h-full z-30">
            <div className="absolute w-full h-full z-10 bg-muted/45 md:mask-l-to-transparent md:mask-l-from-0"></div>
            <div className="relative p-2 space-y-4 w-full z-30">
                <div className="flex flex-col gap-2 w-full h-full p-2 border border-muted/25 bg-surface rounded-lg">
                    {/* Card Header */}
                    <div className="flex justify-between w-full h-fit border border-muted/15 p-2 rounded-lg">
                        <h2 className="text-sm font-semibold"> { t('nav:menu_language_settings_header') } </h2>
                        <button type="button" title={ t('nav:menu_language_settings_area_label') } area-label={ t('nav:menu_language_settings_area_label') } onClick={onClose}>
                            <ICONS.xMark />
                        </button>
                    </div>

                    {/* Card Content */}
                    <ul className="flex flex-col w-full h-full border border-muted/15 rounded-lg overflow-auto">
                        { languages().map((lang) => (
                            <li onClick={() => handleChange(lang.value)}
                                className="flex items-center justify-between font-medium px-2 py-4 border-b border-b-muted/15 cursor-pointer hover:bg-emphasis active:bg-emphasis"
                                > <span> { lang.label } </span> <ICONS.chevronRight className="size-4 rtl:rotate-180" />
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </div>

    )
}

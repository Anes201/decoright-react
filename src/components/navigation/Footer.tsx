import { Link } from "react-router-dom";
import { publicMenuItems } from "@/constants/navigation";
import { SocialMediaPhoneFields, SocialMediaUrlFields } from "@/constants";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Logo = "/decoright.jpeg";

export function Footer() {
    const { t } = useTranslation();
    const {
        settings,
        companyName
    } = useSiteSettings();

    // Map all social fields to their values and icons
    const allSocialFields = [...SocialMediaUrlFields, ...SocialMediaPhoneFields];
    const activeSocialLinks = allSocialFields
        .map(field => {
            const value = settings[field.key];
            if (!value) return null;

            let url = value;
            if (field.key === 'whatsapp') {
                url = `https://wa.me/${value.replace(/\+/g, '')}`;
            } else if (field.key === 'telegram') {
                url = `https://t.me/${value.replace(/\+/g, '').replace('@', '')}`;
            }

            return {
                key: field.key,
                label: field.label,
                url,
                icon: field.icon
            };
        })
        .filter((link): link is NonNullable<typeof link> => link !== null);

    return (
        <div className="content-container">
            <div className="flex max-md:flex-col items-center md:justify-between gap-8">

                <div className="flex max-sm:flex-col max-sm:items-center gap-4 md:gap-8 mb-6 md:mb-0">

                    {/* Logo */}
                    <div className="w-14 md:w-12">
                        <Link to={'/'}>
                            <img src={Logo} alt={`${companyName} Logo`} className="w-full h-full" />
                        </Link>
                    </div>

                    <div className="max-sm:text-center">
                        <h3 className="font-medium mb-2"> {companyName} </h3>
                        <p className="text-2xs text-muted/75 max-w-xs">
                            {t('footer.description', { companyName })}
                        </p>
                    </div>
                </div>

                <div>

                    {/* Social Media Link List */}
                    <ul className="flex justify-center md:justify-end gap-4 mb-4">
                        {activeSocialLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <li key={link.key}>
                                    <Link to={link.url} title={link.label} className="content-center p-2" target="_blank" rel="noopener noreferrer">
                                        <span className="size-5 md:size-6 block">
                                            <Icon className="w-full h-full" />
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Navigation Link List */}
                    <ul className="flex flex-wrap max-md:justify-center justify-end gap-4 md:gap-6">
                        {publicMenuItems.map((item, index) => (
                            <li key={index}>
                                <Link to={item.path} className="text-xs hover:underline"> {t(`nav.${item.key}`)} </Link>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
            <div className="flex max-md:justify-center text-xs text-muted/75 border-t border-muted/15 my-4 pt-4">
                <p>© {new Date().getFullYear()} {companyName}. {t('footer.rights')}</p>
            </div>

        </div>
    )
}

export default Footer;
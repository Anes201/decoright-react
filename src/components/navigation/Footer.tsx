
import { Link } from "react-router-dom";
import { publicMenuItems } from "@/constants/navigation";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Whatsapp } from "@/icons";

const Logo = "/decoright.jpeg";

import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Footer() {
    const { t } = useTranslation();
    const {
        facebook,
        instagram,
        tiktok,
        youtube,
        whatsapp,
        companyName
    } = useSiteSettings();

    const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/\+/g, '')}` : '/';

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
                    <ul className="flex justify-center md:justify-end gap-4">
                        <li>
                            <Link to={facebook || '/'} title={t('footer.social.facebook')} className="content-center p-2" target={facebook ? "_blank" : undefined}>
                                <Facebook />
                            </Link>
                        </li>
                        <li>
                            <Link to={tiktok || '/'} title={t('footer.social.tiktok')} className="content-center p-2" target={tiktok ? "_blank" : undefined}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="size-5 md:size-6"><path d="M544.5 273.9C500.5 274 457.5 260.3 421.7 234.7L421.7 413.4C421.7 446.5 411.6 478.8 392.7 506C373.8 533.2 347.1 554 316.1 565.6C285.1 577.2 251.3 579.1 219.2 570.9C187.1 562.7 158.3 545 136.5 520.1C114.7 495.2 101.2 464.1 97.5 431.2C93.8 398.3 100.4 365.1 116.1 336C131.8 306.9 156.1 283.3 185.7 268.3C215.3 253.3 248.6 247.8 281.4 252.3L281.4 342.2C266.4 337.5 250.3 337.6 235.4 342.6C220.5 347.6 207.5 357.2 198.4 369.9C189.3 382.6 184.4 398 184.5 413.8C184.6 429.6 189.7 444.8 199 457.5C208.3 470.2 221.4 479.6 236.4 484.4C251.4 489.2 267.5 489.2 282.4 484.3C297.3 479.4 310.4 469.9 319.6 457.2C328.8 444.5 333.8 429.1 333.8 413.4L333.8 64L421.8 64C421.7 71.4 422.4 78.9 423.7 86.2C426.8 102.5 433.1 118.1 442.4 131.9C451.7 145.7 463.7 157.5 477.6 166.5C497.5 179.6 520.8 186.6 544.6 186.6L544.6 274z" /></svg>
                            </Link>
                        </li>
                        <li>
                            <Link to={instagram || '/'} title={t('footer.social.instagram')} className="content-center p-2" target={instagram ? "_blank" : undefined}>
                                <Instagram />
                            </Link>
                        </li>

                        <li>
                            <Link to={youtube || '/'} title={t('footer.social.youtube')} className="content-center p-2" target={youtube ? "_blank" : undefined}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="size-5 md:size-6"><path d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z" /></svg>
                            </Link>
                        </li>

                        <li>
                            <Link to={whatsappUrl} title={t('footer.social.whatsapp')} className="content-center p-2" target={whatsapp ? "_blank" : undefined}>
                                <Whatsapp className="size-6" />
                            </Link>
                        </li>

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
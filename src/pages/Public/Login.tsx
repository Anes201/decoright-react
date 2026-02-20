
import { LoginLayout } from "@components/layout/Login"
import { useTranslation } from "react-i18next"

export default function LoginPage(){

    const { t } = useTranslation()
    return (

        <main>
            <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full md:mt-8 ">
                <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

                <div className="relative flex flex-col justify-center items-center gap-6 w-full h-full md:py-8 ">
                    <div className="absolute max-md:hidden top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/45 -z-10 mask-b-to-transparent mask-b-to-100%" />

                    <div className="flex flex-col items-center gap-4">
                        <h1 className="font-semibold text-center text-lg xs:text-2xl md:text-4xl"> {t('auth.login_to')} <span className="text-transparent bg-linear-to-br from-foreground to-primary to-65% bg-clip-text">DecoRight</span> </h1>
                        <p className="text-ellipsis-2line text-2xs md:text-xs text-muted">{t('auth.login_description')}</p>
                    </div>

                    <LoginLayout />

                </div>

                <div className="absolute left-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
            </section>
        </main>

    )
}
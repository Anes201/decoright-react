
import AccountSettingsLayout from "@components/layout/client/AccountSettings"
import { useTranslation } from "react-i18next";

export default function AccountSettings() {
    const { t } = useTranslation();
    return (

        <main>

            <section className="h-hero min-h-hero content-container mx-auto relative flex flex-col items-center justify-center w-full mt-8">
                <div className="relative flex flex-col gap-16 w-full h-full">
                    <h1 className="font-semibold text-lg md:text-2xl"> {t('settings.title')} </h1>

                    <div className="space-y-4 w-full">
                        <AccountSettingsLayout />
                    </div>

                </div>

            </section>
        </main>

    )
}


import AccountSettingsLayout from "@components/layout/client/AccountSettings"
import { useTranslation } from "react-i18next";

export default function AccountSettings() {
    const { t } = useTranslation();
    return (

        <main>

            <section className="h-auto min-h-screen content-container mx-auto relative flex flex-col items-center justify-start w-full mt-8 pb-16">
                <div className="relative flex flex-col gap-10 md:gap-16 w-full h-full px-4 sm:px-0">
                    <h1 className="font-semibold text-xl md:text-2xl pt-4"> {t('settings.title')} </h1>

                    <div className="space-y-4 w-full">
                        <AccountSettingsLayout />
                    </div>

                </div>

            </section>
        </main>

    )
}

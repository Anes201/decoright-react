import { useState, useEffect } from "react"
import { ProjectCardList } from "@/components/layout/ProjectList"
import { PATHS } from "@/routers/Paths"
import { PCTALink } from "@components/ui/CTA"
import { AdminService } from "@/services/admin.service"

export default function ProjectListPage() {
    const [settings, setSettings] = useState<Record<string, string>>({});

    useEffect(() => {
        async function fetchSettings() {
            try {
                const data = await AdminService.getSettings();
                setSettings(data);
            } catch (error) {
                console.error("Failed to fetch site settings:", error);
            }
        }
        fetchSettings();
    }, []);

    const pageTitle = settings.project_list_title || "Our Portfolio";
    const pageDescription = settings.project_list_description || "Explore our collection of completed projects showcasing our design expertise across various spaces and styles.";

    return (
        <main>
            <section className="content-container relative px-4 sm:px-8 md:px-12 mb-16">
                {/* <div className="absolute top-0 left-0 w-full h-1/2 -z-10 border border-muted/15 rounded-t-4xl mask-b-to-transparent mask-b-from-90%"></div> */}
                <div className="w-full h-full my-8 md:my-12">
                    {/* Context */}
                    <div className="flex flex-col gap-4 md:gap-8 md:p-8 md:border border-muted/15 rounded-4xl">

                        <div className="space-y-2 md:space-y-4">
                            <h1 className="font-semibold text-lg sm:text-2xl md:text-3xl leading-6">
                                {pageTitle}
                            </h1>
                            <p className="text-2xs md:text-xs">
                                {pageDescription}
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="flex gap-2">
                            <PCTALink to={PATHS.CLIENT.REQUEST_SERVICE}> Request a Project </PCTALink>
                        </div>

                    </div>

                    {/* Hero Image */}
                    <div>

                    </div>
                </div>


                <div>
                    <ProjectCardList />
                </div>

            </section>

        </main>
    )
}
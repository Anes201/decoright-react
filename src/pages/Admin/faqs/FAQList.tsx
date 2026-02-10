
import FAQList from "@/components/layout/admin/faqs/FAQList";
import { Link } from "react-router-dom";
import { PATHS } from "@/routers/Paths";
import { ICONS } from "@/icons";

export default function FAQListPage() {
    return (
        <main className="min-h-screen">
            <section className="relative flex flex-col w-full px-4 md:px-8 pt-6 pb-20">
                <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-muted/10 pb-6">
                        <div className="flex flex-col gap-1">
                            <h1 className="font-bold text-2xl tracking-tight">FAQ Management</h1>
                            <p className="text-sm text-muted">Manage the frequently asked questions displayed on the public site.</p>
                        </div>
                        <Link to={PATHS.ADMIN.FAQ_CREATE} className="p-button">
                            <ICONS.plus className="size-4 mr-2" />
                            Add FAQ Item
                        </Link>
                    </div>

                    <div className="w-full">
                        <FAQList />
                    </div>
                </div>
            </section>
        </main>
    );
}

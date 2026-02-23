
import FAQList from "@/components/layout/admin/faqs/FAQList";
import { Link } from "react-router-dom";
import { PATHS } from "@/routers/Paths";
import { Plus } from "@/icons";

export default function FAQListPage() {
    return (
        <main className="w-full h-full">
            <section className="flex flex-col pt-4 md:pt-6 w-full h-full">
                <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="font-medium text-2xl tracking-tight">FAQ Management</h1>
                            <p className="text-sm text-muted">Manage the frequently asked questions displayed on the public site.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex items-center justify-end gap-2 w-full h-fit">
                            <Link to={PATHS.ADMIN.FAQ_CREATE} className="flex items-center px-3 py-1.5 border border-muted/15 rounded-full bg-emphasis">
                                <Plus className="size-4 mr-2" />
                                <span className="font-medium text-sm">Add FAQ Item</span>
                            </Link>
                        </div>

                        <FAQList />
                    </div>
                </div>
            </section>
        </main>
    );
}

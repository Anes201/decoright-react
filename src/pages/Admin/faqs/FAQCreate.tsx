import { Link } from "react-router-dom";
import FAQForm from "@/components/layout/admin/faqs/FAQForm";
import { PATHS } from "@/routers/Paths";
import { ICONS } from "@/icons";

export default function FAQCreatePage() {
    return (
        <main className="w-full">
            <section className="relative flex flex-col w-full px-4 md:px-8 py-6">
                <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
                    <div className="flex flex-col gap-1 border-b border-muted/10 pb-6">
                        <div className="flex items-center gap-2 text-muted mb-2">
                            <Link to={PATHS.ADMIN.FAQ_LIST} className="hover:text-primary transition-colors text-sm">FAQ Management</Link>
                            <ICONS.chevronRight className="size-3" />
                            <span className="text-sm">Create</span>
                        </div>
                        <h1 className="font-bold text-2xl tracking-tight">Add FAQ Item</h1>
                        <p className="text-sm text-muted">Create a new frequently asked question with multi-language support.</p>
                    </div>

                    <div className="w-full">
                        <FAQForm />
                    </div>
                </div>
            </section>
        </main>
    );
}

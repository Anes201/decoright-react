

import Spinner from "@/components/common/Spinner";
import { PButton } from "@/components/ui/Button";
import { SCTALink } from "@/components/ui/CTA";
import FileUploadPanel from "@/components/ui/FileUploadPanel";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ServiceSpaceCreateLayout() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        // formData items read but not directly used in this logic
        formData.get('service-space-title');
        formData.get('service-space-description');

        try {
            // Create the service space here
            navigate(-1); // Go back after success
        } catch (error) {
            console.error("Failed to create service:", error);
            alert("Failed to create service. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} id="service-create-form" className="flex flex-col gap-10">

            {/* Inputs & Data */}
            <div className="flex max-lg:flex-col gap-8 w-full h-full">
                <div className="flex flex-col gap-6 w-full h-full">

                    <div className="flex flex-col gap-2 h-full">
                        <label htmlFor="service-space-title" className="font-medium text-xs text-muted px-1"> Title </label>
                        <Input type="text" name="service-space-title" id="service-space-title" placeholder="Service Title" required
                            className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                    </div>

                    <div className="flex flex-col gap-2 h-full">
                        <label htmlFor="service-space-description" className="font-medium text-xs text-muted px-1"> Description </label>
                        <textarea name="service-space-description" id="service-space-description" rows={5} placeholder='Space Service description...' required
                            className="w-full h-full p-2.5 text-sm bg-emphasis/75 rounded-lg outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45">
                        </textarea>
                    </div>

                    <FileUploadPanel />
                </div>
            </div>

            {/* CTA & Submit */}
            <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit">
                <PButton type="submit" className="w-full" disabled={loading}>
                    <Spinner status={loading}> Update Space Service </Spinner>
                </PButton>
                <SCTALink to={-1} className="w-full"> Cancel </SCTALink>
            </div>
        </form>
    )
}
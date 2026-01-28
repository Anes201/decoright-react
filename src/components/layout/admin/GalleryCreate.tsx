

import Spinner from "@/components/common/Spinner";
import toast from "react-hot-toast";
import FileRow from "@/components/ui/FileRow";
import { PButton } from "@/components/ui/Button";
import { SCTALink } from "@/components/ui/CTA";
import { useStagedFiles } from "@/hooks/useStagedFiles";
import { ICONS } from "@/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GalleryCreateLayout() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { files, addSingleFile, removeFile, retryFile } = useStagedFiles();

    const onUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        addSingleFile(e.target.files);
        // reset input so same file chosen again will still trigger change
        e.currentTarget.value = "";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        try {

        } catch (error) {
            console.error("Failed to create project:", error);
            toast.error("Failed to create project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} id="create-project-form" className="flex flex-col gap-10">

            {/* Inputs Container */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2 h-full">
                    <label htmlFor="project-title" className="font-medium text-xs text-muted px-1"> Title </label>
                    <input type="text" name="project-title" id="project-title" placeholder="Project Title" required
                    className="w-full p-2.5 text-sm text-muted bg-emphasis/75 rounded-lg cursor-text outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45" />
                </div>

                <div className="flex flex-col gap-2 h-full">
                    <label htmlFor="project-description" className="font-medium text-xs text-muted px-1"> Description </label>
                    <textarea name="description" id="project-description" rows={5} placeholder='Project description...' required
                        className="w-full h-full p-2.5 text-sm bg-emphasis/75 rounded-lg outline-1 outline-muted/15 hover:outline-muted/35 focus:outline-primary/45">
                    </textarea>
                </div>

                <div className="flex flex-col gap-2 border border-muted/15 bg-surface rounded-lg">
                    <div className="flex justify-between gap-8 w-full p-3 ">

                        <div className="flex items-center px-2">
                            <span> <ICONS.photo className='size-6 text-muted'/> </span>
                            <span className="text-2xs md:text-xs text-muted px-2"> Upload Gallery Before Image </span>
                        </div>

                        <div>
                            <label htmlFor="gallery-before-img"
                            className="flex items-center font-medium text-2xs md:text-xs text-muted border border-muted/25 bg-emphasis rounded-md px-4 py-2 shadow-2xs cursor-pointer"
                            > Upload </label>
                            <input type="file" name="gallery-before-img" id="gallery-before-img"
                            className="hidden" accept="image/*"
                            onChange={onUploadChange} />
                        </div>
                    </div>

                    {
                        files.length > 0 &&

                        <ul role="list" aria-label="Staged files"
                        className="flex flex-col gap-2 w-full h-fit border-0 border-t border-muted/15">
                            {files.map((f) => (
                                <FileRow key={f.id} file={f} onRemove={removeFile} onRetry={retryFile} />
                            ))}
                        </ul>
                    }

                </div>

                <div className="flex flex-col gap-2 border border-muted/15 bg-surface rounded-lg">
                    <div className="flex justify-between gap-8 w-full p-3 ">

                        <div className="flex items-center px-2">
                            <span> <ICONS.photo className='size-6 text-muted'/> </span>
                            <span className="text-2xs md:text-xs text-muted px-2"> Upload Gallery After Image </span>
                        </div>

                        <div>
                            <label htmlFor="gallery-after-img"
                            className="flex items-center font-medium text-2xs md:text-xs text-muted border border-muted/25 bg-emphasis rounded-md px-4 py-2 shadow-2xs cursor-pointer"
                            > Upload </label>
                            <input type="file" name="gallery-after-img" id="gallery-after-img"
                            className="hidden" accept="image/*"
                            onChange={onUploadChange} />
                        </div>
                    </div>

                    {
                        files.length > 0 &&

                        <ul role="list" aria-label="Staged files"
                        className="flex flex-col gap-2 w-full h-fit border-0 border-t border-muted/15">
                            {files.map((f) => (
                                <FileRow key={f.id} file={f} onRemove={removeFile} onRetry={retryFile} />
                            ))}
                        </ul>
                    }

                </div>

            </div>



            {/* CTA & Submit */}
            <div className="flex max-xs:flex-col md:flex-row gap-3 md:gap-4 w-full md:w-fit">
                <PButton type="submit" className="w-full" disabled={loading}>
                    <Spinner status={loading} size="sm"> Create Gallery </Spinner>
                </PButton>
                <SCTALink to={'/admin'} className="w-full"> Cancel </SCTALink>
            </div>
        </form>
    )
}
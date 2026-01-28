import { ICONS } from '@/icons';
import ProjectForm from './ProjectForm';

interface ProjectDrawerProps {
    project: any | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProjectDrawer({ project, isOpen, onClose, onSuccess }: ProjectDrawerProps) {

    // Prevent background scrolling when drawer is open
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-surface border-l border-muted/20 z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-muted/10 bg-background/50">
                        <div>
                            <h2 className="text-xl font-bold text-heading">
                                {project ? 'Edit Project' : 'Create New Project'}
                            </h2>
                            <p className="text-sm text-muted mt-1">
                                {project ? 'Update project details and gallery.' : 'Add a new project to your showcase.'}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-emphasis rounded-full transition-colors">
                            <ICONS.xMark className="size-6 text-muted" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden p-6 bg-background">
                        <ProjectForm
                            project={project}
                            onSuccess={onSuccess}
                            onCancel={onClose}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

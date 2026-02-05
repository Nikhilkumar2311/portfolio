import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, CheckCircle2, Clock, Lightbulb, Wrench, Target, Image, X } from 'lucide-react';
import { SectionTitle } from './ui/SectionTitle';
import { Button } from './ui/Button';
import { TiltCard } from './ui/AceternityEffects';
import { projects } from '../data/projects';
import type { ProjectStatus } from '../types';

// Status configuration
const statusConfig: Record<ProjectStatus, { label: string; color: string; bgColor: string; icon: typeof CheckCircle2 }> = {
    'completed': {
        label: 'Completed',
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
        icon: CheckCircle2,
    },
    'in-progress': {
        label: 'In Progress',
        color: 'text-amber-400',
        bgColor: 'bg-amber-400/10',
        icon: Clock,
    },
    'planned': {
        label: 'Planned',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        icon: Lightbulb,
    },
};

// Modal component for architecture diagram
function DiagramModal({
    isOpen,
    onClose,
    imageSrc,
    title
}: {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    title: string;
}) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

                    {/* Modal Content */}
                    <motion.div
                        className="relative max-w-3xl max-h-[80vh] w-full bg-surface rounded-2xl border border-border overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="text-lg font-semibold text-text-primary">
                                {title} - Architecture
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-border transition-colors"
                            >
                                <X size={20} className="text-text-secondary" />
                            </button>
                        </div>

                        {/* Image - scrollable */}
                        <div className="p-4 overflow-auto max-h-[calc(80vh-80px)]">
                            <img
                                src={imageSrc}
                                alt={`${title} Architecture Diagram`}
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function Projects() {
    const [selectedDiagram, setSelectedDiagram] = useState<{ src: string; title: string } | null>(null);

    return (
        <section id="projects" className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Projects"
                    subtitle="Hands-on projects demonstrating DevOps practices"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {projects.map((project, index) => {
                        const status = statusConfig[project.status];
                        const StatusIcon = status.icon;
                        const isCompleted = project.status === 'completed';

                        return (
                            <motion.div
                                key={project.title}
                                className="h-full"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.15,
                                    ease: [0.25, 0.4, 0.25, 1]
                                }}
                            >
                                <TiltCard tiltAmount={5} className="h-full">
                                    <div className={`relative h-full p-6 pt-8 rounded-2xl border backdrop-blur-sm flex flex-col ${isCompleted
                                        ? 'border-green-400/30 bg-green-400/5'
                                        : 'border-amber-400/30 bg-amber-400/5'
                                        }`}>
                                        {/* Status Badge with solid background and matching border */}
                                        <div className={`absolute -top-3 left-6 px-3 py-1.5 rounded-full flex items-center gap-1.5 border ${isCompleted
                                            ? 'bg-[#0a1a12] border-green-400/60'
                                            : 'bg-[#1a1408] border-amber-400/60'
                                            }`}>
                                            <StatusIcon size={14} className={status.color} />
                                            <span className={`text-xs font-medium ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        {/* Project Title */}
                                        <h3 className="text-xl font-bold text-text-primary mt-2 mb-3">
                                            {project.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-text-secondary text-sm mb-4">
                                            {project.description}
                                        </p>

                                        {/* Problem / Solution / Outcome */}
                                        {(project.problem || project.solution || project.outcome) && (
                                            <div className="space-y-3 mb-5 p-4 rounded-xl bg-surface/50 border border-border">
                                                {project.problem && (
                                                    <div className="flex gap-3">
                                                        <div className="p-1.5 rounded-lg bg-red-400/10 h-fit">
                                                            <Lightbulb size={14} className="text-red-400" />
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-red-400 uppercase tracking-wide">Problem</span>
                                                            <p className="text-text-secondary text-sm">{project.problem}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {project.solution && (
                                                    <div className="flex gap-3">
                                                        <div className="p-1.5 rounded-lg bg-primary/10 h-fit">
                                                            <Wrench size={14} className="text-primary" />
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-primary uppercase tracking-wide">Solution</span>
                                                            <p className="text-text-secondary text-sm">{project.solution}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {project.outcome && (
                                                    <div className="flex gap-3">
                                                        <div className="p-1.5 rounded-lg bg-green-400/10 h-fit">
                                                            <Target size={14} className="text-green-400" />
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-medium text-green-400 uppercase tracking-wide">Outcome</span>
                                                            <p className="text-text-secondary text-sm">{project.outcome}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Architecture Diagram Button */}
                                        {project.architectureDiagram && (
                                            <button
                                                onClick={() => setSelectedDiagram({
                                                    src: project.architectureDiagram!,
                                                    title: project.title
                                                })}
                                                className="mb-5 w-full p-3 rounded-xl bg-surface border border-border flex items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                                            >
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <Image size={18} className="text-primary" />
                                                </div>
                                                <span className="text-text-secondary text-sm">View Architecture Diagram</span>
                                            </button>
                                        )}

                                        {/* Tech Stack */}
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {project.techStack.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-3 py-1 rounded-full bg-surface border border-border text-text-primary text-xs font-medium"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 mt-auto pt-2">
                                            {project.githubUrl && (
                                                <Button variant="outline" href={project.githubUrl} className="text-sm px-4 py-2">
                                                    <Github size={16} />
                                                    GitHub
                                                </Button>
                                            )}
                                            {project.liveUrl && (
                                                <Button variant="secondary" href={project.liveUrl} className="text-sm px-4 py-2">
                                                    <ExternalLink size={16} />
                                                    Live Demo
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Diagram Modal */}
            <DiagramModal
                isOpen={selectedDiagram !== null}
                onClose={() => setSelectedDiagram(null)}
                imageSrc={selectedDiagram?.src || ''}
                title={selectedDiagram?.title || ''}
            />
        </section>
    );
}

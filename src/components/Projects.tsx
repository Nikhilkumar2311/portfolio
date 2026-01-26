import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { SectionTitle } from './ui/SectionTitle';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { projects } from '../data/projects';

export function Projects() {
    return (
        <section id="projects" className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Projects"
                    subtitle="Hands-on projects demonstrating DevOps practices"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full flex flex-col">
                                <h3 className="text-xl font-semibold text-text-primary mb-3">
                                    {project.title}
                                </h3>
                                <p className="text-text-secondary mb-4 grow">
                                    {project.description}
                                </p>

                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.techStack.map((tech) => (
                                        <Badge key={tech} variant="primary">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    {project.githubUrl && (
                                        <Button variant="outline" href={project.githubUrl} className="text-sm px-4 py-2">
                                            <Github size={16} />
                                            GitHub
                                        </Button>
                                    )}
                                    {project.liveUrl && (
                                        <Button variant="secondary" href={project.liveUrl} className="text-sm px-4 py-2">
                                            <ExternalLink size={16} />
                                            Live
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

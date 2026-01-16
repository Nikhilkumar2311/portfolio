import { motion } from 'framer-motion';
import { Briefcase, /*Award*/ } from 'lucide-react';
import { SectionTitle } from './ui/SectionTitle';
import { Card } from './ui/Card';
import { experiences, /*certifications*/ } from '../data/experience';

export function Experience() {
    return (
        <section id="experience" className="py-20 md:py-32">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Experience"
                    subtitle="My professional journey and learning path"
                />

                <div className="max-w-3xl mx-auto">
                    {/* Experience Timeline - Left aligned */}
                    <div className="relative pl-8 md:pl-12">
                        {/* Timeline Line */}
                        <div className="absolute left-0 md:left-4 top-0 bottom-0 w-0.5 bg-border" />

                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.title}
                                className="relative mb-12 last:mb-0"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute -left-8 md:-left-8 top-2 w-4 h-4 bg-primary rounded-full border-4 border-background" />

                                <Card hover={false}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Briefcase size={18} className="text-primary" />
                                        <span className="text-sm text-primary font-medium">{exp.period}</span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-text-primary mb-1">
                                        {exp.title}
                                    </h3>
                                    <p className="text-text-secondary text-sm mb-4">{exp.company}</p>
                                    <p className="text-text-secondary mb-4">{exp.description}</p>

                                    <ul className="space-y-2">
                                        {exp.highlights.map((highlight, i) => (
                                            <li key={i} className="text-text-secondary text-sm flex items-start gap-3">
                                                <span className="mt-2 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Certifications */}
                    {/* {certifications.length > 0 && (
                        <motion.div
                            className="mt-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
                                Certifications
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {certifications.map((cert, index) => (
                                    <motion.div
                                        key={cert.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <Card className="flex items-center gap-4">
                                            <div className="p-3 rounded-lg bg-secondary/10 text-secondary shrink-0">
                                                <Award size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-text-primary">{cert.name}</h4>
                                                <p className="text-text-secondary text-sm">{cert.platform}</p>
                                                {cert.date && (
                                                    <p className="text-text-secondary text-xs mt-1">{cert.date}</p>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )} */}
                </div>
            </div>
        </section>
    );
}

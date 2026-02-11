import { motion } from 'framer-motion';
import { Calendar, Clock, Tag } from 'lucide-react';
import { SectionTitle } from './ui/SectionTitle';
import { Card } from './ui/Card';
import { experiences, /*certifications*/ } from '../data/experience';
import type { EmploymentType } from '../types';

const employmentTypeConfig: Record<EmploymentType, { label: string; color: string; bgColor: string }> = {
    'full-time': {
        label: 'Full-time',
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
    },
    'internship': {
        label: 'Internship',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
    },
    'contract': {
        label: 'Contract',
        color: 'text-amber-400',
        bgColor: 'bg-amber-400/10',
    },
    'freelance': {
        label: 'Freelance',
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/10',
    },
};

export function Experience() {
    return (
        <section id="experience" className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Experience"
                    subtitle="My professional journey and learning path"
                />

                <div className="max-w-4xl mx-auto">
                    {/* Experience Timeline */}
                    <div className="relative pl-8 md:pl-12">
                        {/* Timeline Line with animated gradient */}
                        <motion.div
                            className="absolute left-0 md:left-4 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-secondary to-primary/30"
                            initial={{ scaleY: 0, originY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />

                        {experiences.map((exp, index) => {
                            const empType = employmentTypeConfig[exp.employmentType];

                            return (
                                <motion.div
                                    key={`${exp.company}-${exp.title}`}
                                    className="relative mb-12 last:mb-0"
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, margin: "-50px" }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.15,
                                        ease: [0.25, 0.4, 0.25, 1]
                                    }}
                                >
                                    {/* Timeline Dot with pulse effect */}
                                    <motion.div
                                        className="absolute -left-8 md:-left-8 top-2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: false }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            delay: index * 0.1
                                        }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-primary"
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                                        />
                                    </motion.div>

                                    <Card className="relative overflow-hidden">
                                        {/* Status Badge */}
                                        <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
                                            <div className="flex items-center gap-4">
                                                {exp.logo ? (
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0 bg-white p-2">
                                                        <img
                                                            src={exp.logo}
                                                            alt={`${exp.company} logo`}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                ) : exp.companyInitial ? (
                                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20 shrink-0">
                                                        {exp.companyInitial}
                                                    </div>
                                                ) : null}
                                                <div>
                                                    <h3 className="text-xl font-bold text-text-primary">
                                                        {exp.title}
                                                    </h3>
                                                    <p className="text-primary font-medium">{exp.company}</p>
                                                </div>
                                            </div>

                                            <div className={`px-3 py-1 rounded-full ${empType.bgColor} border border-current text-xs font-semibold ${empType.color}`}>
                                                {empType.label}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mb-6 text-sm text-text-secondary">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={16} className="text-primary/70" />
                                                <span>{exp.period}</span>
                                            </div>
                                            {exp.duration && (
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={16} className="text-primary/70" />
                                                    <span>{exp.duration}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-text-secondary mb-8 leading-relaxed">
                                            {exp.description}
                                        </p>

                                        {/* Categorized Highlights */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            {exp.highlights.map((category, _catIndex) => (
                                                <div key={category.category}>
                                                    <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                        {category.category}
                                                    </h4>
                                                    <ul className="space-y-3">
                                                        {category.items.map((item, i) => (
                                                            <li key={i} className="text-text-secondary text-sm flex items-start gap-3">
                                                                <span className="mt-1.5 w-1 h-1 bg-border rounded-full shrink-0" />
                                                                <span className="leading-relaxed">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tech Stack Tags */}
                                        <div className="pt-6 border-t border-border/50">
                                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-text-secondary uppercase tracking-widest">
                                                <Tag size={12} className="text-primary" />
                                                Technologies Used
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {exp.techStack.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="px-2.5 py-1 rounded-md bg-surface border border-border text-text-primary text-xs font-medium hover:border-primary/50 transition-colors"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Certifications Section (Commented out as requested) */}
                    {/* 
                    <div className="mt-20">
                        <SectionTitle
                            title="Certifications"
                            subtitle="Continuous learning and professional validation"
                            align="center"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                            {certifications.map((cert, index) => (
                                <motion.div
                                    key={cert.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-text-primary">
                                                    {cert.name}
                                                </h3>
                                                <p className="text-primary font-medium">{cert.platform}</p>
                                            </div>
                                            {cert.date && (
                                                <div className="text-sm text-text-secondary flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    {cert.date}
                                                </div>
                                            )}
                                        </div>
                                        {cert.credentialUrl && (
                                            <div className="mt-auto pt-4">
                                                <a 
                                                    href={cert.credentialUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-light transition-colors font-semibold"
                                                >
                                                    View Credential
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        )}
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    */}
                </div>
            </div>
        </section>
    );
}

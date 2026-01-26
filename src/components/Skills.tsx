import { motion } from 'framer-motion';
import { Cloud, GitBranch, Box, Activity, Code, FileText } from 'lucide-react';
import { SectionTitle } from './ui/SectionTitle';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { skillCategories } from '../data/skills';

const iconMap: Record<string, React.ReactNode> = {
    Cloud: <Cloud size={24} />,
    GitBranch: <GitBranch size={24} />,
    Container: <Box size={24} />,
    Activity: <Activity size={24} />,
    Code: <Code size={24} />,
    File: <FileText size={24} />,
};

export function Skills() {
    return (
        <section id="skills" className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Skills"
                    subtitle="Technologies and areas I work with"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        {iconMap[category.icon] || <Code size={24} />}
                                    </div>
                                    <h3 className="text-lg font-semibold text-text-primary">
                                        {category.title}
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {category.skills.map((skill) => (
                                        <Badge key={skill.name} variant="default">
                                            {skill.name}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

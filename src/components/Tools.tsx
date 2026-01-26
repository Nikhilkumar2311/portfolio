import { motion } from 'framer-motion';
import { Cloud, GitBranch, Box, Activity, Settings, Layers, FileCode, BarChart3, FileText } from 'lucide-react';
import { SectionTitle } from './ui/SectionTitle';
import { tools } from '../data/tools';

const iconMap: Record<string, React.ReactNode> = {
    Cloud: <Cloud size={28} />,
    GitBranch: <GitBranch size={28} />,
    Container: <Box size={28} />,
    Activity: <Activity size={28} />,
    Settings: <Settings size={28} />,
    Layers: <Layers size={28} />,
    FileCode: <FileCode size={28} />,
    BarChart3: <BarChart3 size={28} />,
    File: <FileText size={28} />,
};

export function Tools() {
    return (
        <section id="tools" className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Tools"
                    subtitle="Technologies I have learned and use in my projects"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={tool.name}
                            className="group p-6 bg-surface rounded-xl border border-border hover:border-primary/50 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="p-3 rounded-lg bg-primary/10 text-primary inline-block mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                {iconMap[tool.icon] || <Settings size={28} />}
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2 font-mono">
                                {tool.name}
                            </h3>
                            <p className="text-text-secondary text-sm">
                                {tool.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

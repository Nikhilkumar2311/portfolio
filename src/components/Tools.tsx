import { motion } from 'framer-motion';
import { SectionTitle } from './ui/SectionTitle';
import { devOpsStack } from '../data/tools';

export function Tools() {
    return (
        <section id="tools" className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle
                    title="My DevOps Stack"
                    subtitle="The tools I use to build, deploy, and monitor applications"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {devOpsStack.map((group, index) => {
                        const Icon = group.icon;
                        return (
                            <motion.div
                                key={group.category}
                                className={`p-6 rounded-2xl border ${group.borderColor} ${group.bgColor} backdrop-blur-sm`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2.5 rounded-xl ${group.bgColor}`}>
                                        <Icon size={24} className={group.color} />
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-bold ${group.color}`}>
                                            {group.category}
                                        </h3>
                                    </div>
                                </div>

                                {/* Tools */}
                                <div className="flex flex-wrap gap-2">
                                    {group.tools.map((tool, i) => (
                                        <motion.span
                                            key={tool}
                                            className="px-3 py-1.5 rounded-full bg-surface border border-border text-text-primary text-sm font-medium hover:border-primary/50 transition-colors"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.2, delay: 0.3 + i * 0.03 }}
                                        >
                                            {tool}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

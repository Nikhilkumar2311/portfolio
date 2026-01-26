import { motion } from 'framer-motion';
import { SectionTitle } from './ui/SectionTitle';
import { skillTiers, type SkillTier } from '../data/skills';

function SkillBadge({ name, delay }: { name: string; delay: number }) {
    return (
        <motion.span
            className="px-4 py-2 rounded-full bg-surface border border-border text-text-primary text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay }}
            whileHover={{ scale: 1.05 }}
        >
            {name}
        </motion.span>
    );
}

function TierCard({ tier, index }: { tier: SkillTier; index: number }) {
    const Icon = tier.icon;

    return (
        <motion.div
            className={`relative p-6 rounded-2xl border ${tier.borderColor} ${tier.bgColor} backdrop-blur-sm`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
        >
            {/* Tier Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${tier.bgColor}`}>
                    <Icon size={24} className={tier.color} />
                </div>
                <div>
                    <h3 className={`text-lg font-bold ${tier.color}`}>
                        {tier.title}
                    </h3>
                    <p className="text-text-secondary text-sm">
                        {tier.subtitle}
                    </p>
                </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
                {tier.skills.map((skill, i) => (
                    <SkillBadge
                        key={skill.name}
                        name={skill.name}
                        delay={0.3 + i * 0.05}
                    />
                ))}
            </div>
        </motion.div>
    );
}

export function Skills() {
    return (
        <section id="skills" className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Skills"
                    subtitle="Technologies I work with, organized by experience level"
                />

                {/* Tier Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {skillTiers.map((tier, index) => (
                        <TierCard key={tier.title} tier={tier} index={index} />
                    ))}
                </div>

                {/* Quick glance for recruiters */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <p className="text-text-secondary text-sm">
                        <span className="text-orange-400 font-medium">●</span> Core = Production-ready
                        <span className="mx-3">|</span>
                        <span className="text-primary font-medium">●</span> Proficient = Strong skills
                        <span className="mx-3">|</span>
                        <span className="text-secondary font-medium">●</span> Learning = Actively growing
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

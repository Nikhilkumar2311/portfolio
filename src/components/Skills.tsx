import { motion } from 'framer-motion';
import { SectionTitle } from './ui/SectionTitle';
import { skillTiers, type SkillTier } from '../data/skills';

function SkillBadge({ name, delay }: { name: string; delay: number }) {
    return (
        <motion.span
            className="px-4 py-2 rounded-full bg-surface border border-border text-text-primary text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{
                duration: 0.4,
                delay,
                ease: [0.25, 0.4, 0.25, 1]
            }}
            whileHover={{
                scale: 1.08,
                y: -2,
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)"
            }}
        >
            {name}
        </motion.span>
    );
}

function TierCard({ tier, index }: { tier: SkillTier; index: number }) {
    const Icon = tier.icon;

    return (
        <motion.div
            className={`relative p-6 rounded-2xl border ${tier.borderColor} ${tier.bgColor} backdrop-blur-sm overflow-hidden`}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false }}
            transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.4, 0.25, 1]
            }}
            whileHover={{
                y: -4,
                transition: { duration: 0.2 }
            }}
        >
            {/* Subtle gradient overlay on hover */}
            <motion.div
                className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />

            {/* Tier Header */}
            <div className="relative flex items-center gap-3 mb-4">
                <motion.div
                    className={`p-2.5 rounded-xl ${tier.bgColor}`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Icon size={24} className={tier.color} />
                </motion.div>
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
            <div className="relative flex flex-wrap gap-2">
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
                    viewport={{ once: false }}
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

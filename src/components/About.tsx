import { motion } from "framer-motion";
import { SectionTitle } from "./ui/SectionTitle";
import { SpotlightCard } from "./ui/AceternityEffects";
import { Counter } from "./ui/ProfessionalEffects";
import { Rocket, Cloud, BarChart3, GitBranch, Laptop, Search, FolderGit2, type LucideIcon } from "lucide-react";

// Journey milestones for the timeline
const journeySteps: { title: string; description: string; icon: LucideIcon; color: string; bgColor: string }[] = [
  {
    title: "Full-Stack Developer",
    description: "Built web apps with frontend & backend",
    icon: Laptop,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    title: "Infrastructure Curious",
    description: "Explored deployment & scaling challenges",
    icon: Search,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    title: "DevOps Engineer",
    description: "Automating CI/CD & cloud infrastructure",
    icon: Rocket,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

// Value proposition cards - what you deliver
const valueCards = [
  {
    icon: GitBranch,
    title: "CI/CD Pipelines",
    description: "Automated testing & deployment workflows",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description: "AWS setup, security & scaling",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Rocket,
    title: "Automated Deployments",
    description: "Zero-downtime releases on every commit",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    icon: BarChart3,
    title: "Monitoring & Observability",
    description: "Metrics, alerts & log aggregation",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
];

export function About() {
  // Stats to display
  const stats = [
    {
      value: 10,
      label: "Projects Built",
      icon: FolderGit2,
      suffix: "+"
    },
    {
      value: 7,
      label: "AWS Services",
      icon: Cloud,
      suffix: ""
    },
    {
      value: 5,
      label: "Deployments",
      icon: Rocket,
      suffix: "+"
    },
  ];
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="About Me"
          subtitle="Building reliable, automated infrastructure that scales"
        />

        {/* Value Proposition Statement */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg text-text-secondary leading-relaxed">
            I build and maintain <span className="text-primary font-medium">automated CI/CD pipelines</span> and{" "}
            <span className="text-secondary font-medium">cloud infrastructure</span> using AWS.
            I bridge the gap between development and operations to help teams ship faster with confidence.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-surface/50 border border-border hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.1 }}
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl md:text-3xl font-bold text-text-primary">
                <Counter end={stat.value} duration={2} suffix={stat.suffix} />
              </div>
              <p className="text-text-secondary text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Journey Timeline */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-text-primary text-center mb-8">
            My Journey
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 justify-items-center gap-6 md:gap-8">
            {journeySteps.map((step, index) => (
              <motion.div
                key={step.title}
                className={`flex flex-col items-center text-center ${index === journeySteps.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
              >
                <div className={`w-16 h-16 rounded-full ${step.bgColor} border-2 border-border flex items-center justify-center mb-4 hover:border-primary transition-colors`}>
                  <step.icon size={28} className={step.color} />
                </div>
                <h4 className="text-text-primary font-semibold text-sm md:text-base mb-2">
                  {step.title}
                </h4>
                <p className="text-text-secondary text-xs md:text-sm leading-relaxed max-w-[160px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What I Deliver Cards */}
        <div>
          <h3 className="text-xl font-semibold text-text-primary text-center mb-8">
            What I Deliver
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {valueCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
              >
                <SpotlightCard className="h-full text-center">
                  <motion.div
                    className={`w-14 h-14 rounded-xl ${card.bgColor} flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <card.icon size={28} className={card.color} />
                  </motion.div>
                  <h4 className="text-text-primary font-semibold mb-2">
                    {card.title}
                  </h4>
                  <p className="text-text-secondary text-sm">
                    {card.description}
                  </p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Optional: Stats Row - Uncomment and customize if you want to add metrics */}
        {/* 
        <motion.div
          className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-text-secondary text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
        */}
      </div>
    </section>
  );
}

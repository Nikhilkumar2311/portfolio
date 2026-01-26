import { motion } from "framer-motion";
import { SectionTitle } from "./ui/SectionTitle";

export function About() {
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="About Me"
          subtitle="My journey from full-stack development to DevOps Cloud Engineering"
        />

        <div className="max-w-3xl mx-auto">
          <motion.div
            className="space-y-6 text-text-secondary text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p>
              I started my journey as a full-stack developer, working on
              building and deploying web applications. This experience gave me a
              solid foundation in both frontend and backend technologies.
            </p>
            <p>
              While working on real projects, I became more interested in how
              systems are deployed, automated, and maintained in production. The
              challenges of deployment and scaling sparked my curiosity about
              infrastructure and operations.
            </p>
            <p>
              This interest led me to transition into DevOps, where I now focus
              on CI/CD pipelines, cloud infrastructure, and improving system
              reliability. I enjoy bridging the gap between development and
              operations to deliver software more efficiently.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

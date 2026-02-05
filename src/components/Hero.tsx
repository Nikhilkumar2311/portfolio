import { motion, useScroll, useTransform } from "framer-motion";
import { Download, FolderGit2 } from "lucide-react";
import { Button } from "./ui/Button";
import { TextReveal } from "./ui/AceternityEffects";
import { Typewriter, DotGrid } from "./ui/ProfessionalEffects";
import { useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
    >
      {/* Subtle dot grid background */}
      <DotGrid className="opacity-20" />

      {/* Parallax Background Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        {/* Floating gradient orbs */}
        <motion.div
          className="absolute top-20 left-[10%] w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10"
        style={{ y: textY, opacity }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            className="text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Name with Text Reveal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-4">
              <TextReveal text="Nikhil Kumar" delay={0.2} />
            </h1>

            {/* Role with typewriter effect */}
            <motion.div
              className="text-xl sm:text-2xl font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Typewriter
                words={["DevOps Cloud Engineer", "CI/CD", "Cloud Architect", "AWS", "Full Stack Developer"]}
                className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                typingSpeed={80}
                deletingSpeed={40}
                delayBetweenWords={3000}
              />
            </motion.div>

            {/* Description */}
            <motion.div
              className="text-text-secondary text-lg leading-relaxed mb-8 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <p>Focused on automation, CI/CD, and cloud infrastructure.</p>
              <p>Building reliable systems that scale.</p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <Button variant="primary" href="#projects">
                <FolderGit2 size={20} />
                View Projects
              </Button>
              <Button variant="outline" href="/resume.pdf">
                <Download size={20} />
                Download Resume
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Side - Profile Image */}
          <motion.div
            className="flex justify-center items-center order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
              {/* Ambient glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/30 rounded-2xl blur-2xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />

              {/* Gradient border container */}
              <motion.div
                className="relative w-full h-full p-0.5 rounded-2xl bg-gradient-to-br from-primary via-primary/50 to-secondary"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Inner container with image */}
                <div className="relative w-full h-full rounded-2xl bg-surface overflow-hidden">
                  <img
                    src="/profile.jpg"
                    alt="Nikhil Kumar - DevOps Cloud Engineer"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
                </div>
              </motion.div>

              {/* Floating accent elements */}
              <motion.div
                className="absolute -top-3 -right-3 w-14 h-14 rounded-lg border-2 border-primary/60 bg-primary/10 backdrop-blur-sm"
                animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-3 -left-3 w-10 h-10 rounded-full border-2 border-secondary/60 bg-secondary/10 backdrop-blur-sm"
                animate={{ y: [0, 8, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-8 -left-6 w-3 h-3 rounded-full bg-primary/60"
                animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-8 -right-6 w-2 h-2 rounded-full bg-secondary/60"
                animate={{ y: [0, 12, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div >

    </section >
  );
}


import { motion } from "framer-motion";
import { Download, FolderGit2 } from "lucide-react";
import { Button } from "./ui/Button";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content (order-2 on mobile to appear below image) */}
          <motion.div
            className="text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-4">
              Nikhil Kumar
            </h1>

            {/* Role */}
            <motion.p
              className="text-xl sm:text-2xl text-primary font-medium mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              DevOps Cloud Engineer
            </motion.p>

            {/* Description - 3 lines */}
            <motion.div
              className="text-text-secondary text-lg leading-relaxed mb-8 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p>Focused on automation, CI/CD, and cloud infrastructure.</p>
              <p>Building reliable systems that scale.</p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
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

          {/* Right Side - Profile Image (order-1 on mobile to appear above content) */}
          <motion.div
            className="flex justify-center items-center order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
              {/* Ambient glow effect */}
              <motion.div
                className="absolute inset-0 bg-linear-to-br from-primary/30 via-primary/10 to-secondary/30 rounded-2xl blur-2xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />

              {/* Gradient border container */}
              <div className="relative w-full h-full p-0.5 rounded-2xl bg-linear-to-br from-primary via-primary/50 to-secondary">
                {/* Inner container with image */}
                <div className="relative w-full h-full rounded-2xl bg-surface overflow-hidden">
                  <img
                    src="/profile.jpg"
                    alt="Nikhil Kumar - DevOps Cloud Engineer"
                    className="w-full h-full object-cover"
                  />

                  {/* Subtle overlay gradient for depth */}
                  <div className="absolute inset-0 bg-linear-to-t from-background/20 via-transparent to-transparent" />
                </div>
              </div>

              {/* Corner accent - top right */}
              <motion.div
                className="absolute -top-3 -right-3 w-14 h-14 rounded-lg border-2 border-primary/60 bg-primary/10 backdrop-blur-sm"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              />

              {/* Corner accent - bottom left */}
              <motion.div
                className="absolute -bottom-3 -left-3 w-10 h-10 rounded-full border-2 border-secondary/60 bg-secondary/10 backdrop-blur-sm"
                animate={{
                  y: [0, 8, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
              />

              {/* Small floating dot - top left */}
              <motion.div
                className="absolute top-8 -left-6 w-3 h-3 rounded-full bg-primary/60"
                animate={{
                  y: [0, -12, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              />

              {/* Small floating dot - bottom right */}
              <motion.div
                className="absolute bottom-8 -right-6 w-2 h-2 rounded-full bg-secondary/60"
                animate={{
                  y: [0, 12, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

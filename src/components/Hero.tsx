import { motion } from "framer-motion";
import { Download, FolderGit2 } from "lucide-react";
import { Button } from "./ui/Button";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            className="text-left"
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
              className="flex flex-col sm:flex-row items-start gap-4"
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

          {/* Right Side - Image Placeholder */}
          <motion.div
            className="hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative w-80 h-80 xl:w-96 xl:h-96">
              {/* Decorative background shapes */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />

              {/* Image placeholder */}
              <div className="relative w-full h-full rounded-2xl border-2 border-dashed border-border bg-surface/50 flex items-center justify-center overflow-hidden">
                <div className="text-center p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">NK</span>
                  </div>
                  <p className="text-text-secondary text-sm">Profile Image</p>
                </div>
              </div>

              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary/20 rounded-full"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

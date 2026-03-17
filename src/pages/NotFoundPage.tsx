import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { SEOHead } from "../components/SEOHead";

export function NotFoundPage() {
    return (
        <>
            <SEOHead
                title="404 - Page Not Found | Nikhil Kumar"
                description="The page you are looking for does not exist or has been moved."
            />
            <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden pt-16 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 w-full">

                    {/* Left Side - Text Content */}
                    <motion.div
                        className="text-center lg:text-left order-2 lg:order-1"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-7xl sm:text-8xl md:text-9xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                            404
                        </h2>
                        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
                            Node Not Found
                        </h2>

                        <div className="text-text-secondary text-lg leading-relaxed mb-8 space-y-2">
                            <p>Looks like this pod was evicted or the route doesn't exist.</p>
                            <p>Let's get you back to the main cluster.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Button variant="primary" href="/">
                                <Home size={20} />
                                Back to Home
                            </Button>
                            <Button variant="outline" onClick={() => window.history.back()}>
                                <ArrowLeft size={20} />
                                Go Back
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right Side - Image */}
                    <motion.div
                        className="flex justify-center items-center order-1 lg:order-2"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-[16/9]">
                            {/* Ambient glow effect */}
                            <motion.div
                                className="absolute inset-0 bg-linear-to-br from-primary/30 via-primary/10 to-secondary/30 rounded-2xl blur-3xl"
                                animate={{
                                    opacity: [0.5, 0.8, 0.5],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            />

                            {/* Image Container with gradient border */}
                            <motion.div
                                className="relative w-full h-full p-0.5 rounded-2xl bg-linear-to-br from-primary via-primary/50 to-secondary"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative w-full h-full rounded-2xl bg-surface overflow-hidden">
                                    <img
                                        src="/404.webp"
                                        alt="404 - Page Not Found Illustration"
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                        fetchPriority="high"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-background/20 via-transparent to-transparent" />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { SectionTitle } from './ui/SectionTitle';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const socialLinks = [
    {
        name: 'Email',
        url: 'mailto:nk4873300@gmail.com',
        icon: Mail,
        label: 'nk4873300@gmail.com',
        copyable: true,
        copyValue: 'nk4873300@gmail.com',
        color: 'text-red-400',
        bgColor: 'bg-red-400/10',
        hoverBgColor: 'group-hover:bg-red-400',
    },
    {
        name: 'GitHub',
        url: 'https://github.com/Nikhilkumar2311',
        icon: Github,
        label: 'github.com/Nikhilkumar2311',
        copyable: false,
        color: 'text-gray-400',
        bgColor: 'bg-gray-400/10',
        hoverBgColor: 'group-hover:bg-gray-400',
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/nikhilkumar0908/',
        icon: Linkedin,
        label: 'linkedin.com/in/nikhilkumar0908',
        copyable: false,
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        hoverBgColor: 'group-hover:bg-blue-400',
    },
];

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopyEmail = async (e: React.MouseEvent, value: string) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(value);
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
                    ...formData,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                // Reset status after 5 seconds
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setErrorMessage(result.message || 'Something went wrong. Please try again.');
            }
        } catch {
            setStatus('error');
            setErrorMessage('Network error. Please check your connection and try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionTitle
                    title="Get In Touch"
                    subtitle="Have a question or want to work together? Feel free to reach out."
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Links */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col"
                    >
                        {/* Availability Badge */}
                        <motion.div
                            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-full w-fit"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                            </span>
                            <span className="text-green-400 text-sm font-medium">Available for opportunities</span>
                        </motion.div>

                        <h3 className="text-xl font-semibold text-text-primary mb-6">
                            Connect with me
                        </h3>

                        <div className="space-y-4 flex-1">
                            {socialLinks.map((link, index) => (
                                link.copyable ? (
                                    <motion.div
                                        key={link.name}
                                        onClick={(e) => handleCopyEmail(e, link.copyValue!)}
                                        className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group relative cursor-pointer"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        whileHover={{ x: 8, scale: 1.02 }}
                                    >
                                        <div className={`p-3 rounded-xl ${link.bgColor} ${link.color} ${link.hoverBgColor} group-hover:text-white transition-all duration-300 group-hover:scale-110`}>
                                            <link.icon size={22} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-text-primary font-semibold">{link.name}</p>
                                            <AnimatePresence mode="wait">
                                                {copiedEmail ? (
                                                    <motion.p
                                                        key="copied"
                                                        className="text-green-400 text-sm font-medium"
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                    >
                                                        Copied to clipboard!
                                                    </motion.p>
                                                ) : (
                                                    <motion.p
                                                        key="label"
                                                        className="text-text-secondary text-sm"
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                    >
                                                        {link.label}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group relative"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        whileHover={{ x: 8, scale: 1.02 }}
                                    >
                                        <div className={`p-3 rounded-xl ${link.bgColor} ${link.color} ${link.hoverBgColor} group-hover:text-white transition-all duration-300 group-hover:scale-110`}>
                                            <link.icon size={22} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-text-primary font-semibold">{link.name}</p>
                                            <p className="text-text-secondary text-sm">{link.label}</p>
                                        </div>
                                    </motion.a>
                                )
                            ))}
                        </div>

                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card hover={false} className="relative overflow-hidden border-primary/20 hover:border-primary/40 transition-colors">
                            {/* Subtle glow effect */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                            <h3 className="text-xl font-semibold text-text-primary mb-6 relative z-10">
                                Send a message
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <div>
                                    <label htmlFor="name" className="block text-text-secondary text-sm mb-2 font-medium">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-text-secondary text-sm mb-2 font-medium">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-text-secondary text-sm mb-2 font-medium">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 resize-none"
                                        placeholder="Your message..."
                                        required
                                    />
                                </div>

                                {/* Status Messages */}
                                <AnimatePresence>
                                    {status === 'success' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400"
                                        >
                                            <CheckCircle size={20} />
                                            <span className="font-medium">Message sent successfully! I'll get back to you soon.</span>
                                        </motion.div>
                                    )}
                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400"
                                        >
                                            <XCircle size={20} />
                                            <span className="font-medium">{errorMessage}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Button
                                    variant="primary"
                                    className="w-full py-3.5 text-base font-semibold"
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

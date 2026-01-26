import { useState } from 'react';
import { motion } from 'framer-motion';
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
    },
    {
        name: 'GitHub',
        url: 'https://github.com/Nikhilkumar2311',
        icon: Github,
        label: 'github.com/Nikhilkumar2311',
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/nikhilkumar0908/',
        icon: Linkedin,
        label: 'linkedin.com/in/nikhilkumar0908',
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
        <section id="contact" className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Get In Touch"
                    subtitle="Have a question or want to work together? Feel free to reach out."
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {/* Contact Links */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-xl font-semibold text-text-primary mb-6">
                            Connect with me
                        </h3>
                        <div className="space-y-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target={link.url.startsWith('mailto') ? undefined : '_blank'}
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-border hover:border-primary/50 transition-all duration-300 group"
                                >
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <link.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-text-primary font-medium">{link.name}</p>
                                        <p className="text-text-secondary text-sm">{link.label}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form (UI Only) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card hover={false}>
                            <h3 className="text-xl font-semibold text-text-primary mb-6">
                                Send a message
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-text-secondary text-sm mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-text-secondary text-sm mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-text-secondary text-sm mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none transition-colors resize-none"
                                        placeholder="Your message..."
                                    />
                                </div>

                                {/* Status Messages */}
                                {status === 'success' && (
                                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                                        <CheckCircle size={18} />
                                        <span>Message sent successfully! I'll get back to you soon.</span>
                                    </div>
                                )}
                                {status === 'error' && (
                                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                                        <XCircle size={18} />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <Button
                                    variant="primary"
                                    className="w-full"
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
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

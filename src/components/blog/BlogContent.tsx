import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface BlogContentProps {
    content: string;
}

/**
 * Generate ID from heading text for anchor links
 */
function generateId(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
}

export function BlogContent({ content }: BlogContentProps) {
    return (
        <article className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Custom heading styles with IDs for TOC navigation
                    h1: ({ children }) => {
                        const text = String(children);
                        const id = generateId(text);
                        return (
                            <h1 id={id} className="text-3xl md:text-4xl font-bold text-text-primary mt-8 mb-4 scroll-mt-24">
                                {children}
                            </h1>
                        );
                    },
                    h2: ({ children }) => {
                        const text = String(children);
                        const id = generateId(text);
                        return (
                            <h2 id={id} className="text-2xl md:text-3xl font-bold text-text-primary mt-8 mb-4 pb-2 border-b border-border scroll-mt-24">
                                {children}
                            </h2>
                        );
                    },
                    h3: ({ children }) => {
                        const text = String(children);
                        const id = generateId(text);
                        return (
                            <h3 id={id} className="text-xl md:text-2xl font-semibold text-text-primary mt-6 mb-3 scroll-mt-24">
                                {children}
                            </h3>
                        );
                    },
                    h4: ({ children }) => {
                        const text = String(children);
                        const id = generateId(text);
                        return (
                            <h4 id={id} className="text-lg font-semibold text-text-primary mt-4 mb-2 scroll-mt-24">
                                {children}
                            </h4>
                        );
                    },
                    // Paragraphs
                    p: ({ children }) => (
                        <p className="text-text-secondary leading-relaxed mb-4">
                            {children}
                        </p>
                    ),
                    // Links
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-hover underline underline-offset-2 transition-colors"
                        >
                            {children}
                        </a>
                    ),
                    // Lists
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-2 mb-4 text-text-secondary">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-2 mb-4 text-text-secondary">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-text-secondary">
                            {children}
                        </li>
                    ),
                    // Blockquotes
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 rounded-r-lg">
                            {children}
                        </blockquote>
                    ),
                    // Inline code
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;

                        if (isInline) {
                            return (
                                <code
                                    className="px-1.5 py-0.5 rounded bg-surface border border-border text-primary text-sm font-mono"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-xl !bg-surface border border-border !my-4"
                                customStyle={{
                                    padding: '1.25rem',
                                    fontSize: '0.875rem',
                                }}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        );
                    },
                    // Pre for code blocks (handled by code component)
                    pre: ({ children }) => <>{children}</>,
                    // Horizontal rule
                    hr: () => <hr className="border-border my-8" />,
                    // Strong/bold
                    strong: ({ children }) => (
                        <strong className="font-semibold text-text-primary">{children}</strong>
                    ),
                    // Emphasis/italic
                    em: ({ children }) => (
                        <em className="italic text-text-primary">{children}</em>
                    ),
                    // Tables
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                            <table className="w-full border-collapse border border-border rounded-lg">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="border border-border bg-surface px-4 py-2 text-left text-text-primary font-semibold">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-border px-4 py-2 text-text-secondary">
                            {children}
                        </td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}

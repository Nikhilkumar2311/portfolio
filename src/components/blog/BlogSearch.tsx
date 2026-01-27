import { Search, X } from 'lucide-react';

interface BlogSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function BlogSearch({ value, onChange }: BlogSearchProps) {
    return (
        <div className="relative max-w-md w-full">
            <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
                type="text"
                placeholder="Search blogs..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-border transition-colors"
                    aria-label="Clear search"
                >
                    <X size={16} className="text-text-secondary" />
                </button>
            )}
        </div>
    );
}

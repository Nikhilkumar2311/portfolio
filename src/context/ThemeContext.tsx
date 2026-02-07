import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement;
        if (newTheme === 'light') {
            root.classList.add('light');
        } else {
            root.classList.remove('light');
        }
    };

    const updateFavicon = (currentTheme: Theme) => {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
            link.href = currentTheme === 'light' ? '/Sdlogo.png' : '/slogo.png';
        }
    };

    const updateThemeColor = (currentTheme: Theme) => {
        const metaThemeColor = document.querySelector("meta[name='theme-color']");
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', currentTheme === 'light' ? '#FFFFFF' : '#0B0F19');
        }
    };

    // Initialize theme from localStorage or default to dark
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
            updateFavicon(savedTheme);
            updateThemeColor(savedTheme);
        } else {
            // Default to light mode
            setTheme('light');
            applyTheme('light');
            updateFavicon('light');
            updateThemeColor('light');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        updateFavicon(newTheme);
        updateThemeColor(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

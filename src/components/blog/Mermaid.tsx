import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../../context/ThemeContext';

interface MermaidProps {
    chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svgContent, setSvgContent] = useState<string>('');
    const idRef = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`);
    const { theme } = useTheme();

    useEffect(() => {
        const isDark = theme === 'dark';
        
        mermaid.initialize({
            startOnLoad: false,
            theme: isDark ? 'dark' : 'default',
            fontFamily: 'inherit',
            themeVariables: isDark ? {
                primaryColor: '#2d3748',
                primaryTextColor: '#f7fafc',
                primaryBorderColor: '#4a5568',
                lineColor: '#a0aec0',
                secondaryColor: '#4a5568',
                tertiaryColor: '#1a202c',
            } : {
                primaryColor: '#f7fafc',
                primaryTextColor: '#1a202c',
                primaryBorderColor: '#cbd5e0',
                lineColor: '#4a5568',
                secondaryColor: '#edf2f7',
                tertiaryColor: '#ffffff',
            }
        });

        const renderChart = async () => {
            try {
                // Generate a new ID on theme change to prevent mermaid caching the old theme colors
                const newId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
                idRef.current = newId;
                
                const { svg } = await mermaid.render(newId, chart);
                setSvgContent(svg);
            } catch (error) {
                console.error("Failed to render mermaid chart", error);
                setSvgContent(`<div class="text-red-500">Failed to render flowchart</div>`);
            }
        };

        renderChart();
    }, [chart, theme]);

    return (
        <div
            ref={containerRef}
            className="flex justify-center my-8 p-6 bg-surface border border-border rounded-xl overflow-x-auto w-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
}

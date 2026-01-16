import { useEffect, useRef, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

interface ParticleNetworkProps {
    particleCount?: number;
    connectionDistance?: number;
    particleColor?: string;
    lineColor?: string;
    speed?: number;
}

export function ParticleNetwork({
    particleCount = 80,
    connectionDistance = 150,
    particleColor = 'rgba(99, 102, 241, 0.8)',
    lineColor = 'rgba(99, 102, 241, 0.15)',
    speed = 0.3,
}: ParticleNetworkProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animationIdRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    // Initialize particles
    const initParticles = useCallback((width: number, height: number) => {
        // Reduce particles on mobile for better performance
        const isMobile = width < 768;
        const count = isMobile ? Math.floor(particleCount * 0.5) : particleCount;

        const particles: Particle[] = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                radius: Math.random() * 2 + 1,
            });
        }
        particlesRef.current = particles;
    }, [particleCount, speed]);

    // Animation loop with throttling
    const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, timestamp: number) => {
        // Throttle to ~30fps for better performance
        if (timestamp - lastTimeRef.current < 33) {
            animationIdRef.current = requestAnimationFrame((t) => animate(ctx, width, height, t));
            return;
        }
        lastTimeRef.current = timestamp;

        ctx.clearRect(0, 0, width, height);

        const particles = particlesRef.current;
        const mouse = mouseRef.current;

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Keep in bounds
            p.x = Math.max(0, Math.min(width, p.x));
            p.y = Math.max(0, Math.min(height, p.y));

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();

            // Draw connections to nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const opacity = 1 - dist / connectionDistance;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = lineColor.replace('0.15', String(0.15 * opacity));
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Draw connection to mouse if close enough
            const mouseDx = p.x - mouse.x;
            const mouseDy = p.y - mouse.y;
            const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

            if (mouseDist < connectionDistance * 1.5) {
                const opacity = 1 - mouseDist / (connectionDistance * 1.5);
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 * opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        animationIdRef.current = requestAnimationFrame((t) => animate(ctx, width, height, t));
    }, [particleColor, lineColor, connectionDistance]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const handleResize = () => {
            const dpr = Math.min(window.devicePixelRatio, 2); // Cap DPR for performance
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
            initParticles(window.innerWidth, window.innerHeight);
        };

        // Track mouse position
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // Start animation
        animationIdRef.current = requestAnimationFrame((t) =>
            animate(ctx, window.innerWidth, window.innerHeight, t)
        );

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationIdRef.current);
        };
    }, [initParticles, animate]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{
                background: 'transparent',
                willChange: 'transform',
            }}
            aria-hidden="true"
        />
    );
}

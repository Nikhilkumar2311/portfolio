import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SmoothScrollProvider, useSmoothScroll } from '../components/providers/SmoothScrollProvider';

function LayoutContent() {
    const location = useLocation();
    const { scrollTo } = useSmoothScroll();

    // Scroll to top on route change (for non-hash routes)
    useEffect(() => {
        if (!location.hash) {
            scrollTo(0, { duration: 0 });
        }
    }, [location.pathname, scrollTo]);

    return (
        <>
            <Navbar />
            <main className="relative">
                {/* Global background gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

                {/* Page content via Outlet */}
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export function Layout() {
    return (
        <SmoothScrollProvider>
            <LayoutContent />
        </SmoothScrollProvider>
    );
}

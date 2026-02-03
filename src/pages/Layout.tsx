import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function Layout() {
    const location = useLocation();

    // Scroll to top on route change (for non-hash routes)
    useEffect(() => {
        if (!location.hash) {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [location.pathname]);

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

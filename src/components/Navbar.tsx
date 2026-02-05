import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { useSmoothScroll } from "./providers/SmoothScrollProvider";

interface NavItem {
  label: string;
  href: string;
  isRoute?: boolean;
}

const navLinks: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Tools", href: "#tools" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
  { label: "Blogs", href: "/blog", isRoute: true },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { theme } = useTheme();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle navigation for hash links with smooth scroll
  const handleNavClick = (e: React.MouseEvent, href: string, isRoute?: boolean) => {
    setIsMobileMenuOpen(false);

    if (isRoute) return; // Let React Router handle route links

    if (isHomePage && href.startsWith("#")) {
      e.preventDefault();
      // Use Lenis smooth scroll for same-page navigation
      scrollTo(href, { offset: -80, duration: 1.2 });
    } else if (!isHomePage && href.startsWith("#")) {
      // Navigate to home page with hash (Lenis will handle after load)
      window.location.href = "/" + href;
    }
  };

  return (
    <motion.header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${isScrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"}
      `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={theme === 'light' ? "/logoD.png" : "/logo.png"}
              alt="NK"
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `text-base font-medium transition-colors ${isActive
                      ? "text-primary"
                      : "text-text-secondary hover:text-primary"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ) : (
                <Link
                  key={link.href}
                  to={isHomePage ? link.href : "/" + link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.isRoute)}
                  className="text-text-secondary hover:text-primary transition-colors text-base font-medium"
                >
                  {link.label}
                </Link>
              )
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button - shows on mobile only */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              className="text-text-primary p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-surface border border-border rounded-lg mt-2 p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) =>
                  link.isRoute ? (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      className={({ isActive }) =>
                        `block py-3 transition-colors ${isActive
                          ? "text-primary"
                          : "text-text-secondary hover:text-primary"
                        }`
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  ) : (
                    <Link
                      key={link.href}
                      to={isHomePage ? link.href : "/" + link.href}
                      className="block py-3 text-text-secondary hover:text-primary transition-colors"
                      onClick={(e) => handleNavClick(e, link.href, link.isRoute)}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

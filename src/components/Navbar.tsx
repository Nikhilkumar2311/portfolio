import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  isRoute?: boolean;
}

const navLinks: NavItem[] = [
  { label: "Blog", href: "/blog", isRoute: true },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Tools", href: "#tools" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle navigation for hash links when not on home page
  const handleNavClick = (href: string, isRoute?: boolean) => {
    setIsMobileMenuOpen(false);

    if (isRoute) return; // Let React Router handle route links

    if (!isHomePage && href.startsWith("#")) {
      // Navigate to home page with hash
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
            <img src="/logo.png" alt="NK" className="h-12 w-auto" />
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
                  onClick={() => handleNavClick(link.href, link.isRoute)}
                  className="text-text-secondary hover:text-primary transition-colors text-base font-medium"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-primary p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
                  <a
                    key={link.href}
                    href={isHomePage ? link.href : "/" + link.href}
                    className="block py-3 text-text-secondary hover:text-primary transition-colors"
                    onClick={() => handleNavClick(link.href, link.isRoute)}
                  >
                    {link.label}
                  </a>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

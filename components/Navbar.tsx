import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      // Use setTimeout to allow render to switch back to home before scrolling
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Vision", href: "#vision", type: "scroll" },
    { name: "Mission", href: "#mission", type: "scroll" },
    { name: "Team", href: "#team", type: "scroll" },
    { name: "Careers", href: "/careers", type: "route" },
    { name: "Contact", href: "#footer", type: "scroll" },
  ];

  // Logic to determine navbar appearance based on route
  const isTeamView = location.pathname === "/team";
  const navClasses = scrolled
    ? "bg-white/80 backdrop-blur-md py-3 md:py-4 border-b border-neutral-200"
    : isTeamView
    ? "bg-transparent py-4 md:py-6 text-white"
    : "bg-transparent py-4 md:py-6";

  const logoClasses =
    isTeamView && !scrolled ? "text-white" : "text-cenit-blue";
  const logoSubClasses =
    isTeamView && !scrolled ? "text-white/60" : "text-neutral-600";
  const menuIconColor =
    isTeamView && !scrolled ? "text-white" : "text-neutral-900";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClasses}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo Construction */}
          <Link to="/" className="relative group z-50 text-left">
            <div className="flex flex-col items-end leading-none">
              <span
                className={`text-3xl font-bold tracking-tight group-hover:text-cenit-light transition-colors ${logoClasses}`}
              >
                Cénit
              </span>
              <span
                className={`text-sm font-medium -mt-1 tracking-wide group-hover:text-cenit-blue transition-colors ${logoSubClasses}`}
              >
                labs
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) =>
              link.type === "route" ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium hover:text-cenit-blue transition-colors uppercase tracking-widest cursor-pointer ${
                    isTeamView && !scrolled
                      ? "text-white/80 hover:text-white"
                      : "text-neutral-600"
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`text-sm font-medium hover:text-cenit-blue transition-colors uppercase tracking-widest cursor-pointer ${
                    isTeamView && !scrolled
                      ? "text-white/80 hover:text-white"
                      : "text-neutral-600"
                  }`}
                >
                  {link.name}
                </a>
              )
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden z-50 relative ${menuIconColor}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-neutral-900" />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white flex flex-col justify-center items-center gap-8 transition-transform duration-500 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {navLinks.map((link) =>
          link.type === "route" ? (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl font-serif italic text-neutral-900 hover:text-cenit-blue transition-colors"
            >
              {link.name}
            </Link>
          ) : (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="text-3xl font-serif italic text-neutral-900 hover:text-cenit-blue transition-colors"
            >
              {link.name}
            </a>
          )
        )}
      </div>
    </>
  );
};

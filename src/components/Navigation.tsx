import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const sections = [
  { id: "home", label: "Home" },
  { id: "terrain", label: "Terrain" },
  { id: "theme-open", label: "Open / Gated" },
  { id: "theme-commerce", label: "Commercial Synergy" },
  { id: "theme-walk", label: "Walk-Life" },
  { id: "theme-spectrum", label: "Appropriation" },
  { id: "theme-future", label: "Urban Futures" }
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      let current = "home";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.25) {
            current = section.id;
            break;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection("home")}
            className="font-serif text-xl md:text-2xl text-primary hover:text-primary/80 transition-colors"
          >
            Yelahanka Narratives
          </button>
          
          <div className="hidden lg:flex items-center gap-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`font-sans text-xs uppercase tracking-[0.35em] transition-colors relative group ${
                  activeSection === section.id ? "text-primary" : "text-foreground/60 hover:text-primary"
                }`}
              >
                {section.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    activeSection === section.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

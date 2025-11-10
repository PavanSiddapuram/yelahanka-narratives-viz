import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const sections = [
  { id: "home", label: "Home" },
  { id: "open-gated", label: "Open / Gated" },
  { id: "commercial-proximity", label: "Commercial Proximity" },
  { id: "walk-life", label: "Walk-Life Inventory" },
  { id: "spectrum", label: "Spectrum of Appropriation" },
  { id: "setting", label: "Setting & Materiality" },
  { id: "urban-futures", label: "Urban Futures" },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
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
            {sections.slice(1).map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="font-sans text-sm text-foreground/70 hover:text-primary transition-colors relative group"
              >
                {section.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

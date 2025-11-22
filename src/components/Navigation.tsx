import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "commercial-proximity", label: "Commercial Proximity" },
  { id: "setting-materiality", label: "Setting & Materiality" },
  { id: "planned", label: "Planned / \"Planned\"" },
  { id: "open-gated", label: "Open / Gated" },
  { id: "urban-futures", label: "Urban Futures" },
  { id: "spectrum", label: "Spectrum of Appropriation" },
  { id: "walk-life", label: "Walk-Life Inventory" },
];

export const Navigation = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((section) =>
        document.getElementById(section.id)
      );

      const currentSection = sectionElements.find((element) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/30 shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <motion.h1 
              className="font-serif text-2xl text-primary tracking-wide"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Yelahanka New Town
            </motion.h1>
            
            <div className="hidden lg:flex gap-8">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`text-sm tracking-wide transition-all duration-300 relative ${
                    activeSection === section.id
                      ? "text-primary font-medium"
                      : "text-foreground/60 hover:text-primary"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {section.label}
                  {activeSection === section.id && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeSection"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-secondary/50 rounded-md transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-exhibit-deep/90 backdrop-blur-md"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              className="absolute top-20 left-0 right-0 bg-card/95 backdrop-blur-md mx-4 rounded-lg shadow-2xl border border-border/50 p-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex flex-col gap-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`text-left px-4 py-3 rounded-md transition-all ${
                      activeSection === section.id
                        ? "text-primary bg-primary/10 font-medium"
                        : "text-foreground/70 hover:text-primary hover:bg-secondary/50"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

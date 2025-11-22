import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ExhibitSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  isDark?: boolean;
}

export const ExhibitSection = ({ id, title, children, isDark = false }: ExhibitSectionProps) => {
  return (
    <motion.section
      id={id}
      className={`min-h-screen py-24 px-6 md:px-16 lg:px-24 textured-bg ${isDark ? 'bg-exhibit-deep text-foreground' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="exhibit-heading text-4xl md:text-5xl lg:text-6xl mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

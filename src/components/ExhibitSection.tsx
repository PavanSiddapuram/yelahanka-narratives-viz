import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ExhibitSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export const ExhibitSection = ({ id, title, children, className = "" }: ExhibitSectionProps) => {
  return (
    <motion.section
      id={id}
      className={`min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 md:px-12 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full max-w-7xl"
        initial={{ y: 30 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h1 className="exhibit-heading text-4xl md:text-5xl lg:text-6xl mb-12 text-center">
          {title}
        </h1>
        <div className="bg-card rounded-sm shadow-[var(--shadow-elegant)] p-8 md:p-12">
          {children}
        </div>
      </motion.div>
    </motion.section>
  );
};

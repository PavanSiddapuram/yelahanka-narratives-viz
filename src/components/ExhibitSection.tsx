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
      className={`relative min-h-screen py-24 px-6 md:px-16 lg:px-24 textured-bg overflow-hidden ${isDark ? 'bg-exhibit-deep text-foreground' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Decorative floating wires */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <motion.path
          d="M 0 100 Q 200 50, 400 100 T 800 100"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 0 200 Q 300 150, 600 200 T 1200 200"
          stroke="hsl(var(--accent))"
          strokeWidth="0.5"
          fill="none"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, delay: 0.2, ease: "easeInOut" }}
        />
      </svg>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div className="relative inline-block mb-16 w-full">
          <motion.h2 
            className="exhibit-heading text-4xl md:text-5xl lg:text-6xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h2>
          
          {/* Animated underline */}
          <motion.div 
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "60%", opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          
          {/* Corner accents */}
          <motion.svg 
            className="absolute -top-8 -left-4 w-16 h-16 opacity-30"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.3, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            <path d="M 0 16 L 0 0 L 16 0" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" />
          </motion.svg>
          <motion.svg 
            className="absolute -top-8 -right-4 w-16 h-16 opacity-30"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.3, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            <path d="M 16 16 L 16 0 L 0 0" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" />
          </motion.svg>
        </motion.div>
        
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

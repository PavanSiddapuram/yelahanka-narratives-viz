import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  image?: string;
}

interface InteractiveMapProps {
  imageUrl: string;
  hotspots: Hotspot[];
  alt: string;
}

export const InteractiveMap = ({ imageUrl, hotspots, alt }: InteractiveMapProps) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-md">
      <img src={imageUrl} alt={alt} className="w-full h-auto" />
      
      {hotspots.map((hotspot) => (
        <motion.button
          key={hotspot.id}
          className="absolute interactive-hotspot border-2 border-background/80 flex items-center justify-center group"
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, hsl(var(--exhibit-glow)) 0%, hsl(var(--primary)) 100%)',
          }}
          onClick={() => setSelectedHotspot(hotspot)}
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              '0 0 0 0 hsl(var(--exhibit-glow) / 0.7)',
              '0 0 0 12px hsl(var(--exhibit-glow) / 0)',
              '0 0 0 0 hsl(var(--exhibit-glow) / 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div 
            className="w-2.5 h-2.5 bg-background rounded-full"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>
      ))}

      <AnimatePresence>
        {selectedHotspot && (
          <>
            <motion.div
              className="fixed inset-0 bg-exhibit-deep/80 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHotspot(null)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/95 backdrop-blur-md p-10 rounded-md shadow-2xl max-w-3xl w-full mx-4 z-50 border border-border/50"
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <button
                onClick={() => setSelectedHotspot(null)}
                className="absolute top-5 right-5 p-2 hover:bg-secondary/50 rounded-full transition-all duration-300"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
              
              <motion.h3 
                className="font-serif text-3xl text-primary mb-6 tracking-wide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {selectedHotspot.title}
              </motion.h3>
              
              {selectedHotspot.image && (
                <motion.img
                  src={selectedHotspot.image}
                  alt={selectedHotspot.title}
                  className="w-full h-auto rounded-sm mb-6 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                />
              )}
              
              <motion.p 
                className="exhibit-body text-lg leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {selectedHotspot.description}
              </motion.p>
              
              <svg
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full h-40 pointer-events-none opacity-30"
                style={{ zIndex: -1 }}
              >
                <motion.path
                  d="M 50% 0 Q 50% 60, 50% 100"
                  className="connector-line"
                  fill="none"
                  strokeWidth="2"
                  strokeDasharray="8,6"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

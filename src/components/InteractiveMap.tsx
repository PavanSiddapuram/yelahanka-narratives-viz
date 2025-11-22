import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [connectionPath, setConnectionPath] = useState("");

  useEffect(() => {
    if (selectedHotspot && containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const startX = (selectedHotspot.x / 100) * container.width;
      const startY = (selectedHotspot.y / 100) * container.height;
      const endX = container.width / 2;
      const endY = container.height / 2;
      
      const controlX1 = startX + (endX - startX) * 0.3;
      const controlY1 = startY - 100;
      const controlX2 = startX + (endX - startX) * 0.7;
      const controlY2 = endY - 150;
      
      setConnectionPath(`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`);
    }
  }, [selectedHotspot]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-md">
      <motion.img 
        src={imageUrl} 
        alt={alt} 
        className="w-full h-auto"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      />
      
      {/* Decorative wire mesh overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="wire-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <motion.path
              d="M 0 0 L 40 0 M 0 0 L 0 40"
              stroke="hsl(var(--exhibit-grey))"
              strokeWidth="0.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wire-grid)" />
      </svg>
      
      {/* Connection lines between hotspots */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {hotspots.map((hotspot, index) => {
          if (index === 0) return null;
          const prevHotspot = hotspots[index - 1];
          return (
            <motion.line
              key={`connection-${hotspot.id}`}
              x1={`${prevHotspot.x}%`}
              y1={`${prevHotspot.y}%`}
              x2={`${hotspot.x}%`}
              y2={`${hotspot.y}%`}
              stroke="hsl(var(--exhibit-glow))"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: index * 0.2 }}
            />
          );
        })}
      </svg>
      
      {hotspots.map((hotspot, index) => (
        <motion.div
          key={hotspot.id}
          className="absolute"
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.15, type: "spring", stiffness: 200, damping: 15 }}
        >
          {/* Radiating circles */}
          {hoveredId === hotspot.id && (
            <>
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={`ring-${ring}`}
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  style={{
                    width: '32px',
                    height: '32px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2 + ring * 0.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: ring * 0.2 }}
                />
              ))}
            </>
          )}
          
          <motion.button
            className="relative interactive-hotspot border-2 border-background/80 flex items-center justify-center group z-10"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, hsl(var(--exhibit-glow)) 0%, hsl(var(--primary)) 100%)',
            }}
            onClick={() => setSelectedHotspot(hotspot)}
            onHoverStart={() => setHoveredId(hotspot.id)}
            onHoverEnd={() => setHoveredId(null)}
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
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
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
          
          {/* Wire extending from hotspot */}
          {hoveredId === hotspot.id && (
            <svg className="absolute -top-16 left-1/2 -translate-x-1/2 w-1 h-16 pointer-events-none">
              <motion.line
                x1="0.5"
                y1="0"
                x2="0.5"
                y2="64"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                strokeDasharray="2 2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.4 }}
              />
            </svg>
          )}
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedHotspot && containerRef.current && (
          <>
            {/* Animated connection wire from hotspot to modal */}
            <svg className="fixed inset-0 w-full h-full pointer-events-none z-45" style={{ mixBlendMode: 'screen' }}>
              <motion.path
                d={connectionPath}
                stroke="hsl(var(--exhibit-glow))"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              />
              {/* Animated particle along the wire */}
              <motion.circle
                r="3"
                fill="hsl(var(--exhibit-glow))"
                initial={{ offsetDistance: "0%", opacity: 0 }}
                animate={{ 
                  offsetDistance: "100%",
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ offsetPath: `path('${connectionPath}')` }}
              />
            </svg>

            <motion.div
              className="fixed inset-0 bg-exhibit-deep/80 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHotspot(null)}
            />
            
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/95 backdrop-blur-md p-10 rounded-md shadow-2xl max-w-3xl w-full mx-4 z-50 border border-border/50 overflow-hidden"
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Decorative corner wires */}
              <svg className="absolute top-0 left-0 w-32 h-32 pointer-events-none opacity-20">
                <motion.path
                  d="M 0 0 L 128 0 L 128 128"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </svg>
              <svg className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-20">
                <motion.path
                  d="M 128 128 L 0 128 L 0 0"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </svg>

              <button
                onClick={() => setSelectedHotspot(null)}
                className="absolute top-5 right-5 p-2 hover:bg-secondary/50 rounded-full transition-all duration-300 z-10"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
              
              <motion.h3 
                className="font-serif text-3xl text-primary mb-6 tracking-wide relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {selectedHotspot.title}
                <motion.div
                  className="absolute -bottom-2 left-0 h-0.5 bg-primary/30"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </motion.h3>
              
              {selectedHotspot.image && (
                <motion.div className="relative mb-6">
                  <motion.img
                    src={selectedHotspot.image}
                    alt={selectedHotspot.title}
                    className="w-full h-auto rounded-sm shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  />
                  {/* Image corner accent */}
                  <motion.div
                    className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary/40"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  />
                </motion.div>
              )}
              
              <motion.p 
                className="exhibit-body text-lg leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {selectedHotspot.description}
              </motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

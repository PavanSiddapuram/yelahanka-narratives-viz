import { memo, useMemo } from "react";
import { Html } from "@react-three/drei";
import { Line } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";

import { useRoadNetwork } from "@/hooks/useRoadNetwork";
import type { ProjectionConfig } from "@/lib/geo";

interface RoadNetworkProps {
  projection: ProjectionConfig | null;
}

export const RoadNetwork = memo(({ projection }: RoadNetworkProps) => {
  const { status, error, polylines } = useRoadNetwork(projection);

  const color = "#c4cbd5";

  const content = useMemo(
    () =>
      polylines.map((polyline, index) => (
        <Line
          key={`${polyline.id ?? index}-${index}`}
          points={polyline.points}
          color={color}
          lineWidth={1.4}
          opacity={0.85}
          transparent
        />
      )),
    [polylines, color]
  );

  return (
    <group>
      {content}

      <AnimatePresence>
        {status === "loading" && !error ? (
          <Html position={[0, 0.4, 0]} center>
            <motion.div
              className="rounded-full border border-white/50 bg-white/70 px-4 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-[#77736c] shadow-[0_12px_35px_-24px_rgba(0,0,0,0.55)]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              Tracing streets5
            </motion.div>
          </Html>
        ) : null}
      </AnimatePresence>

      {error ? (
        <Html position={[0, 0.4, 0]} center>
          <motion.div
            className="rounded-2xl border border-red-200 bg-white/70 px-4 py-2 text-[0.65rem] uppercase tracking-[0.32em] text-red-600"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        </Html>
      ) : null}
    </group>
  );
});

RoadNetwork.displayName = "RoadNetwork";

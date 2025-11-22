import { memo, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Html } from "@react-three/drei";
import { Color, ExtrudeGeometry, Shape } from "three";

import { useBuildingExtrusions } from "@/hooks/useBuildingExtrusions";

const materialColors = {
  base: new Color("#d8dbe2"),
  top: new Color("#b6c4cf"),
  emissive: new Color("#f0ede6")
};

const disposeGeometry = (geometry: ExtrudeGeometry | null) => {
  if (geometry) {
    geometry.dispose();
  }
};

const BuildingShapeMesh = memo(
  ({ shape, height, position }: { shape: Shape; height: number; position: [number, number] }) => {
    const geometry = useMemo(() => {
      const extrude = new ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: false,
        steps: 1
      });
      extrude.rotateX(-Math.PI / 2);
      extrude.computeBoundingBox();
      extrude.computeVertexNormals();
      return extrude;
    }, [shape, height]);

    return (
      <mesh
        geometry={geometry}
        position={[position[0], 0, position[1]]}
        castShadow
        receiveShadow
        onUpdate={(mesh) => {
          mesh.updateMatrixWorld();
        }}
        onDispose={() => disposeGeometry(geometry)}
      >
        <meshStandardMaterial
          color={materialColors.base}
          emissive={materialColors.emissive}
          emissiveIntensity={0.08}
          metalness={0.12}
          roughness={0.62}
        />
      </mesh>
    );
  }
);
BuildingShapeMesh.displayName = "BuildingShapeMesh";

const BuildingMesh = memo(
  ({
    shapes,
    height
  }: {
    shapes: { shape: Shape; position: [number, number] }[];
    height: number;
  }) => {
    const topColor = useMemo(() => materialColors.top.clone().offsetHSL(0, 0, Math.min(height / 30, 0.08)), [height]);

    return (
      <group>
        {shapes.map((instance, index) => (
          <BuildingShapeMesh key={index} shape={instance.shape} height={height} position={instance.position} />
        ))}
        <group position={[0, height, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.35, 24]} />
            <meshBasicMaterial color={topColor} transparent opacity={0.2} />
          </mesh>
        </group>
      </group>
    );
  }
);
BuildingMesh.displayName = "BuildingMesh";

const LoaderOverlay = ({ status, footprintsCount }: { status: string; footprintsCount: number }) => (
  <Html center position={[0, 0.6, 0]}>
    <motion.div
      className="rounded-full border border-white/60 bg-white/60 px-5 py-2 text-xs uppercase tracking-[0.35em] text-[#585654] shadow-[0_15px_40px_-25px_rgba(0,0,0,0.35)]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {status === "loading" ? "Mapping footprints" : `Footprints loaded: ${footprintsCount}`}
    </motion.div>
  </Html>
);

export const BuildingExtrusions = () => {
  const { status, error, extrusions, footprintsCount } = useBuildingExtrusions({ maxFeatures: 520, targetSpanUnits: 28 });

  return (
    <group>
      <AnimatePresence>
        {(status === "loading" || status === "success") && !error ? (
          <LoaderOverlay key={status} status={status} footprintsCount={footprintsCount} />
        ) : null}
      </AnimatePresence>

      {error ? (
        <Html position={[0, 1, 0]}>
          <motion.div
            className="rounded-2xl border border-red-200 bg-white/70 px-4 py-3 text-xs uppercase tracking-[0.32em] text-red-600"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        </Html>
      ) : null}

      {extrusions.map((extrusion) => (
        <group key={extrusion.id ?? Math.random()}>
          <BuildingMesh shapes={extrusion.shapes} height={extrusion.height} />
        </group>
      ))}
    </group>
  );
};

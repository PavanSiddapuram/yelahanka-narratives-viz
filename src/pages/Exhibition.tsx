import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Environment, Float, Html, MapControls, SoftShadows, SpotLight, useProgress } from "@react-three/drei";
import { motion, AnimatePresence, MotionConfig, useMotionValueEvent, useSpring, useScroll, useTransform } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { BuildingExtrusions } from "@/components/BuildingExtrusions";
import { useHotspots, type HotspotZone } from "@/hooks/useHotspots";
import type { MotionValue } from "framer-motion";

interface ZonePanelProps {
  isOpen: boolean;
  onClose: () => void;
  zone?: HotspotZone;
}

const hotspotThemes: Record<HotspotZone["theme"], { title: string; subtitle: string; accent: string; panelBlur: string }> = {
  open: {
    title: "Open / Gated",
    subtitle: "Thresholds between open streets and gated enclaves",
    accent: "from-[#d4bba6]/60 via-[#dce0d6]/30 to-[#cfe0e8]/80",
    panelBlur: "bg-white/70 backdrop-blur-xl"
  },
  commerce: {
    title: "Commercial Synergy",
    subtitle: "Main street commerce, anchors, and wayfinding",
    accent: "from-[#c8d8f0]/80 via-[#edf2fa]/40 to-[#f6e9da]/80",
    panelBlur: "bg-[#f7f7f5]/70 backdrop-blur-lg"
  },
  walk: {
    title: "Walk-Life Inventory",
    subtitle: "Pedestrian rhythms and claimed pause points",
    accent: "from-[#e2f0da]/60 via-[#f8f4ec]/40 to-[#d6e6eb]/80",
    panelBlur: "bg-white/65 backdrop-blur-xl"
  },
  spectrum: {
    title: "Spectrum of Appropriation",
    subtitle: "Street micro-economies and negotiated territories",
    accent: "from-[#f2e6dc]/70 via-[#f7f2f0]/50 to-[#dfe7f5]/80",
    panelBlur: "bg-white/75 backdrop-blur-lg"
  },
  future: {
    title: "Urban Futures",
    subtitle: "Speculative gestures and emergent narratives",
    accent: "from-[#e9eef9]/80 via-[#fbfaf7]/40 to-[#e3f2f7]/80",
    panelBlur: "bg-white/80 backdrop-blur-xl"
  }
};

const easingSpring = { type: "spring", stiffness: 180, damping: 24 } as const;
const CAMERA_HEIGHT = 26;

const Loader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <motion.div
        className="flex flex-col items-center gap-4 px-8 py-6 rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_25px_70px_-40px_rgba(0,0,0,0.55)]"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.span
          className="font-serif text-2xl tracking-[0.3em] text-[#766e64]"
          animate={{
            opacity: [0.35, 1, 0.35],
            letterSpacing: ["0.2em", "0.4em", "0.2em"]
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          YELAHANKA
        </motion.span>

        <div className="h-1.5 w-40 rounded-full bg-gradient-to-r from-[#d4cabc] via-[#afc7d4] to-[#8abed1]/80 overflow-hidden">
          <motion.div
            className="h-full bg-white/80"
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.span className="text-xs uppercase tracking-[0.4em] text-[#868179]">
          {Math.round(progress)}%
        </motion.span>
      </motion.div>
    </Html>
  );
};

const PanelConnector = ({ from, to, isActive }: { from: [number, number]; to: [number, number]; isActive: boolean }) => {
  const controlX = (from[0] + to[0]) / 2;
  const controlY = from[1] - 120;
  const beadT = 0.62;
  const beadX = (1 - beadT) * (1 - beadT) * from[0] + 2 * (1 - beadT) * beadT * controlX + beadT * beadT * to[0];
  const beadY = (1 - beadT) * (1 - beadT) * from[1] + 2 * (1 - beadT) * beadT * controlY + beadT * beadT * to[1];

  return (
    <svg className="absolute inset-0 pointer-events-none">
      <defs>
        <linearGradient id="connectorGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#a6b9c9" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#d8c7b1" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#f5ede3" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="connectorNode" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#9fb4c7" stopOpacity="0.35" />
        </radialGradient>
        <filter id="connectorGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d={`M ${from[0]} ${from[1]} Q ${controlX} ${controlY}, ${to[0]} ${to[1]}`}
        fill="none"
        stroke="url(#connectorGradient)"
        strokeWidth={2.1}
        strokeDasharray="3 10"
        strokeLinecap="round"
        filter="url(#connectorGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 0.85 : 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />

      <motion.circle
        cx={from[0]}
        cy={from[1]}
        r={isActive ? 4.5 : 1.5}
        fill="url(#connectorNode)"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 0.9 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <motion.circle
        cx={beadX}
        cy={beadY}
        r={5}
        fill="#d8c7b1"
        stroke="#ffffff"
        strokeWidth={1.2}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: isActive ? [0.85, 1.05, 0.85] : 0.85, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 1.8, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
      />

      <motion.circle
        cx={to[0]}
        cy={to[1]}
        r={6.5}
        fill="#ffffff"
        stroke="#adbfd0"
        strokeWidth={1.4}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: isActive ? [0.9, 1.08, 0.95] : 0.8, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 1.1, repeat: isActive ? Infinity : 0, repeatType: "reverse", ease: "easeInOut" }}
      />
    </svg>
  );
};

interface CameraRigProps {
  motionX: MotionValue<number>;
  motionZ: MotionValue<number>;
  focus: THREE.Vector3;
}

const CameraRig = ({ motionX, motionZ, focus }: CameraRigProps) => {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(motionX.get(), CAMERA_HEIGHT, motionZ.get()));

  useFrame(() => {
    target.current.set(motionX.get(), CAMERA_HEIGHT, motionZ.get());
    camera.position.lerp(target.current, 0.1);
    camera.lookAt(focus);
  });

  return null;
};

const ZonePanel = ({ isOpen, onClose, zone }: ZonePanelProps) => {
  const theme = zone ? hotspotThemes[zone.theme] : undefined;

  return (
    <AnimatePresence>
      {zone && theme && isOpen && (
        <motion.aside
          className={`fixed right-0 top-0 h-full w-full max-w-xl z-[60] px-6 md:px-8 py-12 ${theme.panelBlur} border-l border-white/40 shadow-[0_20px_60px_-30px_rgba(60,68,79,0.45)]`}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ ...easingSpring, mass: 0.8 }}
        >
          <div className="flex flex-col h-full gap-10">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <motion.span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.65rem] uppercase tracking-[0.38em] text-[#5f5c58] bg-gradient-to-r ${theme.accent} shadow-[0_10px_30px_-25px_rgba(59,68,82,0.65)]`}
                  layoutId={`subtitle-${zone.id}`}
                >
                  {theme.subtitle}
                </motion.span>
                <motion.h2 className="font-serif text-4xl text-[#232421] leading-tight" layoutId={`title-${zone.id}`}>
                  {zone.name}
                </motion.h2>
              </div>
              <motion.button
                onClick={onClose}
                className="rounded-full border border-black/10 text-[0.65rem] px-5 py-2 tracking-[0.42em] uppercase text-[#5a5a58] hover:border-black/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>

            <motion.div
              className="relative flex-1 overflow-y-auto pr-2 space-y-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              <motion.div
                className={`rounded-3xl border border-white/40 ${theme.panelBlur} shadow-[0_18px_70px_-35px_rgba(0,0,0,0.45)] overflow-hidden`}
                layoutId={`media-${zone.id}`}
              >
                <div className="h-64 w-full bg-gradient-to-br from-black/5 via-white/5 to-white/30">
                  {zone.media ? (
                    <img src={zone.media} alt={zone.name} className="h-full w-full object-cover mix-blend-luminosity" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[#676765]/70">
                      <span className="tracking-[0.6em] uppercase text-xs">Sketch pending</span>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.p
                className="text-[1.05rem] leading-relaxed text-[#383937]/90 tracking-wide"
                layoutId={`description-${zone.id}`}
              >
                {zone.description}
              </motion.p>

              {zone.tags?.length ? (
                <motion.div
                  className="rounded-2xl border border-white/50 bg-white/60 backdrop-blur-xl px-5 py-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.18 }}
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#8a8780] mb-3">Motifs</p>
                  <div className="flex flex-wrap gap-3">
                    {zone.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        className="px-4 py-2 rounded-full border border-white/70 text-[0.7rem] uppercase tracking-[0.34em] text-[#5f5c58] bg-white/50 shadow-[0_12px_30px_-25px_rgba(0,0,0,0.45)]"
                        whileHover={{ scale: 1.05 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              <motion.div
                className="rounded-2xl border border-[#dad3c8]/60 bg-white/70 backdrop-blur-xl px-5 py-4 text-[0.7rem] uppercase tracking-[0.42em] text-[#716f6a] flex items-center justify-between"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.28 }}
              >
                <span>Hold & drag the terrain to roam</span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1 w-12 rounded-full bg-gradient-to-r from-[#c5b6a3] to-[#aebfd6]" />
                  Orbit Tips
                </span>
              </motion.div>
            </motion.div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

const HotspotRig = ({ zones, onSelectZone, activeZoneId }: { zones: HotspotZone[]; onSelectZone: (zone: HotspotZone) => void; activeZoneId?: string }) => {
  return (
    <group>
      {zones.map((zone) => (
        <Float key={zone.id} speed={2.5} rotationIntensity={0.05} floatIntensity={0.2}>
          {(() => {
            const isActive = activeZoneId === zone.id;
            const [sx, sy, sz] = zone.size ?? [0.8, 0.8, 0.8];
            return (
          <mesh
            position={zone.position}
            onClick={() => onSelectZone(zone)}
            onPointerOver={(event) => {
              event.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <boxGeometry args={[sx, sy + (isActive ? 0.35 : 0), sz]} />
            <meshStandardMaterial
              color={zone.color}
              roughness={0.3}
              metalness={0.15}
              emissive={isActive ? "#f2decf" : "#000000"}
              emissiveIntensity={isActive ? 0.45 : 0.05}
            />
            <Html
              position={[0, sy / 2 + (isActive ? 0.45 : 0.25), 0]}
              transform
              occlude
              className="pointer-events-none"
            >
              <motion.div
                className="px-3 py-1 rounded-full text-xs uppercase tracking-[0.35em] bg-[#f8f4ef]/80 text-[#3d3c39]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, scale: isActive ? 1.05 : 1 }}
                transition={{ duration: 0.4 }}
              >
                {zone.name}
              </motion.div>
            </Html>
          </mesh>
            );
          })()}
        </Float>
      ))}
    </group>
  );
};

const GroundPlane = () => {
  let texture: THREE.Texture | null = null;
  try {
    texture = useLoader(THREE.TextureLoader, "/assets/yelahanka-map.png");
  } catch {
    texture = null;
  }

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]} receiveShadow>
      <planeGeometry args={[35, 35]} />
      <meshStandardMaterial
        color="#f2efe9"
        metalness={0.05}
        roughness={0.85}
        map={texture ?? undefined}
        transparent={!!texture}
        opacity={texture ? 0.98 : 1}
      />
    </mesh>
  );
};

const AtmosphericLight = ({ tilt }: { tilt: number }) => (
  <group>
    <ambientLight intensity={0.35} />
    <SpotLight
      position={[15 + tilt * 3, 18, 20 + tilt * 5]}
      angle={0.35}
      penumbra={0.7}
      intensity={1.2}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      color="#f7efe5"
    />
    <SpotLight
      position={[-12 + tilt * 4, 16, -18 + tilt * 3]}
      angle={0.45}
      penumbra={0.5}
      intensity={0.75}
      color="#c9d8f0"
    />
  </group>
);

const Exhibition = () => {
  const { zonesByTheme, orderedZones } = useHotspots();
  const [activeZone, setActiveZone] = useState<HotspotZone | null>(null);
  const cameraFocus = useMemo(() => new THREE.Vector3(0, 2.6, 0), []);
  const { scrollYProgress } = useScroll();
  const cameraX = useTransform(scrollYProgress, [0, 1], [16, -4]);
  const cameraZ = useTransform(scrollYProgress, [0, 1], [24, 12]);
  const cameraMotionX = useSpring(cameraX, easingSpring);
  const cameraMotionZ = useSpring(cameraZ, easingSpring);
  const lightTilt = useTransform(scrollYProgress, [0, 1], [0.3, -0.25]);
  const lightMotion = useSpring(lightTilt, easingSpring);
  const [lightTiltValue, setLightTiltValue] = useState(0);
  const getConnectorTarget = useCallback((): [number, number] => {
    if (typeof window === "undefined") {
      return [640, 140];
    }
    return [Math.max(window.innerWidth - 200, 420), 140];
  }, []);
  const [connectorTo, setConnectorTo] = useState<[number, number]>(() => getConnectorTarget());
  const connectorFrom: [number, number] = [320, 120];

  useMotionValueEvent(lightMotion, "change", (latest) => {
    setLightTiltValue(latest);
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleResize = () => setConnectorTo(getConnectorTarget());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getConnectorTarget]);

  return (
    <MotionConfig transition={easingSpring}>
      <div className="relative min-h-screen bg-[#f7f4ef] text-[#2f2f2c]">
        <Navigation />

        <main className="relative">
          <section id="home" className="min-h-screen flex flex-col justify-center items-center px-6 pt-32 md:pt-36">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center max-w-5xl"
            >
              <motion.h1 className="font-serif text-5xl md:text-7xl tracking-tight">
                Exploring Yelahanka: A Narrative of Spaces
              </motion.h1>
              <motion.p
                className="mt-6 text-base md:text-lg leading-relaxed text-[#565552]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                A cinematic, tactile journey through Bengaluru’s Yelahanka — translating urban research into a living sculpture of light, motion, and story.
              </motion.p>
              <motion.div className="mt-10">
                <motion.button
                  className="rounded-full border border-[#3e3e3b]/20 px-10 py-4 uppercase tracking-[0.4em] text-xs text-[#42423f] hover:border-[#3e3e3b]/40"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    const firstSection = document.getElementById("terrain");
                    firstSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Enter the terrain
                </motion.button>
              </motion.div>
            </motion.div>
            <motion.div
              className="absolute bottom-10 flex flex-col items-center text-[0.7rem] uppercase tracking-[0.55em] text-[#8d8b87]"
              animate={{ y: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <span>Scroll to navigate</span>
              <span className="w-px h-10 bg-gradient-to-b from-[#9ba7b7] to-transparent mt-3" />
            </motion.div>
          </section>

          <section id="terrain" className="relative min-h-screen">
            <div className="sticky top-0 h-screen">
              <div className="absolute inset-0">
                <Canvas shadows dpr={[1, 2]} camera={{ position: [0, CAMERA_HEIGHT, 0.01], fov: 50 }}>
                  <Suspense fallback={<Loader />}>
                    <color attach="background" args={["#f7f4ef"]} />
                    <SoftShadows size={24} focus={0.8} samples={12} />
                    <AtmosphericLight tilt={lightTiltValue} />

                    <MapControls
                      enableRotate
                      enablePan
                      enableZoom
                      zoomSpeed={0.9}
                      rotateSpeed={0.5}
                      minDistance={12}
                      maxDistance={70}
                      minPolarAngle={Math.PI / 3.2}
                      maxPolarAngle={Math.PI / 2.02}
                      target={[0, 0, 0]}
                    />

                    <group>
                      <GroundPlane />
                      <BuildingExtrusions />
                      <HotspotRig zones={orderedZones} onSelectZone={setActiveZone} activeZoneId={activeZone?.id} />
                    </group>

                    <Environment preset="sunset" />
                  </Suspense>
                </Canvas>
              </div>

              <div className="absolute inset-0 pointer-events-none">
                <MotionConfig transition={{ type: "spring", stiffness: 150, damping: 20 }}>
                  <AnimatePresence>
                    {activeZone ? (
                      <motion.div
                        key={activeZone.id}
                        className="absolute left-0 top-1/3 w-80 px-6"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                      >
                        <motion.div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-lg shadow-[0_12px_50px_-25px_rgba(0,0,0,0.4)] p-6">
                          <motion.p className="text-xs uppercase tracking-[0.45em] text-[#7f7d79]">
                            {hotspotThemes[activeZone.theme].title}
                          </motion.p>
                          <motion.h3 className="mt-4 text-xl font-semibold text-[#2f2e2b]">
                            {activeZone.name}
                          </motion.h3>
                          <motion.p className="mt-3 text-sm leading-relaxed text-[#494845]/80">
                            {activeZone.description}
                          </motion.p>
                        </motion.div>
                        <PanelConnector from={connectorFrom} to={connectorTo} isActive={!!activeZone} />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </MotionConfig>
              </div>
            </div>
          </section>

          <section className="relative z-10 bg-gradient-to-b from-[#f6f0e8] via-[#eef2f5] to-[#f9f7f4]">
            <div className="mx-auto max-w-6xl px-6 py-28 space-y-24">
              {Object.entries(zonesByTheme).map(([themeKey, zones]) => {
                const theme = hotspotThemes[themeKey as HotspotZone["theme"]];
                const themeId = `theme-${themeKey}`;

                return (
                  <motion.div
                    key={themeKey}
                    id={themeId}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="flex flex-col md:flex-row gap-12">
                      <motion.div className="md:w-1/2 space-y-6">
                        <motion.p className="text-xs uppercase tracking-[0.5em] text-[#807f7a]">{theme.subtitle}</motion.p>
                        <motion.h2 className="font-serif text-4xl text-[#232321]">{theme.title}</motion.h2>
                        <motion.p className="text-sm md:text-base leading-loose text-[#4f4e4b]">
                          {zones[0]?.summary ?? "Each block articulates the lived conditions of Yelahanka, where planned geometries meet improvised everyday life."}
                        </motion.p>
                      </motion.div>

                      <div className="md:w-1/2 space-y-8">
                        {zones.map((zone) => (
                          <motion.button
                            key={zone.id}
                            className="w-full text-left"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveZone(zone)}
                          >
                            <div className="rounded-2xl border border-white/70 bg-white/50 backdrop-blur-lg shadow-[0_15px_35px_-30px_rgba(0,0,0,0.4)] p-6">
                              <p className="text-xs uppercase tracking-[0.4em] text-[#807d79]">{zone.name}</p>
                              <p className="mt-3 text-sm leading-relaxed text-[#4a4946]/85">{zone.description}</p>
                              {zone.tags?.length ? (
                                <div className="mt-4 flex flex-wrap gap-3">
                                  {zone.tags.map((tag) => (
                                    <span key={tag} className="text-[0.65rem] uppercase tracking-[0.32em] text-[#777672] border border-white/70 px-3 py-1 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </main>

        <ZonePanel isOpen={!!activeZone} zone={activeZone ?? undefined} onClose={() => setActiveZone(null)} />
      </div>
    </MotionConfig>
  );
};

export default Exhibition;

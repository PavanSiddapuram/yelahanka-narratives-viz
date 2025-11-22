import { motion } from "framer-motion";
import { ExhibitSection } from "@/components/ExhibitSection";
import { InteractiveMap, Hotspot } from "@/components/InteractiveMap";
import { Navigation } from "@/components/Navigation";

import commercialProximityImg from "@/assets/commercial-proximity.jpg";
import commercialProximity2Img from "@/assets/commercial-proximity-2.jpg";
import settingMaterialityImg from "@/assets/setting-materiality.jpg";
import plannedImg from "@/assets/planned.jpg";
import openGatedImg from "@/assets/open-gated.jpg";
import urbanFutures1Img from "@/assets/urban-futures-1.jpg";
import urbanFutures2Img from "@/assets/urban-futures-2.jpg";
import spectrumAppropriationImg from "@/assets/spectrum-appropriation.jpg";
import walkLifeInventoryImg from "@/assets/walk-life-inventory.jpg";

const commercialProximityHotspots: Hotspot[] = [
  {
    id: "hotspot-1",
    x: 35,
    y: 45,
    title: "Main Street Commerce",
    description: "The primary commercial corridor serves as the economic heartbeat of the neighborhood, with shops and services clustered along the main thoroughfare.",
  },
  {
    id: "hotspot-2",
    x: 60,
    y: 55,
    title: "Market Anchor Point",
    description: "A central gathering space where formal retail meets informal vending, creating a dynamic commercial ecosystem.",
  },
  {
    id: "hotspot-3",
    x: 45,
    y: 70,
    title: "Commercial Synergy Zone",
    description: "Areas where different commercial activities complement each other, creating enhanced foot traffic and economic vitality.",
  },
];

const spectrumAppropriationHotspots: Hotspot[] = [
  {
    id: "spectrum-1",
    x: 30,
    y: 40,
    title: "Street Vendor Territory",
    description: "Informal micro-economies claim sidewalk spaces, negotiating with pedestrian flows and formal businesses.",
  },
  {
    id: "spectrum-2",
    x: 55,
    y: 50,
    title: "Negotiated Space",
    description: "Contested zones where multiple users stake claims throughout different times of day.",
  },
  {
    id: "spectrum-3",
    x: 70,
    y: 65,
    title: "Appropriation Gradient",
    description: "The spectrum from fully public to semi-private appropriated spaces, showing the fluidity of urban ownership.",
  },
];

const walkLifeInventoryHotspots: Hotspot[] = [
  {
    id: "walk-1",
    x: 25,
    y: 35,
    title: "Movement Corridor",
    description: "Primary pedestrian routes showing the daily rhythms of commuters, shoppers, and residents.",
  },
  {
    id: "walk-2",
    x: 50,
    y: 55,
    title: "Pause Point",
    description: "Claimed spaces where people stop, gather, and socialize, punctuating the flow of movement.",
  },
  {
    id: "walk-3",
    x: 75,
    y: 45,
    title: "Pedestrian Intersection",
    description: "Key nodes where multiple walking paths converge, creating opportunities for encounter and exchange.",
  },
];

export default function Exhibition() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background wires */}
      <motion.svg 
        className="fixed inset-0 w-full h-full pointer-events-none opacity-5 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`bg-wire-${i}`}
            x1={`${i * 12.5}%`}
            y1="0"
            x2={`${i * 12.5}%`}
            y2="100%"
            stroke="hsl(var(--foreground))"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: i * 0.1, ease: "easeInOut" }}
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <motion.line
            key={`bg-wire-h-${i}`}
            x1="0"
            y1={`${i * 16.6}%`}
            x2="100%"
            y2={`${i * 16.6}%`}
            stroke="hsl(var(--foreground))"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: i * 0.1, ease: "easeInOut" }}
          />
        ))}
      </motion.svg>
      
      <Navigation />
      <div className="pt-24 relative z-10">
        {/* Hero Section */}
        <motion.section 
          className="min-h-screen flex items-center justify-center textured-bg px-6 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          {/* Radial wire emanation from center */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 360) / 12;
              return (
                <motion.line
                  key={`radial-${i}`}
                  x1="50%"
                  y1="50%"
                  x2={`${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`}
                  y2={`${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 2, delay: i * 0.1, ease: "easeOut" }}
                />
              );
            })}
          </svg>

          {/* Central pulse */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/40"
            animate={{
              scale: [1, 20, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="max-w-5xl text-center relative z-10">
            <motion.h1 
              className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary mb-8 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Spatial
              </motion.span>{" "}
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Narratives
              </motion.span>{" "}
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                of
              </motion.span>
              <br />
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                Yelahanka
              </motion.span>{" "}
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              >
                New
              </motion.span>{" "}
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
              >
                Town
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.8 }}
            >
              An interactive exploration of urban space, community, and the stories woven into the built environment
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.9, duration: 0.6 }}
            >
              <motion.button 
                onClick={() => document.getElementById('commercial-proximity')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative px-8 py-4 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-all duration-300 tracking-wide uppercase text-sm font-medium shadow-lg hover:shadow-xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative">Begin Exploration</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Corner wire decorations */}
          <svg className="absolute top-8 left-8 w-24 h-24 pointer-events-none opacity-20">
            <motion.path
              d="M 0 0 L 96 0 M 0 0 L 0 96"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 2 }}
            />
          </svg>
          <svg className="absolute bottom-8 right-8 w-24 h-24 pointer-events-none opacity-20">
            <motion.path
              d="M 96 96 L 0 96 M 96 96 L 96 0"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 2 }}
            />
          </svg>
        </motion.section>

        {/* Commercial Proximity */}
        <ExhibitSection id="commercial-proximity" title="Commercial Proximity and Synergy">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <InteractiveMap
                imageUrl={commercialProximityImg}
                hotspots={commercialProximityHotspots}
                alt="Commercial Proximity Map"
              />
            </div>
            <div className="space-y-6">
              <p className="exhibit-body text-lg leading-relaxed">
                The commercial landscape of Yelahanka New Town reveals intricate patterns of proximity and synergy. 
                Main street corridors serve as economic anchors, while smaller commercial nodes create neighborhood-scale 
                gathering points.
              </p>
              <img src={commercialProximity2Img} alt="Commercial details" className="w-full rounded-md shadow-lg" />
              <p className="exhibit-body leading-relaxed">
                These commercial relationships are not merely functional but social, creating spaces of encounter 
                and exchange that define the character of the neighborhood.
              </p>
            </div>
          </div>
        </ExhibitSection>

        {/* Setting and Materiality */}
        <ExhibitSection id="setting-materiality" title="Setting and Materiality" isDark>
          <div className="max-w-4xl mx-auto">
            <img 
              src={settingMaterialityImg} 
              alt="Setting and Materiality" 
              className="w-full rounded-md shadow-2xl mb-8"
            />
            <p className="exhibit-body text-lg leading-relaxed text-center">
              The physical fabric of Yelahanka speaks through its materials — concrete, brick, plaster, and paint. 
              Each building tells a story of construction techniques, economic constraints, and aesthetic choices that 
              collectively define the neighborhood's visual identity. From formal apartment complexes to self-built homes, 
              the materiality reveals the social and economic diversity of the area.
            </p>
          </div>
        </ExhibitSection>

        {/* Planned / "Planned" */}
        <ExhibitSection id="planned" title="Planned / &quot;Planned&quot;">
          <div className="max-w-5xl mx-auto">
            <img 
              src={plannedImg} 
              alt="Planned development" 
              className="w-full rounded-md shadow-xl mb-8"
            />
            <div className="grid md:grid-cols-2 gap-8">
              <p className="exhibit-body text-lg leading-relaxed">
                The quotation marks around "Planned" are intentional — they highlight the gap between official planning 
                schemes and lived reality. Yelahanka New Town emerged from formal development plans, yet its current form 
                reflects countless informal adaptations, additions, and appropriations.
              </p>
              <p className="exhibit-body text-lg leading-relaxed">
                This tension between planned and organic growth creates a layered urban landscape where formal grids 
                meet informal pathways, where regulated setbacks accommodate improvised extensions, and where master 
                plans become palimpsests overwritten by daily life.
              </p>
            </div>
          </div>
        </ExhibitSection>

        {/* Open / Gated */}
        <ExhibitSection id="open-gated" title="Open / Gated">
          <div className="max-w-5xl mx-auto">
            <img 
              src={openGatedImg} 
              alt="Open and gated communities" 
              className="w-full rounded-md shadow-xl mb-8"
            />
            <p className="exhibit-body text-lg leading-relaxed text-center max-w-3xl mx-auto">
              Yelahanka embodies the contemporary Indian urban condition: the coexistence of open streets and gated enclaves. 
              This duality creates distinct thresholds between public accessibility and private security, between communal 
              space and exclusive territory. The gates, walls, and guards that define these boundaries tell stories of 
              aspiration, fear, class, and the changing nature of urban citizenship.
            </p>
          </div>
        </ExhibitSection>

        {/* Urban Futures */}
        <ExhibitSection id="urban-futures" title="Urban Futures" isDark>
          <div className="grid md:grid-cols-2 gap-12">
            <img 
              src={urbanFutures1Img} 
              alt="Urban Futures 1" 
              className="w-full rounded-md shadow-2xl"
            />
            <img 
              src={urbanFutures2Img} 
              alt="Urban Futures 2" 
              className="w-full rounded-md shadow-2xl"
            />
          </div>
          <p className="exhibit-body text-lg leading-relaxed text-center max-w-4xl mx-auto mt-12">
            What futures are being imagined and constructed in Yelahanka New Town? Through speculative sketches and 
            documentation of emergent patterns, this section explores the trajectories of change — infrastructural upgrades, 
            densification, new typologies of housing and commerce, and the evolving relationship between residents and 
            their urban environment. These futures are not singular but multiple, contested, and constantly negotiated.
          </p>
        </ExhibitSection>

        {/* Spectrum of Appropriation */}
        <ExhibitSection id="spectrum" title="Spectrum of Appropriation">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <p className="exhibit-body text-lg leading-relaxed">
                Public space in Yelahanka exists along a spectrum — from fully accessible commons to temporarily claimed 
                territories to semi-private domains. Street vendors set up shop on sidewalks, residents extend their homes 
                into setbacks, children claim parking lots as playgrounds.
              </p>
              <p className="exhibit-body leading-relaxed">
                These appropriations are not violations but vital urban practices that demonstrate how people actively 
                shape their environment to meet needs unaddressed by formal planning. The spectrum reveals the negotiated, 
                fluid nature of urban space.
              </p>
            </div>
            <div>
              <InteractiveMap
                imageUrl={spectrumAppropriationImg}
                hotspots={spectrumAppropriationHotspots}
                alt="Spectrum of Appropriation Map"
              />
            </div>
          </div>
        </ExhibitSection>

        {/* Walk-Life Inventory */}
        <ExhibitSection id="walk-life" title="Walk-Life Inventory">
          <div className="space-y-12">
            <InteractiveMap
              imageUrl={walkLifeInventoryImg}
              hotspots={walkLifeInventoryHotspots}
              alt="Walk-Life Inventory Map"
            />
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="exhibit-body text-lg leading-relaxed">
                Walking through Yelahanka reveals the pedestrian rhythms that animate the neighborhood. The Walk-Life 
                Inventory documents paths, pauses, and patterns of movement — where people walk, where they stop, where 
                they gather, and how these activities vary across time of day and season.
              </p>
              <p className="exhibit-body text-lg leading-relaxed">
                This inventory highlights the importance of walkability not just as connectivity but as social life. 
                The street vendors at busy intersections, the tea stalls that become gathering points, the shaded benches 
                where elders sit — these are the infrastructure of pedestrian urban culture.
              </p>
            </div>
          </div>
        </ExhibitSection>

        {/* Footer */}
        <motion.footer 
          className="py-16 px-6 textured-bg border-t border-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-sm text-foreground/60 tracking-wide uppercase">
              An Interactive Urban Exhibition
            </p>
            <p className="font-serif text-2xl text-primary">
              Yelahanka New Town
            </p>
            <p className="text-sm text-foreground/50">
              Spatial Narratives Research Project
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

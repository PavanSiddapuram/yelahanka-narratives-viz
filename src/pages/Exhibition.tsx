import { ExhibitSection } from "@/components/ExhibitSection";
import { InteractiveMap, Hotspot } from "@/components/InteractiveMap";
import { Navigation } from "@/components/Navigation";
import { motion } from "framer-motion";
import commercialProximity from "@/assets/commercial-proximity.jpg";
import settingMateriality from "@/assets/setting-materiality.jpg";
import planned from "@/assets/planned.jpg";
import openGated from "@/assets/open-gated.jpg";
import urbanFutures1 from "@/assets/urban-futures-1.jpg";
import spectrumAppropriation from "@/assets/spectrum-appropriation.jpg";
import walkLifeInventory from "@/assets/walk-life-inventory.jpg";

const commercialHotspots: Hotspot[] = [
  {
    id: "scene-01",
    x: 15,
    y: 45,
    title: "Scene 01 - Main Corridor",
    description: "The main commercial corridor functions as the primary circulation spine, hosting diverse temporary and permanent vendors. This space exhibits high pedestrian flow and creates opportunities for spontaneous interactions."
  },
  {
    id: "scene-02",
    x: 50,
    y: 30,
    title: "Scene 02 - Central Plaza",
    description: "At the heart of commercial activity, the central plaza serves as a gathering point where multiple pathways converge. Street vendors cluster around permanent establishments, creating layers of commercial activity."
  },
  {
    id: "scene-04",
    x: 75,
    y: 50,
    title: "Scene 04 - Way-dependent Activity",
    description: "Commercial activities adapt to the urban fabric, utilizing building edges, setbacks, and transitional zones. This demonstrates how businesses negotiate space within the planned layout."
  }
];

const spectrumHotspots: Hotspot[] = [
  {
    id: "case-01",
    x: 20,
    y: 40,
    title: "Case 01 - Temporary Appropriation",
    description: "Lightweight, temporary structures claim public space during peak hours, demonstrating the fluid boundary between public and private use in the urban fabric."
  },
  {
    id: "case-04",
    x: 60,
    y: 35,
    title: "Case 04 - Semi-permanent Installation",
    description: "Vendors establish more permanent footholds through repeated daily setup, gradually transforming temporary claims into semi-permanent fixtures of street life."
  },
  {
    id: "case-08",
    x: 85,
    y: 45,
    title: "Case 08 - Flexible Boundaries",
    description: "The choreography of everyday appropriation reveals how street elements are continually adapted—a railing becomes a display, a threshold turns into a workspace."
  }
];

const walkLifeHotspots: Hotspot[] = [
  {
    id: "walk-01",
    x: 25,
    y: 30,
    title: "Walking - Movement Corridor",
    description: "The continuous pedestrian pathway defines the primary axis of movement, creating a gauntlet of commercial interactions and vehicular barriers."
  },
  {
    id: "walk-02",
    x: 50,
    y: 55,
    title: "Sitting - Pause Points",
    description: "Strategic pause points emerge along the journey—under shade trees, at building edges, or on improvised seating. These moments of rest transform the path into a place."
  },
  {
    id: "walk-03",
    x: 75,
    y: 40,
    title: "Dwelling - Claimed Territory",
    description: "Certain spaces become territories of extended dwelling, where vendors, workers, and residents claim ground through repeated presence and spatial negotiation."
  }
];

const Exhibition = () => {
  return (
    <div className="w-full">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section
        id="home"
        className="min-h-screen w-full flex flex-col items-center justify-center px-6 md:px-12 bg-gradient-to-b from-background to-secondary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="text-center max-w-4xl"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="font-serif text-5xl md:text-7xl text-primary mb-6 tracking-tight">
            Spatial Narratives of Yelahanka New Town
          </h1>
          <p className="font-sans text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            An interactive exploration of urban life, movement, and appropriation through architectural research
          </p>
          <motion.button
            className="px-8 py-4 bg-primary text-primary-foreground rounded-sm font-sans text-sm uppercase tracking-wide hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById("open-gated")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Begin Exhibition
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Open / Gated */}
      <ExhibitSection id="open-gated" title="Open / Gated">
        <div className="grid md:grid-cols-2 gap-8">
          <img src={openGated} alt="Open and Gated Communities Comparison" className="w-full h-auto rounded-sm" />
          <div className="flex flex-col justify-center">
            <p className="exhibit-body mb-4">
              In Yelahanka New Town, the urban fabric is composed of low-rise, independently built houses. Along the main roads, a mix of retail and informal commercial activities thrive, with street vendors occupying footpaths and setting up temporary stalls, while vendors occupy footpaths and street edges, making everyday essentials easily accessible.
            </p>
            <p className="exhibit-body">
              In contrast, gated communities are dominated by high-rise complexes where access to open and green spaces is limited and often exclusive. The surrounding streets prioritize vehicles over pedestrians, leaving little room for informal activity. Within these enclaves, commercial amenities are distant, with walls and controlled access becoming sterile—its vitality replaced by isolation and controlled access.
            </p>
          </div>
        </div>
      </ExhibitSection>

      {/* Commercial Proximity and Synergy */}
      <ExhibitSection id="commercial-proximity" title="Commercial Proximity and Synergy" className="bg-secondary/10">
        <div className="space-y-8">
          <p className="exhibit-body text-center max-w-3xl mx-auto">
            This map explores the interplay of activities that unfolds through everyday relationships between temporary and permanent structures along the main street of Yelahanka New Town. It traces how footpath vendors—selling vegetables, fruits, flowers, coconuts, and other essentials—position themselves around permanent establishments such as banks, restaurants, and general stores.
          </p>
          <InteractiveMap
            imageUrl={commercialProximity}
            hotspots={commercialHotspots}
            alt="Commercial Proximity and Synergy Mapping"
          />
          <p className="exhibit-body text-center max-w-3xl mx-auto mt-6">
            Permanent shops act as anchors, generating steady pedestrian flow and defining the commercial tone. Their performance, lighting, and visibility provide a framework around which other activities cluster. Temporary vendors respond fluidly—occupying high-traffic zones outside supermarkets, near eateries, beside ATMs, or under shaded trees—extending activity into the open street.
          </p>
        </div>
      </ExhibitSection>

      {/* Walk-Life Inventory */}
      <ExhibitSection id="walk-life" title="Walk-Life Inventory">
        <div className="space-y-8">
          <p className="exhibit-body text-center max-w-3xl mx-auto">
            The walk-life inventory features two protagonists: <em>Walking</em>, the agent of movement, and <em>Sitting</em>, the act of claiming place—theirs is a symbiotic story. In Yelahanka, the journey of one begins only through the arrival of the other. Together, they narrate the ongoing negotiation of public life on the street.
          </p>
          <InteractiveMap
            imageUrl={walkLifeInventory}
            hotspots={walkLifeHotspots}
            alt="Walk-Life Inventory Mapping"
          />
          <p className="exhibit-body text-center max-w-3xl mx-auto mt-6">
            For <em>Walking</em>, the path is a gauntlet of obstructions and approaching vehicles. Yet sitting deep human need requires one to pause and simply <em>be</em>. A quiet rebellion unfolds as residents find their own places of rest—against a tree, on a bench, at a low wall, a social ledge. <em>Sitting</em> transforms the path into place, and the <em>katte</em> beneath a tree emerges as the ultimate destination—a testament to shade, community, and stillness.
          </p>
        </div>
      </ExhibitSection>

      {/* Spectrum of Appropriation */}
      <ExhibitSection id="spectrum" title="Spectrum of Appropriation" className="bg-secondary/10">
        <div className="space-y-8">
          <p className="exhibit-body text-center max-w-3xl mx-auto">
            This map explores the street as a dynamic, negotiated space rather than a static physical entity. What is designed as carriageway, footpath, or threshold continually evolves through everyday acts of use—displaying goods, setting up stalls, extending furniture, or occupying boundaries between public and private, revealing the lived complexities of urban space.
          </p>
          <InteractiveMap
            imageUrl={spectrumAppropriation}
            hotspots={spectrumHotspots}
            alt="Spectrum of Appropriation"
          />
          <p className="exhibit-body text-center max-w-3xl mx-auto mt-6">
            Through repeated visits and informal interviews, the study observed how street elements are continually adapted—a railing becomes a display, a tree anchors shade, a threshold turns into a workspace. Eight representative cases illustrate this choreography of everyday appropriation—21% of use is highly controlled, 67% allows flexible negotiation, and 22% exhibits casual, spontaneous appropriation.
          </p>
        </div>
      </ExhibitSection>

      {/* Setting and Materiality */}
      <ExhibitSection id="setting" title="Setting and Materiality">
        <div className="grid md:grid-cols-2 gap-8">
          <img src={settingMateriality} alt="Setting and Materiality of the Street" className="w-full h-auto rounded-sm" />
          <div className="flex flex-col justify-center">
            <p className="exhibit-body mb-4">
              The mapping examines how sidewalks interact with the adjoining built and unbuilt environment, revealing them as dynamic, negotiated zones rather than mere transit spaces. Sidewalks are continually reshaped by street activities—shop spillovers, vehicular and temporary encroachments, producing elements such as balustrades, signage, and shade-giving infrastructure.
            </p>
            <p className="exhibit-body">
              The study identifies distinct "settings" that emerge through the interplay of permanent and temporary elements and built form: chairs, tables, signboards become tools for informal spatial negotiation. Physical features—drainage heights, concrete blocks, and HT panels—anchor these evolving micro-environments, often linked to power lines. Materiality plays a crucial role: from the solidity of built edges to ephemeral zones. Together, these negotiations shape the street's living infrastructure.
            </p>
          </div>
        </div>
      </ExhibitSection>

      {/* Planned / "Planned" */}
      <ExhibitSection id="planned" title="Planned / &quot;Planned&quot;" className="bg-secondary/10">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center order-2 md:order-1">
            <p className="exhibit-body mb-4">
              This map compares two neighboring parts of Bangalore, Yelahanka's New Town, developed as the early 1980s by the Karnataka Housing Board as a planned township, and the more recent, private-sector Puttanhalli Road beyond Puttenahalli Lake.
            </p>
            <p className="exhibit-body">
              Yelahanka New Town is defined by its open, non-gated neighborhoods and a spatial continuity that allows direct access from house to street, from one street to another. The new gated complexes embody a model of urban living based on boundedness—each one encircled, self-contained. These enclaves function as isolated fragments within the urban fabric, limiting social interaction, blurring the collective sense of neighborhood that once defined Yelahanka's planned community.
            </p>
          </div>
          <img src={planned} alt="Planned versus Planned Urban Development" className="w-full h-auto rounded-sm order-1 md:order-2" />
        </div>
      </ExhibitSection>

      {/* Urban Futures */}
      <ExhibitSection id="urban-futures" title="Urban Futures">
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <img src={urbanFutures1} alt="Urban Futures Vision" className="w-full h-auto rounded-sm" />
            <div className="flex flex-col justify-center">
              <h3 className="font-serif text-2xl text-primary mb-4">A Street is Not a Street</h3>
              <p className="exhibit-body mb-4">
                The modern city was born from the machine's rhythm—a vision without rest. Factories separated home from work, and the logic of movement between the two places became a critical element. The street, once a site of encounter, was flattened into a line on a tracing paper.
              </p>
              <p className="exhibit-body">
                In India, this idea meets resistance. Here, the street refuses abstraction. It is rubbed, shaped, and claimed by life—by vendors, walkers, shadows, and sounds. What the plan calls infrastructure, the city calls habitation. The street becomes a theatre of everyday life—a dialectic of movement and rest. What planners call encroachment, the city calls improvisation.
              </p>
            </div>
          </div>
          
          <div className="text-center py-8">
            <p className="exhibit-body max-w-3xl mx-auto mb-6">
              What seems disorder is a continuous negotiation. Mapping Yelahanka Streets traces this vitality through six visual essays. Each map reads the street as a theatre of everyday life—not by design alone, but by gesture, negotiation, and time.
            </p>
            <p className="exhibit-body max-w-3xl mx-auto italic">
              The maps reveal the street as a living entity—shaped by movement, public and everyday negotiations. They articulate how people, materials, and time choreograph the streets, showing that vitality is not a relic of the past, but an ongoing urban choreography: where permanence and adaptability coexist to sustain Yelahanka's social, economic, and sensory life.
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="font-serif text-xl text-primary mb-6 text-center">Research Team</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="exhibit-body">
                <p className="font-semibold">Hamza Lateque</p>
                <p className="text-sm text-muted-foreground">Principal Investigator</p>
              </div>
              <div className="exhibit-body">
                <p className="font-semibold">Tanay Sinha</p>
                <p className="text-sm text-muted-foreground">Research Associate</p>
              </div>
              <div className="exhibit-body">
                <p className="font-semibold">Neil Nair</p>
                <p className="text-sm text-muted-foreground">Research Associate</p>
              </div>
              <div className="exhibit-body">
                <p className="font-semibold">Kiran Kumar</p>
                <p className="text-sm text-muted-foreground">Research Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </ExhibitSection>
    </div>
  );
};

export default Exhibition;

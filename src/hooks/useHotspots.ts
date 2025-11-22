import { useMemo } from "react";

import commercialProximity from "@/assets/commercial-proximity.jpg";
import openGated from "@/assets/open-gated.jpg";
import spectrumAppropriation from "@/assets/spectrum-appropriation.jpg";
import urbanFutures from "@/assets/urban-futures-1.jpg";
import walkLife from "@/assets/walk-life-inventory.jpg";

export type HotspotThemeKey = "open" | "commerce" | "walk" | "spectrum" | "future";

export interface HotspotZone {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  description: string;
  media?: string;
  tags?: string[];
  theme: HotspotThemeKey;
  summary?: string;
  size?: [number, number, number];
}

const DATA: readonly HotspotZone[] = [
  {
    id: "open-porous",
    name: "Porous Street",
    position: [-6.6, 0.6, -3.2],
    color: "#cbbba5",
    description: "Low-rise verandahs open straight onto the street, letting domestic life soften the public threshold.",
    media: openGated,
    tags: ["porosity", "threshold"],
    theme: "open",
    summary: "Open streets fold into front yards, sustaining a gentle threshold between home and commons.",
    size: [2.6, 0.8, 1.8]
  },
  {
    id: "open-gated",
    name: "Gated Edge",
    position: [-3.4, 0.6, -1.6],
    color: "#dccbb6",
    description: "Walls, guards and boom barriers choreograph a controlled entry, muting the shared rhythm of the lane.",
    media: openGated,
    tags: ["security", "edge"],
    theme: "open",
    size: [1.6, 0.7, 1.2]
  },
  {
    id: "commerce-anchor",
    name: "Civic Anchor",
    position: [1.6, 0.75, -2.6],
    color: "#b7c7d9",
    description: "A bank stabilises the street cadence; vendors sync with opening hours to claim the spillover zone.",
    media: commercialProximity,
    tags: ["anchor", "wayfinding"],
    theme: "commerce",
    summary: "Permanent anchors generate reliable pulses that informal traders ride.",
    size: [2.1, 0.9, 1.4]
  },
  {
    id: "commerce-court",
    name: "Street Court",
    position: [3.4, 0.6, -0.7],
    color: "#d7dde6",
    description: "Awnings, tarps and shelving convert a setback into a covered micro-courtyard of trade.",
    tags: ["shade", "informal"],
    media: commercialProximity,
    theme: "commerce",
    size: [1.5, 0.65, 1.6]
  },
  {
    id: "walk-pause",
    name: "Pause Point",
    position: [0.9, 0.55, 2.5],
    color: "#cedeb8",
    description: "A rain tree and low plinth invite seated pauses; the pedestrian corridor slows into conversation.",
    media: walkLife,
    tags: ["shade", "collective rest"],
    theme: "walk",
    summary: "Movement and stillness entwine as walkers claim places to dwell.",
    size: [1.4, 0.6, 1.2]
  },
  {
    id: "walk-katte",
    name: "Katte Theatre",
    position: [2.5, 0.7, 3.6],
    color: "#dce8c9",
    description: "Evenings gather around the corner katte — cycles, debate, vendors and after-school play.",
    media: walkLife,
    tags: ["community", "ritual"],
    theme: "walk",
    size: [1.8, 0.75, 1.6]
  },
  {
    id: "spectrum-threshold",
    name: "Negotiated Threshold",
    position: [5.1, 0.5, 1.1],
    color: "#d9c8b2",
    description: "Grills become hanging rails, steps double as display; property lines flex with daily need.",
    media: spectrumAppropriation,
    tags: ["appropriation", "edge"],
    theme: "spectrum",
    summary: "Thresholds are rehearsed daily — neither public nor private, but continually renegotiated.",
    size: [1.6, 0.55, 2.3]
  },
  {
    id: "future-garden",
    name: "Civic Garden Prototype",
    position: [-0.9, 0.6, 5.4],
    color: "#bfd0e5",
    description: "Storm-water terraces imagine an amphitheatre for future markets and community rituals.",
    media: urbanFutures,
    tags: ["speculative", "blue-green"],
    theme: "future",
    summary: "Future civic gestures braid ecology, leisure and market life.",
    size: [2, 0.7, 1.8]
  }
];

export const useHotspots = () => {
  const orderedZones = useMemo(() => DATA.slice(), []);

  const zonesByTheme = useMemo(() => {
    return orderedZones.reduce<Record<HotspotThemeKey, HotspotZone[]>>(
      (acc, zone) => {
        acc[zone.theme].push(zone);
        return acc;
      },
      {
        open: [],
        commerce: [],
        walk: [],
        spectrum: [],
        future: []
      }
    );
  }, [orderedZones]);

  return { orderedZones, zonesByTheme };
};

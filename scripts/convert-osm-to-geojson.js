#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_HEIGHT_METERS = 9;
const LEVEL_HEIGHT_METERS = 3.2;

const inputArg = process.argv[2];
const outputArg = process.argv[3];
const inputPath = inputArg ? path.resolve(process.cwd(), inputArg) : path.resolve("public/data/buildings.geojson");
const outputPath = outputArg ? path.resolve(process.cwd(), outputArg) : path.resolve("public/data/buildings_feature_collection.geojson");

function ensureClosedRing(coords) {
  if (coords.length === 0) return coords;
  const [firstLon, firstLat] = coords[0];
  const [lastLon, lastLat] = coords[coords.length - 1];
  if (firstLon !== lastLon || firstLat !== lastLat) {
    coords.push([firstLon, firstLat]);
  }
  return coords;
}

function parseFloatOrUndefined(value) {
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const numeric = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function deriveHeight(tags) {
  const heightValue = parseFloatOrUndefined(tags?.height ?? tags?.["building:height"]);
  if (heightValue) return heightValue;

  const levels = parseFloatOrUndefined(tags?.["building:levels"] ?? tags?.levels);
  if (levels) {
    return Math.max(levels * LEVEL_HEIGHT_METERS, DEFAULT_HEIGHT_METERS);
  }

  return DEFAULT_HEIGHT_METERS;
}

async function main() {
  const raw = await readFile(inputPath, "utf8");
  const osm = JSON.parse(raw);

  if (!Array.isArray(osm.elements)) {
    throw new Error("Unexpected OSM export format: missing elements array");
  }

  const nodeIndex = new Map();
  const wayIndex = new Map();

  for (const element of osm.elements) {
    if (element.type === "node" && typeof element.id === "number") {
      nodeIndex.set(element.id, [element.lon, element.lat]);
    }
  }

  function buildWayCoordinates(way) {
    if (!Array.isArray(way.nodes)) return null;
    const coords = [];
    for (const nodeId of way.nodes) {
      const nodeCoords = nodeIndex.get(nodeId);
      if (!nodeCoords) {
        return null;
      }
      coords.push(nodeCoords);
    }
    if (coords.length < 3) return null;
    return ensureClosedRing(coords);
  }

  for (const element of osm.elements) {
    if (element.type === "way") {
      const coords = buildWayCoordinates(element);
      if (coords) {
        wayIndex.set(element.id, coords);
      }
    }
  }

  const features = [];

  for (const element of osm.elements) {
    if (element.type === "way") {
      const tags = element.tags ?? {};
      if (!tags.building) continue;
      const coords = wayIndex.get(element.id);
      if (!coords) continue;
      features.push({
        type: "Feature",
        id: element.id,
        geometry: {
          type: "Polygon",
          coordinates: [coords]
        },
        properties: {
          ...tags,
          buildingHeight: Number(deriveHeight(tags).toFixed(2)),
          buildingLevels: parseFloatOrUndefined(tags["building:levels"] ?? tags.levels)
        }
      });
    }

    if (element.type === "relation") {
      const tags = element.tags ?? {};
      if (!tags.building) continue;
      if (!Array.isArray(element.members)) continue;

      const outers = [];
      const inners = [];

      for (const member of element.members) {
        if (member.type !== "way") continue;
        const coords = wayIndex.get(member.ref);
        if (!coords) continue;
        if (member.role === "inner") {
          inners.push(coords);
        } else {
          outers.push(coords);
        }
      }

      if (!outers.length) continue;

      if (outers.length === 1) {
        features.push({
          type: "Feature",
          id: element.id,
          geometry: {
            type: "Polygon",
            coordinates: [outers[0], ...inners]
          },
          properties: {
            ...tags,
            buildingHeight: Number(deriveHeight(tags).toFixed(2)),
            buildingLevels: parseFloatOrUndefined(tags["building:levels"] ?? tags.levels)
          }
        });
      } else {
        const multiPolygonCoords = outers.map((outer) => {
          const holes = inners.length ? inners : [];
          return [outer, ...holes];
        });

        features.push({
          type: "Feature",
          id: element.id,
          geometry: {
            type: "MultiPolygon",
            coordinates: multiPolygonCoords
          },
          properties: {
            ...tags,
            buildingHeight: Number(deriveHeight(tags).toFixed(2)),
            buildingLevels: parseFloatOrUndefined(tags["building:levels"] ?? tags.levels)
          }
        });
      }
    }
  }

  const featureCollection = {
    type: "FeatureCollection",
    name: "Yelahanka Buildings",
    metadata: {
      source: "OpenStreetMap via Overpass API",
      generatedAt: new Date().toISOString(),
      inputFile: path.relative(process.cwd(), inputPath),
      totalFeatures: features.length
    },
    features
  };

  await writeFile(outputPath, JSON.stringify(featureCollection, null, 2));
  console.log(`Converted ${features.length} building features to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

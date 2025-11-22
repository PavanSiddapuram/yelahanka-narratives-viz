import { useEffect, useMemo, useState } from "react";
import { Path, Shape, Vector2 } from "three";

import {
  calculateFootprintBounds,
  extractBuildingFootprints,
  type BuildingFootprint,
  type BuildingPolygon,
  type FootprintBounds
} from "@/lib/buildings";
import { createProjection, projectLonLat, type ProjectionConfig } from "@/lib/geo";

const DEFAULT_DATA_URL = "/data/buildings_feature_collection.geojson";
const DEFAULT_LIMIT = 800;
const DEFAULT_TARGET_SPAN_UNITS = 48;
const DEFAULT_MIN_HEIGHT_UNITS = 0.6;

export interface BuildingShapeInstance {
  shape: Shape;
  position: [number, number];
}

export interface BuildingExtrusion {
  id?: number | string;
  shapes: BuildingShapeInstance[];
  height: number;
  heightMeters: number;
  levels?: number;
  tags: Record<string, unknown>;
}

interface UseBuildingExtrusionsOptions {
  dataUrl?: string;
  maxFeatures?: number;
  targetSpanUnits?: number;
  minHeightUnits?: number;
}

type LoaderStatus = "idle" | "loading" | "success" | "error";

interface UseBuildingExtrusionsResult {
  status: LoaderStatus;
  error?: string;
  extrusions: BuildingExtrusion[];
  projection: ProjectionConfig | null;
  bounds: FootprintBounds | null;
  footprintsCount: number;
}

const toVectors = (ring: number[][], projection: ProjectionConfig): Vector2[] => {
  if (!ring.length) return [];
  const closed = ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1];
  const source = closed && ring.length > 3 ? ring.slice(0, -1) : ring;
  const vectors: Vector2[] = [];

  for (const coordinate of source) {
    if (!Array.isArray(coordinate) || coordinate.length < 2) continue;
    const lon = Number(coordinate[0]);
    const lat = Number(coordinate[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
    const [x, z] = projectLonLat(lon, lat, projection);
    vectors.push(new Vector2(x, z));
  }

  return vectors;
};

const computeCentroid = (vectors: Vector2[]): [number, number] | null => {
  if (!vectors.length) return null;
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minZ = Number.POSITIVE_INFINITY;
  let maxZ = Number.NEGATIVE_INFINITY;

  for (const { x, y: z } of vectors) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minZ)) {
    return null;
  }

  return [(minX + maxX) / 2, (minZ + maxZ) / 2];
};

const convertPolygonToShapeInstances = (
  polygon: BuildingPolygon,
  projection: ProjectionConfig
): BuildingShapeInstance | null => {
  const outerVectors = toVectors(polygon.outer, projection);
  if (outerVectors.length < 3) return null;

  const centroid = computeCentroid(outerVectors);
  if (!centroid) return null;
  const [centerX, centerZ] = centroid;

  const shiftedOuter = outerVectors.map((vector) => new Vector2(vector.x - centerX, vector.y - centerZ));
  const shape = new Shape(shiftedOuter);

  for (const hole of polygon.holes) {
    const holeVectors = toVectors(hole, projection);
    if (holeVectors.length < 3) continue;
    const shiftedHole = holeVectors.map((vector) => new Vector2(vector.x - centerX, vector.y - centerZ));
    const path = new Path(shiftedHole);
    shape.holes.push(path);
  }

  return {
    shape,
    position: [centerX, centerZ]
  };
};

const determineScale = (bounds: FootprintBounds, targetSpanUnits: number): number => {
  const origin = {
    lon: (bounds.minLon + bounds.maxLon) / 2,
    lat: (bounds.minLat + bounds.maxLat) / 2
  };

  const widthLon = bounds.maxLon - bounds.minLon;
  const heightLat = bounds.maxLat - bounds.minLat;
  const widthMeters = Math.max(Math.abs(widthLon) * 111320 * Math.cos((origin.lat * Math.PI) / 180), 1);
  const heightMeters = Math.max(Math.abs(heightLat) * 110574, 1);
  const dominantMeters = Math.max(widthMeters, heightMeters, 1);

  return targetSpanUnits / dominantMeters;
};

const convertFootprintsToExtrusions = (
  footprints: BuildingFootprint[],
  projection: ProjectionConfig,
  metersToUnits: number,
  minHeightUnits: number
): BuildingExtrusion[] => {
  const extrusions: BuildingExtrusion[] = [];

  for (const footprint of footprints) {
    const shapes: BuildingShapeInstance[] = [];

    for (const polygon of footprint.polygons) {
      const instance = convertPolygonToShapeInstances(polygon, projection);
      if (instance) {
        shapes.push(instance);
      }
    }

    if (!shapes.length) continue;

    const heightUnits = Math.max(footprint.height * metersToUnits, minHeightUnits);

    extrusions.push({
      id: footprint.id,
      shapes,
      height: heightUnits,
      heightMeters: footprint.height,
      levels: footprint.levels,
      tags: footprint.tags
    });
  }

  return extrusions;
};

export const useBuildingExtrusions = (
  options: UseBuildingExtrusionsOptions = {}
): UseBuildingExtrusionsResult => {
  const [status, setStatus] = useState<LoaderStatus>("idle");
  const [error, setError] = useState<string | undefined>();
  const [payload, setPayload] = useState<{
    extrusions: BuildingExtrusion[];
    bounds: FootprintBounds | null;
    projection: ProjectionConfig | null;
    footprintsCount: number;
  }>({ extrusions: [], bounds: null, projection: null, footprintsCount: 0 });

  const { dataUrl = DEFAULT_DATA_URL, maxFeatures = DEFAULT_LIMIT, targetSpanUnits = DEFAULT_TARGET_SPAN_UNITS, minHeightUnits = DEFAULT_MIN_HEIGHT_UNITS } = options;

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const load = async () => {
      setStatus("loading");
      setError(undefined);

      try {
        const response = await fetch(dataUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to load buildings data (${response.status})`);
        }

        const json = (await response.json()) as unknown;
        const collection = json as unknown as { type?: string };
        if (!collection || collection.type !== "FeatureCollection") {
          throw new Error("Unexpected GeoJSON structure");
        }

        const footprints = extractBuildingFootprints(json as any, { maxFeatures });
        const bounds = calculateFootprintBounds(footprints);
        if (!bounds) {
          throw new Error("Unable to derive footprint bounds");
        }

        const origin = {
          lon: (bounds.minLon + bounds.maxLon) / 2,
          lat: (bounds.minLat + bounds.maxLat) / 2
        };
        const metersToUnits = determineScale(bounds, targetSpanUnits);
        const projection = createProjection(origin, metersToUnits);
        const extrusions = convertFootprintsToExtrusions(footprints, projection, metersToUnits, minHeightUnits);

        if (!isActive) return;

        setPayload({
          extrusions,
          bounds,
          projection,
          footprintsCount: footprints.length
        });
        setStatus("success");
      } catch (err) {
        if (!isActive) return;
        if ((err as Error).name === "AbortError") {
          return;
        }
        setError((err as Error).message ?? "Failed to load building data");
        setStatus("error");
      }
    };

    load();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [dataUrl, maxFeatures, targetSpanUnits, minHeightUnits]);

  const extrusions = useMemo(() => payload.extrusions, [payload.extrusions]);

  return {
    status,
    error,
    extrusions,
    projection: payload.projection,
    bounds: payload.bounds,
    footprintsCount: payload.footprintsCount
  };
};

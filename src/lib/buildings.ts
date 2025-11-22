export interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features?: GeoJsonFeature[];
}

export interface GeoJsonFeature {
  type: "Feature";
  id?: number | string;
  geometry?: GeoJsonGeometry | null;
  properties?: Record<string, unknown>;
}

export type GeoJsonPosition = readonly [number, number];
export type GeoJsonLinearRing = readonly GeoJsonPosition[];
export type GeoJsonPolygon = readonly GeoJsonLinearRing[];

export type GeoJsonGeometry =
  | { type: "Polygon"; coordinates: GeoJsonPolygon }
  | { type: "MultiPolygon"; coordinates: readonly GeoJsonPolygon[] };

export interface BuildingPolygon {
  outer: number[][];
  holes: number[][][];
}

export interface BuildingFootprint {
  id?: number | string;
  polygons: BuildingPolygon[];
  height: number;
  levels?: number;
  tags: Record<string, unknown>;
}

export interface FootprintBounds {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
}

const MINIMUM_HEIGHT_METERS = 3.5;

const coerceNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const normaliseRing = (ring: GeoJsonLinearRing): number[][] => {
  const points: number[][] = [];
  for (const pair of ring) {
    if (!Array.isArray(pair) || pair.length < 2) continue;
    const lon = coerceNumber(pair[0]);
    const lat = coerceNumber(pair[1]);
    if (lon === undefined || lat === undefined) continue;
    if (points.length === 0 || points[points.length - 1][0] !== lon || points[points.length - 1][1] !== lat) {
      points.push([lon, lat]);
    }
  }

  if (points.length < 3) {
    return [];
  }

  const [firstLon, firstLat] = points[0];
  const [lastLon, lastLat] = points[points.length - 1];
  if (firstLon !== lastLon || firstLat !== lastLat) {
    points.push([firstLon, firstLat]);
  }

  return points;
};

export const calculateFootprintBounds = (footprints: BuildingFootprint[]): FootprintBounds | null => {
  let minLon = Number.POSITIVE_INFINITY;
  let maxLon = Number.NEGATIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  let hasPoints = false;

  for (const footprint of footprints) {
    for (const polygon of footprint.polygons) {
      const rings = [polygon.outer, ...polygon.holes];
      for (const ring of rings) {
        for (const pair of ring) {
          if (!Array.isArray(pair) || pair.length < 2) continue;
          const lon = coerceNumber(pair[0]);
          const lat = coerceNumber(pair[1]);
          if (lon === undefined || lat === undefined) continue;
          minLon = Math.min(minLon, lon);
          maxLon = Math.max(maxLon, lon);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
          hasPoints = true;
        }
      }
    }
  }

  if (!hasPoints) {
    return null;
  }

  return { minLon, maxLon, minLat, maxLat };
};

const geometryToPolygons = (geometry: GeoJsonGeometry): BuildingPolygon[] => {
  if (geometry.type === "Polygon") {
    const polygon = geometry.coordinates;
    const outerRing = polygon[0];
    if (!outerRing) return [];
    const outer = normaliseRing(outerRing);
    if (outer.length === 0) return [];
    const holes = polygon
      .slice(1)
      .map((ring) => normaliseRing(ring))
      .filter((ring) => ring.length >= 3);
    return [{ outer, holes }];
  }

  if (geometry.type === "MultiPolygon") {
    const polygons = geometry.coordinates;
    const result: BuildingPolygon[] = [];
    for (const poly of polygons) {
      const outerRing = poly[0];
      if (!outerRing) continue;
      const outer = normaliseRing(outerRing);
      if (outer.length === 0) continue;
      const holes = poly
        .slice(1)
        .map((ring) => normaliseRing(ring))
        .filter((ring) => ring.length >= 3);
      result.push({ outer, holes });
    }
    return result;
  }

  return [];
};

export const extractBuildingFootprints = (collection: GeoJsonFeatureCollection, options?: { maxFeatures?: number }): BuildingFootprint[] => {
  const limit = options?.maxFeatures;
  const footprints: BuildingFootprint[] = [];

  for (const feature of collection.features ?? []) {
    if (!feature || !feature.geometry) continue;

    const polygons = geometryToPolygons(feature.geometry).filter((poly) => poly.outer.length >= 4);
    if (!polygons.length) continue;

    const tags = feature.properties ?? {};
    const height = coerceNumber(tags.buildingHeight ?? tags.height ?? tags["building:height"]);
    const levels = coerceNumber(tags.buildingLevels ?? tags["building:levels"] ?? tags.levels);
    const calcHeight = height ?? (levels ? Math.max(levels * 3.2, MINIMUM_HEIGHT_METERS) : undefined);
    if (!calcHeight || calcHeight < MINIMUM_HEIGHT_METERS) continue;

    footprints.push({
      id: feature.id,
      polygons,
      height: calcHeight,
      levels: levels ?? undefined,
      tags
    });

    if (limit && footprints.length >= limit) {
      break;
    }
  }

  return footprints;
};

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
export type GeoJsonLineString = readonly GeoJsonPosition[];

export type GeoJsonGeometry =
  | { type: "LineString"; coordinates: GeoJsonLineString }
  | { type: "MultiLineString"; coordinates: readonly GeoJsonLineString[] };

export interface RoadSegment {
  id?: number | string;
  lines: number[][][]; // [ [lon, lat][], ...]
  tags: Record<string, unknown>;
}

const coerceNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const geometryToLines = (geometry: GeoJsonGeometry | undefined | null): number[][][] => {
  if (!geometry) return [];
  if (geometry.type === "LineString") {
    const ring = geometry.coordinates;
    const line: number[][] = [];
    for (const pair of ring) {
      const lon = coerceNumber(pair[0]);
      const lat = coerceNumber(pair[1]);
      if (lon === undefined || lat === undefined) continue;
      line.push([lon, lat]);
    }
    return line.length >= 2 ? [line] : [];
  }

  if (geometry.type === "MultiLineString") {
    const result: number[][][] = [];
    for (const ring of geometry.coordinates) {
      const line: number[][] = [];
      for (const pair of ring) {
        const lon = coerceNumber(pair[0]);
        const lat = coerceNumber(pair[1]);
        if (lon === undefined || lat === undefined) continue;
        line.push([lon, lat]);
      }
      if (line.length >= 2) {
        result.push(line);
      }
    }
    return result;
  }

  return [];
};

export const extractRoadSegments = (collection: GeoJsonFeatureCollection, options?: { maxFeatures?: number }): RoadSegment[] => {
  const limit = options?.maxFeatures;
  const segments: RoadSegment[] = [];

  for (const feature of collection.features ?? []) {
    if (!feature || !feature.geometry) continue;
    const lines = geometryToLines(feature.geometry);
    if (!lines.length) continue;

    segments.push({
      id: feature.id,
      lines,
      tags: feature.properties ?? {}
    });

    if (limit && segments.length >= limit) break;
  }

  return segments;
};

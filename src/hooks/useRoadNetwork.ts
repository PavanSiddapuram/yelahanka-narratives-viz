import { useEffect, useMemo, useState } from "react";
import { Vector3 } from "three";

import type { ProjectionConfig } from "@/lib/geo";
import { projectLonLat } from "@/lib/geo";
import { extractRoadSegments, type GeoJsonFeatureCollection, type RoadSegment } from "@/lib/roads";

const DEFAULT_DATA_URL = "/data/roads_feature_collection.geojson";
const DEFAULT_LIMIT = 800;

export interface RoadPolyline {
  id?: number | string;
  points: Vector3[];
}

type LoaderStatus = "idle" | "loading" | "success" | "error";

interface UseRoadNetworkOptions {
  dataUrl?: string;
  maxFeatures?: number;
}

interface UseRoadNetworkResult {
  status: LoaderStatus;
  error?: string;
  polylines: RoadPolyline[];
}

const convertSegmentsToPolylines = (segments: RoadSegment[], projection: ProjectionConfig): RoadPolyline[] => {
  const polylines: RoadPolyline[] = [];

  for (const segment of segments) {
    for (const line of segment.lines) {
      const points: Vector3[] = [];
      for (const [lon, lat] of line) {
        const [x, z] = projectLonLat(lon, lat, projection);
        points.push(new Vector3(x, 0.02, z));
      }
      if (points.length >= 2) {
        polylines.push({ id: segment.id, points });
      }
    }
  }

  return polylines;
};

export const useRoadNetwork = (
  projection: ProjectionConfig | null,
  options: UseRoadNetworkOptions = {}
): UseRoadNetworkResult => {
  const [status, setStatus] = useState<LoaderStatus>("idle");
  const [error, setError] = useState<string | undefined>();
  const [segments, setSegments] = useState<RoadSegment[]>([]);

  const { dataUrl = DEFAULT_DATA_URL, maxFeatures = DEFAULT_LIMIT } = options;

  useEffect(() => {
    if (!projection) return;

    let isActive = true;
    const controller = new AbortController();

    const load = async () => {
      setStatus("loading");
      setError(undefined);

      try {
        const response = await fetch(dataUrl, { signal: controller.signal });
        if (!response.ok) throw new Error(`Failed to load roads data (${response.status})`);

        const json = (await response.json()) as unknown as GeoJsonFeatureCollection;
        if (!json || json.type !== "FeatureCollection") {
          throw new Error("Unexpected roads GeoJSON structure");
        }

        const extracted = extractRoadSegments(json, { maxFeatures });
        if (!isActive) return;
        setSegments(extracted);
        setStatus("success");
      } catch (err) {
        if (!isActive) return;
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message ?? "Failed to load road data");
        setStatus("error");
      }
    };

    load();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [dataUrl, maxFeatures, projection]);

  const polylines = useMemo(() => {
    if (!projection) return [];
    return convertSegmentsToPolylines(segments, projection);
  }, [segments, projection]);

  return { status, error, polylines };
};

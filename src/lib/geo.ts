const DEG_TO_RAD = Math.PI / 180;

export interface LonLat {
  lon: number;
  lat: number;
}

export interface ProjectionConfig {
  origin: LonLat;
  metersToUnits: number;
}

const METERS_PER_DEGREE_LAT = 110574; // Average, adequate for small extents

export const createProjection = (origin: LonLat, metersToUnits: number): ProjectionConfig => ({
  origin,
  metersToUnits
});

export const projectLonLat = (lon: number, lat: number, config: ProjectionConfig): [number, number] => {
  const { origin, metersToUnits } = config;
  const deltaLon = lon - origin.lon;
  const deltaLat = lat - origin.lat;

  const metersPerDegreeLon = 111320 * Math.cos(origin.lat * DEG_TO_RAD);

  const xMeters = deltaLon * metersPerDegreeLon;
  const yMeters = deltaLat * METERS_PER_DEGREE_LAT;

  const x = xMeters * metersToUnits;
  const z = -yMeters * metersToUnits; // invert so north points towards -Z

  return [x, z];
};

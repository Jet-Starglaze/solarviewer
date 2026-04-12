export interface SolarFact {
  label: string;
  value: string;
}

interface BaseSolarBodyData {
  id: string;
  name: string;
  type: string;
  description: string;
  color: string;
  radius: number;
  facts: SolarFact[];
}

export interface SolarStarData extends BaseSolarBodyData {
  kind: "star";
  glowColor: string;
  texturePath: string;
  position: [number, number, number];
}

export interface OrbitingPlanetData extends BaseSolarBodyData {
  kind: "planet";
  texturePath: string;
  orbitDistanceAU: number;
  orbitSpeed: number;
  initialAngle: number;
}

export type SolarBodyData = SolarStarData | OrbitingPlanetData;

import type {
  OrbitingPlanetData,
  SolarStarData
} from "@/types/solar-system";

const INNERMOST_ORBIT_AU = 0.39;
const OUTERMOST_ORBIT_AU = 30.05;

export const MIN_RENDER_ORBIT_RADIUS = 4.4;
export const MAX_RENDER_ORBIT_RADIUS = 23.6;

export function getCompressedOrbitRadius(orbitDistanceAU: number) {
  const normalizedLog =
    (Math.log10(orbitDistanceAU) - Math.log10(INNERMOST_ORBIT_AU)) /
    (Math.log10(OUTERMOST_ORBIT_AU) - Math.log10(INNERMOST_ORBIT_AU));

  return (
    MIN_RENDER_ORBIT_RADIUS +
    normalizedLog * (MAX_RENDER_ORBIT_RADIUS - MIN_RENDER_ORBIT_RADIUS)
  );
}

export const sun: SolarStarData = {
  id: "sun",
  kind: "star",
  name: "Sun",
  type: "G-Type Main-Sequence Star",
  description:
    "The Sun is the radiant heart of this stylized system, anchoring the scene with heat, light, and the gravity that holds every orbit together.",
  color: "#fbbf24",
  glowColor: "#fb923c",
  texturePath: "/textures/sun.jpg",
  radius: 2.5,
  position: [0, 0, 0],
  facts: [
    { label: "Age", value: "About 4.6B years" },
    { label: "Surface", value: "Photosphere of hot plasma" },
    { label: "Temperature", value: "About 5,500 C" },
    { label: "Role", value: "Central star of the solar system" }
  ]
};

export const planets: OrbitingPlanetData[] = [
  {
    id: "mercury",
    kind: "planet",
    name: "Mercury",
    type: "Terrestrial",
    description:
      "The smallest planet in the solar system, Mercury races around the Sun with a stark, cratered surface and dramatic temperature swings.",
    color: "#9ca3af",
    texturePath: "/textures/mercury.jpg",
    radius: 0.6,
    orbitDistanceAU: 0.39,
    orbitSpeed: 0.52,
    initialAngle: 5.1,
    facts: [
      { label: "Orbit Length", value: "88 Earth days" },
      { label: "Moons", value: "0" },
      { label: "Day Length", value: "59 Earth days" },
      { label: "Atmosphere", value: "Very thin exosphere" }
    ]
  },
  {
    id: "venus",
    kind: "planet",
    name: "Venus",
    type: "Terrestrial",
    description:
      "Venus is wrapped in dense clouds and a runaway greenhouse atmosphere, making it the hottest planet in the solar system.",
    color: "#f5c48d",
    texturePath: "/textures/venus.jpg",
    radius: 0.95,
    orbitDistanceAU: 0.72,
    orbitSpeed: 0.42,
    initialAngle: 0.65,
    facts: [
      { label: "Orbit Length", value: "225 Earth days" },
      { label: "Moons", value: "0" },
      { label: "Day Length", value: "243 Earth days" },
      { label: "Surface", value: "Rocky volcanic plains" }
    ]
  },
  {
    id: "earth",
    kind: "planet",
    name: "Earth",
    type: "Terrestrial",
    description:
      "Earth is the only known world with liquid water oceans and life, featuring an active climate, plate tectonics, and a protective atmosphere.",
    color: "#60a5fa",
    texturePath: "/textures/earth.jpg",
    radius: 1,
    orbitDistanceAU: 1,
    orbitSpeed: 0.35,
    initialAngle: 1.38,
    facts: [
      { label: "Orbit Length", value: "365 days" },
      { label: "Moons", value: "1" },
      { label: "Day Length", value: "24 hours" },
      { label: "Notable", value: "Liquid surface water" }
    ]
  },
  {
    id: "mars",
    kind: "planet",
    name: "Mars",
    type: "Terrestrial",
    description:
      "Mars is a cold desert planet known for its rust-red dust, giant volcanoes, and evidence that liquid water once flowed across its surface.",
    color: "#f97316",
    texturePath: "/textures/mars.jpg",
    radius: 0.72,
    orbitDistanceAU: 1.52,
    orbitSpeed: 0.3,
    initialAngle: 2.15,
    facts: [
      { label: "Orbit Length", value: "687 Earth days" },
      { label: "Moons", value: "2" },
      { label: "Day Length", value: "24.6 hours" },
      { label: "Notable", value: "Olympus Mons" }
    ]
  },
  {
    id: "jupiter",
    kind: "planet",
    name: "Jupiter",
    type: "Gas Giant",
    description:
      "Jupiter is the largest planet, a swirling gas giant with powerful storms, including the Great Red Spot, and an enormous magnetic field.",
    color: "#d6b084",
    texturePath: "/textures/jupiter.jpg",
    radius: 1.85,
    orbitDistanceAU: 5.2,
    orbitSpeed: 0.22,
    initialAngle: 2.9,
    facts: [
      { label: "Orbit Length", value: "11.9 Earth years" },
      { label: "Moons", value: "95+" },
      { label: "Day Length", value: "9.9 hours" },
      { label: "Storm", value: "Great Red Spot" }
    ]
  },
  {
    id: "saturn",
    kind: "planet",
    name: "Saturn",
    type: "Gas Giant",
    description:
      "Saturn is famous for its majestic ring system and low density, with a golden atmosphere striped by winds and storms.",
    color: "#f4d58d",
    texturePath: "/textures/saturn.jpg",
    radius: 1.6,
    orbitDistanceAU: 9.58,
    orbitSpeed: 0.18,
    initialAngle: 3.62,
    facts: [
      { label: "Orbit Length", value: "29.5 Earth years" },
      { label: "Moons", value: "140+" },
      { label: "Day Length", value: "10.7 hours" },
      { label: "Known For", value: "Extensive rings" }
    ]
  },
  {
    id: "uranus",
    kind: "planet",
    name: "Uranus",
    type: "Ice Giant",
    description:
      "Uranus is an icy, pale blue world that rotates on its side, giving it some of the most unusual seasons in the solar system.",
    color: "#7dd3fc",
    texturePath: "/textures/uranus.jpg",
    radius: 1.25,
    orbitDistanceAU: 19.2,
    orbitSpeed: 0.15,
    initialAngle: 4.35,
    facts: [
      { label: "Orbit Length", value: "84 Earth years" },
      { label: "Moons", value: "27" },
      { label: "Day Length", value: "17.2 hours" },
      { label: "Tilt", value: "98 degrees" }
    ]
  },
  {
    id: "neptune",
    kind: "planet",
    name: "Neptune",
    type: "Ice Giant",
    description:
      "Neptune is a deep blue, distant ice giant with supersonic winds and a dynamic atmosphere full of high, bright clouds.",
    color: "#2563eb",
    texturePath: "/textures/neptune.jpg",
    radius: 1.18,
    orbitDistanceAU: 30.05,
    orbitSpeed: 0.13,
    initialAngle: 5.02,
    facts: [
      { label: "Orbit Length", value: "165 Earth years" },
      { label: "Moons", value: "16" },
      { label: "Day Length", value: "16.1 hours" },
      { label: "Winds", value: "Up to 1,200 mph" }
    ]
  }
];

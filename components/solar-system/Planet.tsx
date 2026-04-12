"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { type MutableRefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type {
  OrbitingPlanetData,
  SolarBodyData
} from "@/types/solar-system";

interface OrbitingPlanetRenderData extends OrbitingPlanetData {
  orbitRadius: number;
}

export interface PlanetProps {
  planet: OrbitingPlanetRenderData;
  isSelected: boolean;
  isDimmed: boolean;
  orbitMotionScale: number;
  bodyPositionsRef: MutableRefObject<Record<string, THREE.Vector3>>;
  onSelect: (body: SolarBodyData) => void;
}

interface PlanetSurfaceMaterialProps {
  planet: OrbitingPlanetRenderData;
  surfaceTexture: THREE.Texture | null;
  materialRef: MutableRefObject<THREE.MeshStandardMaterial | null>;
}

function PlanetSurfaceMaterial({
  planet,
  surfaceTexture,
  materialRef
}: PlanetSurfaceMaterialProps) {
  // Future Mercury surface detail: once /textures/mercury-bump.jpg exists,
  // load it alongside the color map and pass bumpMap with bumpScale={0.04} here.
  return (
    <meshStandardMaterial
      key={`${planet.id}-${surfaceTexture ? "textured" : "flat"}`}
      ref={materialRef}
      map={surfaceTexture ?? undefined}
      color={surfaceTexture ? "#ffffff" : planet.color}
      roughness={1}
      metalness={0}
      transparent
      opacity={1}
    />
  );
}

export function Planet({
  planet,
  isSelected,
  isDimmed,
  orbitMotionScale,
  bodyPositionsRef,
  onSelect
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const angleRef = useRef(planet.initialAngle);
  const worldPosition = useRef(new THREE.Vector3());
  const [hovered, setHovered] = useState(false);
  const [surfaceTexture, setSurfaceTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useEffect(() => {
    let isActive = true;
    let loadedTexture: THREE.Texture | null = null;

    setSurfaceTexture(null);

    const loader = new THREE.TextureLoader();

    loader.load(
      planet.texturePath,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;

        if (!isActive) {
          texture.dispose();
          return;
        }

        loadedTexture = texture;
        setSurfaceTexture(texture);
      },
      undefined,
      () => {
        if (isActive) {
          setSurfaceTexture(null);
        }
      }
    );

    return () => {
      isActive = false;

      if (loadedTexture) {
        loadedTexture.dispose();
      }
    };
  }, [planet.texturePath]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const material = materialRef.current;

    if (group) {
      angleRef.current += delta * planet.orbitSpeed * orbitMotionScale;
      group.position.set(
        Math.cos(angleRef.current) * planet.orbitRadius,
        0,
        Math.sin(angleRef.current) * planet.orbitRadius
      );
      group.rotation.y += delta * (0.3 + planet.radius * 0.08);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, hovered ? 0.1 : 0.04, 0.08);

      const targetScale = isSelected ? 1.38 : hovered ? 1.08 : 1;
      const nextScale = THREE.MathUtils.lerp(group.scale.x, targetScale, 0.1);
      group.scale.setScalar(nextScale);

      bodyPositionsRef.current[planet.id] ??= new THREE.Vector3();
      group.getWorldPosition(worldPosition.current);
      bodyPositionsRef.current[planet.id].copy(worldPosition.current);
    }

    if (material) {
      const targetOpacity = isDimmed ? 0.22 : 1;

      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.12);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(planet);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[planet.radius, 64, 64]} />
        <PlanetSurfaceMaterial
          planet={planet}
          surfaceTexture={surfaceTexture}
          materialRef={materialRef}
        />
      </mesh>

      <Html
        position={[0, -(planet.radius + 0.75), 0]}
        center
        distanceFactor={11}
        style={{ pointerEvents: "none" }}
      >
        <div
          className={`rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] transition-all duration-300 ${
            isDimmed
              ? "border-white/10 bg-slate-950/35 text-slate-500"
              : "border-white/15 bg-slate-950/70 text-slate-100 shadow-[0_12px_30px_rgba(2,6,23,0.4)]"
          }`}
        >
          {planet.name}
        </div>
      </Html>
    </group>
  );
}

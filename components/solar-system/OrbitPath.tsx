"use client";

import * as THREE from "three";

interface OrbitPathProps {
  radius: number;
  isActive: boolean;
  isDimmed: boolean;
}

export function OrbitPath({ radius, isActive, isDimmed }: OrbitPathProps) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.04, radius + 0.04, 128]} />
      <meshBasicMaterial
        color={isActive ? "#93c5fd" : "#94a3b8"}
        transparent
        opacity={isDimmed ? 0.08 : isActive ? 0.32 : 0.18}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

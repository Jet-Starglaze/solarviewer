"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import type { SolarBodyData, SolarStarData } from "@/types/solar-system";

interface SunProps {
  body: SolarStarData;
  isSelected: boolean;
  bodyPositionsRef: MutableRefObject<Record<string, THREE.Vector3>>;
  onSelect: (body: SolarBodyData) => void;
}

interface SunSurfaceMaterialProps {
  body: SolarStarData;
  surfaceTexture: THREE.Texture | null;
}

function SunSurfaceMaterial({
  body,
  surfaceTexture
}: SunSurfaceMaterialProps) {
  return surfaceTexture ? (
    <meshBasicMaterial
      key={`${body.id}-textured`}
      map={surfaceTexture}
      color="#ffffff"
      toneMapped={false}
      fog={false}
    />
  ) : (
    <meshBasicMaterial
      key={`${body.id}-flat`}
      color={body.color}
      toneMapped={false}
      fog={false}
    />
  );
}

export function Sun({ body, isSelected, bodyPositionsRef, onSelect }: SunProps) {
  const groupRef = useRef<THREE.Group>(null);
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
      body.texturePath,
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
  }, [body.texturePath]);

  useFrame((state, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.012;
    const targetScale = (isSelected ? 1.03 : 1) * pulse;
    const nextScale = THREE.MathUtils.lerp(group.scale.x, targetScale, 0.08);

    group.scale.setScalar(nextScale);
    group.rotation.y += delta * 0.07;

    bodyPositionsRef.current[body.id] ??= new THREE.Vector3();
    group.getWorldPosition(worldPosition.current);
    bodyPositionsRef.current[body.id].copy(worldPosition.current);
  });

  return (
    <group ref={groupRef} position={body.position}>
      <pointLight intensity={1.3} color="#fdba74" distance={56} decay={2} />

      <mesh>
        <sphereGeometry args={[body.radius, 64, 64]} />
        <SunSurfaceMaterial body={body} surfaceTexture={surfaceTexture} />
      </mesh>

      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(body);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[body.radius * 1.28, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html
        position={[0, -(body.radius + 1.1), 0]}
        center
        distanceFactor={11}
        style={{ pointerEvents: "none" }}
      >
        <div className="rounded-full border border-amber-200/25 bg-slate-950/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.3em] text-amber-100 shadow-[0_12px_30px_rgba(2,6,23,0.4)]">
          {body.name}
        </div>
      </Html>
    </group>
  );
}

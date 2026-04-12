"use client";

import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, type MutableRefObject } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { OrbitPath } from "@/components/solar-system/OrbitPath";
import { Planet } from "@/components/solar-system/Planet";
import { Sun } from "@/components/solar-system/Sun";
import {
  getCompressedOrbitRadius,
  MAX_RENDER_ORBIT_RADIUS
} from "@/data/solar-system";
import type {
  OrbitingPlanetData,
  SolarBodyData,
  SolarStarData
} from "@/types/solar-system";

interface OrbitingPlanetRenderData extends OrbitingPlanetData {
  orbitRadius: number;
}

export interface SolarSystemSceneProps {
  sun: SolarStarData;
  planets: OrbitingPlanetData[];
  selectedBody: SolarBodyData | null;
  onSelectBody: (body: SolarBodyData | null) => void;
}

type BodyPositions = Record<string, THREE.Vector3>;

const orbitPlaneRotation: [number, number, number] = [1.02, -0.24, 0.14];
const overviewPosition = new THREE.Vector3(0, 16.5, 43);

function CameraController({
  selectedBody,
  bodyPositionsRef,
  controlsRef,
  sunPosition
}: {
  selectedBody: SolarBodyData | null;
  bodyPositionsRef: MutableRefObject<BodyPositions>;
  controlsRef: MutableRefObject<OrbitControlsImpl | null>;
  sunPosition: THREE.Vector3;
}) {
  const { camera } = useThree();
  const previousSelectionId = useRef<string | null>(selectedBody?.id ?? null);
  const desiredPosition = useRef(
    new THREE.Vector3(overviewPosition.x, overviewPosition.y, overviewPosition.z)
  );
  const desiredTarget = useRef(
    new THREE.Vector3(sunPosition.x, sunPosition.y, sunPosition.z)
  );
  const isTransitioning = useRef(false);

  useFrame((_, delta) => {
    const controls = controlsRef.current;

    if (!controls) {
      return;
    }

    const currentSelectionId = selectedBody?.id ?? null;

    if (currentSelectionId !== previousSelectionId.current) {
      previousSelectionId.current = currentSelectionId;

      if (selectedBody) {
        const livePosition =
          bodyPositionsRef.current[selectedBody.id] ?? sunPosition;
        const verticalOffset =
          selectedBody.kind === "star"
            ? 2.6
            : 1.3 + Math.min(selectedBody.radius * 0.2, 0.5);
        const focusDistance =
          selectedBody.kind === "star"
            ? 10.8
            : Math.max(8.4, 6.3 + Math.min(selectedBody.radius * 2.1, 4.4));

        desiredTarget.current.copy(livePosition);
        desiredPosition.current.set(
          livePosition.x,
          livePosition.y + verticalOffset,
          livePosition.z + focusDistance
        );
      } else {
        desiredTarget.current.copy(sunPosition);
        desiredPosition.current.copy(overviewPosition);
      }

      isTransitioning.current = true;
    }

    if (isTransitioning.current) {
      const easing = 1 - Math.exp(-2.8 * delta);

      camera.position.lerp(desiredPosition.current, easing);
      controls.target.lerp(desiredTarget.current, easing);
      controls.update();

      if (
        camera.position.distanceToSquared(desiredPosition.current) < 0.01 &&
        controls.target.distanceToSquared(desiredTarget.current) < 0.01
      ) {
        camera.position.copy(desiredPosition.current);
        controls.target.copy(desiredTarget.current);
        controls.update();
        isTransitioning.current = false;
      }

      return;
    }

    controls.update();
  });

  return null;
}

export function SolarSystemScene({
  sun,
  planets,
  selectedBody,
  onSelectBody
}: SolarSystemSceneProps) {
  const renderedPlanets: OrbitingPlanetRenderData[] = planets.map((planet) => ({
    ...planet,
    orbitRadius: getCompressedOrbitRadius(planet.orbitDistanceAU)
  }));
  const bodyPositionsRef = useRef<BodyPositions>({
    [sun.id]: new THREE.Vector3(...sun.position)
  });
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const sunPosition = useRef(new THREE.Vector3(...sun.position));

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{
          position: [overviewPosition.x, overviewPosition.y, overviewPosition.z],
          fov: 42,
          near: 0.1,
          far: 100
        }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => onSelectBody(null)}
      >
        <fog attach="fog" args={["#020617", 18, 42]} />
        <ambientLight intensity={0.16} color="#dbeafe" />
        <directionalLight
          position={[10, 8, 14]}
          intensity={0.16}
          color="#f8fafc"
        />

        <Stars
          radius={95}
          depth={45}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={0.65}
        />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={[sun.position[0], sun.position[1], sun.position[2]]}
          enableRotate
          enableZoom
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.55}
          zoomSpeed={0.75}
          minDistance={8}
          maxDistance={Math.max(58, MAX_RENDER_ORBIT_RADIUS + 26)}
          minPolarAngle={0.45}
          maxPolarAngle={1.55}
        />

        <CameraController
          selectedBody={selectedBody}
          bodyPositionsRef={bodyPositionsRef}
          controlsRef={controlsRef}
          sunPosition={sunPosition.current}
        />

        <Sun
          body={sun}
          isSelected={selectedBody?.id === sun.id}
          bodyPositionsRef={bodyPositionsRef}
          onSelect={onSelectBody}
        />

        <group rotation={orbitPlaneRotation}>
          {renderedPlanets.map((planet) => {
            const isSelected = selectedBody?.id === planet.id;
            const isDimmed = Boolean(selectedBody && selectedBody.id !== planet.id);
            const orbitMotionScale =
              !selectedBody
                ? 1
                : selectedBody.kind === "planet" && selectedBody.id === planet.id
                  ? 0
                  : 0.22;

            return (
              <group key={planet.id}>
                <OrbitPath
                  radius={planet.orbitRadius}
                  isActive={isSelected}
                  isDimmed={isDimmed}
                />
                <Planet
                  planet={planet}
                  isSelected={isSelected}
                  isDimmed={isDimmed}
                  orbitMotionScale={orbitMotionScale}
                  bodyPositionsRef={bodyPositionsRef}
                  onSelect={onSelectBody}
                />
              </group>
            );
          })}
        </group>
      </Canvas>
    </div>
  );
}

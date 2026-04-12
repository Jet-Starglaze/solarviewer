"use client";

import { useState } from "react";
import { PlanetDetailPanel } from "@/components/solar-system/PlanetDetailPanel";
import { SolarSystemScene } from "@/components/solar-system/SolarSystemScene";
import type {
  OrbitingPlanetData,
  SolarBodyData,
  SolarStarData
} from "@/types/solar-system";

interface SolarSystemPageProps {
  sun: SolarStarData;
  planets: OrbitingPlanetData[];
}

export function SolarSystemPage({ sun, planets }: SolarSystemPageProps) {
  const [selectedBody, setSelectedBody] = useState<SolarBodyData | null>(null);
  const orderedBodies: SolarBodyData[] = [sun, ...planets];
  const selectedIndex = selectedBody
    ? orderedBodies.findIndex((body) => body.id === selectedBody.id)
    : -1;
  const hasPrevious = selectedIndex > 0;
  const hasNext =
    selectedIndex >= 0 && selectedIndex < orderedBodies.length - 1;

  function handlePrevious() {
    if (!hasPrevious) {
      return;
    }

    setSelectedBody(orderedBodies[selectedIndex - 1]);
  }

  function handleNext() {
    if (!hasNext) {
      return;
    }

    setSelectedBody(orderedBodies[selectedIndex + 1]);
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SolarSystemScene
        sun={sun}
        planets={planets}
        selectedBody={selectedBody}
        onSelectBody={setSelectedBody}
      />

      <div className="pointer-events-none absolute bottom-4 left-4 z-20 md:bottom-6 md:left-6">
        <div className="glass-panel rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-slate-300">
          Click a body to focus. Empty space resets the view.
        </div>
      </div>

      <PlanetDetailPanel
        body={selectedBody}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onClose={() => setSelectedBody(null)}
      />
    </main>
  );
}

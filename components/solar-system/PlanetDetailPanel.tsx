import type { SolarBodyData } from "@/types/solar-system";

export interface PlanetDetailPanelProps {
  body: SolarBodyData | null;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  onClose: () => void;
}

export function PlanetDetailPanel({
  body,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  onClose
}: PlanetDetailPanelProps) {
  const isOpen = Boolean(body);

  return (
    <aside
      aria-hidden={!isOpen}
      className={`pointer-events-none fixed bottom-4 left-4 right-4 z-30 transition-all duration-500 md:bottom-6 md:left-auto md:right-6 md:top-6 md:w-[24rem] ${
        isOpen
          ? "translate-y-0 opacity-100 md:translate-x-0"
          : "translate-y-[110%] opacity-0 md:translate-y-0 md:translate-x-[110%]"
      }`}
    >
      <div className="pointer-events-auto glass-panel max-h-[52vh] overflow-y-auto rounded-[2rem] p-5 md:flex md:min-h-[calc(100vh-3rem)] md:max-h-none md:flex-col md:rounded-[2.25rem] md:p-6">
        {body ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.36em] text-sky-200/80">
                  Selected Body
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[0.08em] text-white">
                  {body.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                aria-label="Reset body focus"
              >
                X
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full shadow-[0_0_30px_currentColor]"
                style={{ backgroundColor: body.color, color: body.color }}
              />
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-200">
                {body.type}
              </span>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300 md:text-[15px]">
              {body.description}
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.34em] text-slate-400">
                Quick Facts
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {body.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-2xl border border-white/10 bg-slate-950/50 p-3"
                  >
                    <p className="text-[10px] uppercase tracking-[0.26em] text-slate-500">
                      {fact.label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-100">
                      {fact.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={onPrevious}
                disabled={!hasPrevious}
                className={`inline-flex flex-1 items-center justify-center rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  hasPrevious
                    ? "border-white/10 bg-white/5 text-slate-100 hover:border-white/20 hover:bg-white/10"
                    : "cursor-not-allowed border-white/5 bg-white/[0.03] text-slate-500"
                }`}
                aria-label="Focus previous celestial body"
              >
                &lt; Previous
              </button>

              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className={`inline-flex flex-1 items-center justify-center rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  hasNext
                    ? "border-white/10 bg-white/5 text-slate-100 hover:border-white/20 hover:bg-white/10"
                    : "cursor-not-allowed border-white/5 bg-white/[0.03] text-slate-500"
                }`}
                aria-label="Focus next celestial body"
              >
                Next &gt;
              </button>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-sky-400/10 bg-sky-400/5 p-4 text-sm leading-6 text-slate-300">
              Use Previous and Next to move through the solar system, or click
              empty space to glide back to the full-system overview.
            </div>
          </>
        ) : null}
      </div>
    </aside>
  );
}

import { useCalculator } from './CalculatorProvider';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  accentColor?: string;
  large?: boolean;
}

function StatCard({ label, value, sublabel, accentColor, large }: StatCardProps) {
  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-5
      bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
      ${large ? 'col-span-2' : ''}
    `}>
      {/* Subtle accent glow */}
      {accentColor && (
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-20 blur-2xl"
          style={{ background: accentColor }}
        />
      )}

      <div className="relative">
        <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">{label}</p>
        <p
          className={`font-bold ${large ? 'text-5xl' : 'text-3xl'} tracking-tight`}
          style={{
            color: accentColor || 'var(--color-text-primary)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{sublabel}</p>
        )}
      </div>
    </div>
  );
}

export function ResultsPanel() {
  const { state, meta } = useCalculator();

  const hasSubjects = state.subjects.length > 0;
  const progressPercent = (meta.usedCredits / state.totalDegreeCredits) * 100;

  return (
    <div className="space-y-6">
      <h2
        className="text-xl font-semibold text-[var(--color-text-primary)]"
        style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}
      >
        Your Results
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="WAM"
          value={hasSubjects ? meta.wam.toFixed(2) : '—'}
          sublabel="Weighted Average Mark"
          accentColor="var(--color-accent)"
          large
        />
        <StatCard
          label="GPA"
          value={hasSubjects ? meta.gpa7.toFixed(2) : '—'}
          sublabel="7-Point Scale"
          accentColor="var(--color-grade-hd)"
        />
        <StatCard
          label="GPA"
          value={hasSubjects ? meta.gpa4.toFixed(2) : '—'}
          sublabel="4-Point Scale"
          accentColor="var(--color-grade-d)"
        />
      </div>

      {/* Progress Section */}
      <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] p-5">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">Degree Progress</p>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {meta.usedCredits}
              <span className="text-[var(--color-text-muted)] text-lg"> / {state.totalDegreeCredits}</span>
            </p>
          </div>
          <p className="text-3xl font-bold text-[var(--color-accent)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {progressPercent.toFixed(0)}%
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-sm text-[var(--color-text-muted)] mt-3">
          {meta.remainingCredits > 0 ? (
            <>
              <span className="text-[var(--color-text-primary)] font-medium">{meta.remainingCredits}</span> credit points remaining
            </>
          ) : (
            <span className="text-[var(--color-grade-hd)]">🎉 Degree complete!</span>
          )}
        </p>
      </div>
    </div>
  );
}

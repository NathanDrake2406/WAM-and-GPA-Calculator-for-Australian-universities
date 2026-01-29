import { useState } from 'react';
import { useCalculator } from './CalculatorProvider';

interface ThresholdRowProps {
  label: string;
  grade: string;
  value: number | null;
  color: string;
  bgColor: string;
}

function ThresholdRow({ label, grade, value, color, bgColor }: ThresholdRowProps) {
  const isAchievable = value !== null && value <= 100;

  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border-subtle)]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold" style={{ color }}>{grade}</span>
        <span className="text-[var(--color-text-secondary)]">{label}</span>
      </div>
      <div className="text-right">
        {isAchievable ? (
          <span
            className="text-2xl font-bold tabular-nums"
            style={{ color, fontFamily: 'JetBrains Mono, monospace' }}
          >
            {value.toFixed(1)}
          </span>
        ) : (
          <span className="text-[var(--color-text-muted)] italic text-sm">Not achievable</span>
        )}
      </div>
    </div>
  );
}

export function ThresholdCalculator() {
  const { state, meta } = useCalculator();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasSubjects = state.subjects.length > 0;
  const hasRemainingCredits = meta.remainingCredits > 0;

  if (!hasSubjects) {
    return null;
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 rounded-2xl
                   bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                   hover:border-[var(--color-accent)]/50
                   transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <span
            className="font-semibold text-[var(--color-text-primary)]"
            style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}
          >
            Grade Threshold Calculator
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="space-y-4 animate-slide-up">
          {hasRemainingCredits ? (
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] p-6">
              <p className="text-sm text-[var(--color-text-secondary)] mb-5">
                To achieve these grade thresholds, you need to average the following marks
                across your remaining{' '}
                <span className="text-[var(--color-accent)] font-semibold">{meta.remainingCredits}</span>{' '}
                credit points:
              </p>
              <div className="space-y-3">
                <ThresholdRow
                  label="High Distinction"
                  grade="HD"
                  value={meta.thresholds?.hd ?? null}
                  color="var(--color-grade-hd)"
                  bgColor="rgba(34, 197, 94, 0.05)"
                />
                <ThresholdRow
                  label="Distinction"
                  grade="D"
                  value={meta.thresholds?.d ?? null}
                  color="var(--color-grade-d)"
                  bgColor="rgba(59, 130, 246, 0.05)"
                />
                <ThresholdRow
                  label="Credit"
                  grade="C"
                  value={meta.thresholds?.c ?? null}
                  color="var(--color-grade-c)"
                  bgColor="rgba(6, 182, 212, 0.05)"
                />
                <ThresholdRow
                  label="Pass"
                  grade="P"
                  value={meta.thresholds?.p ?? null}
                  color="var(--color-grade-p)"
                  bgColor="rgba(245, 158, 11, 0.05)"
                />
              </div>
            </div>
          ) : (
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] p-8 text-center">
              <p className="text-[var(--color-grade-hd)] text-lg">🎉 You've completed all your credit points!</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                No remaining subjects to calculate thresholds for.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

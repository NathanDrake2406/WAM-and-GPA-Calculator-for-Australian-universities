import { useCalculator } from './CalculatorProvider';

function getGradeStyle(grade: number): { label: string; bgColor: string; textColor: string } {
  if (grade >= 85) return { label: 'HD', bgColor: 'rgba(34, 197, 94, 0.15)', textColor: 'var(--color-grade-hd)' };
  if (grade >= 75) return { label: 'D', bgColor: 'rgba(59, 130, 246, 0.15)', textColor: 'var(--color-grade-d)' };
  if (grade >= 65) return { label: 'C', bgColor: 'rgba(6, 182, 212, 0.15)', textColor: 'var(--color-grade-c)' };
  if (grade >= 50) return { label: 'P', bgColor: 'rgba(245, 158, 11, 0.15)', textColor: 'var(--color-grade-p)' };
  return { label: 'F', bgColor: 'rgba(239, 68, 68, 0.15)', textColor: 'var(--color-grade-f)' };
}

export function SubjectList() {
  const { state, actions } = useCalculator();

  if (state.subjects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4 opacity-50">📚</div>
        <p className="text-[var(--color-text-muted)] text-lg">No subjects added yet</p>
        <p className="text-[var(--color-text-muted)] text-sm mt-1 opacity-70">
          Add your first subject above to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          Your Subjects
          <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-medium">
            {state.subjects.length}
          </span>
        </h3>
        <button
          onClick={() => actions.clearAll()}
          className="text-sm text-[var(--color-danger)] hover:text-[var(--color-danger)]/80 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        {state.subjects.map((subject, index) => {
          const { label, bgColor, textColor } = getGradeStyle(subject.grade);

          return (
            <div
              key={subject.id}
              className="group flex items-center gap-4 p-4 rounded-xl
                         bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]
                         hover:border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)]
                         transition-all duration-200"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--color-text-primary)] truncate">
                  {subject.name}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {subject.credits} credit points
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: bgColor, color: textColor }}
                >
                  {label}
                </span>
                <span
                  className="text-xl font-bold w-14 text-right tabular-nums"
                  style={{ color: textColor, fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {subject.grade}
                </span>
                <button
                  onClick={() => actions.removeSubject(subject.id)}
                  className="p-2 rounded-lg text-[var(--color-text-muted)]
                             hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10
                             opacity-0 group-hover:opacity-100 transition-all duration-200"
                  aria-label={`Remove ${subject.name}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import {
  CalculatorProvider,
  DegreeCreditsSelector,
  SubjectForm,
  SubjectList,
  ResultsPanel,
  ThresholdCalculator,
} from './components/Calculator';
import { useTheme } from './hooks/useTheme';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-xl
                 bg-[var(--color-bg-elevated)] border border-[var(--color-border)]
                 hover:border-[var(--color-accent)] hover:shadow-lg hover:shadow-[var(--color-accent-glow)]
                 transition-all duration-300 group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5 text-[var(--color-accent)] group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-[var(--color-accent)] group-hover:-rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] relative overflow-hidden">
      {/* Subtle gradient accent in corner */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] opacity-30 pointer-events-none"
           style={{
             background: 'radial-gradient(circle at top right, var(--color-accent-glow) 0%, transparent 60%)',
           }}
      />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      <ThemeToggle />

      {/* Header */}
      <header className="pt-16 pb-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-slide-up opacity-0 stagger-1">
            <p className="text-[var(--color-text-muted)] text-sm font-medium tracking-widest uppercase mb-4">
              Australian Universities
            </p>
          </div>
          <h1 className="font-[var(--font-display)] text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-4 animate-slide-up opacity-0 stagger-2"
              style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
            WAM & GPA
            <span className="block text-[var(--color-accent)]">Calculator</span>
          </h1>
                  </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pb-16 space-y-8">
        {/* Degree Credits */}
        <section className="animate-slide-up opacity-0 stagger-4">
          <DegreeCreditsSelector />
        </section>

        {/* Input Card */}
        <section className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] p-6 sm:p-8 space-y-8 animate-slide-up opacity-0 stagger-5">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2"
                style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
              Add Subject
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Enter grades from 0-100. Press{' '}
              <kbd className="px-2 py-0.5 rounded-md bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-xs font-[var(--font-mono)] border border-[var(--color-border)]"
                   style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Enter
              </kbd>{' '}
              to add quickly.
            </p>
            <SubjectForm />
          </div>

          <div className="h-px bg-[var(--color-border)]" />

          <SubjectList />
        </section>

        {/* Results */}
        <section className="animate-fade-in">
          <ResultsPanel />
        </section>

        {/* Threshold Calculator */}
        <section className="animate-fade-in">
          <ThresholdCalculator />
        </section>

        {/* Grade Scale Reference */}
        <section className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)] p-6">
          <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
            Grade Scale Reference
          </h3>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { grade: 'HD', range: '85-100', color: 'var(--color-grade-hd)' },
              { grade: 'D', range: '75-84', color: 'var(--color-grade-d)' },
              { grade: 'C', range: '65-74', color: 'var(--color-grade-c)' },
              { grade: 'P', range: '50-64', color: 'var(--color-grade-p)' },
              { grade: 'F', range: '0-49', color: 'var(--color-grade-f)' },
            ].map(({ grade, range, color }) => (
              <div key={grade} className="py-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                <div className="text-lg font-bold" style={{ color }}>{grade}</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{range}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-4 text-center">
            Based on the{' '}
            <a
              href="https://en.wikipedia.org/wiki/Academic_grading_in_Australia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              Australian grading system
            </a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
        Made with{' '}
        <span className="text-[var(--color-accent)]">♥</span>
        {' '}in Sydney
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CalculatorProvider>
      <AppContent />
    </CalculatorProvider>
  );
}

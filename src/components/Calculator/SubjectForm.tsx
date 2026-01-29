import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { useCalculator } from './CalculatorProvider';

export function SubjectForm() {
  const { state, actions } = useCalculator();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [credits, setCredits] = useState(state.defaultSubjectCredits.toString());
  const [error, setError] = useState<string | null>(null);
  const gradeInputRef = useRef<HTMLInputElement>(null);

  const subjectCount = state.subjects.length;

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    setError(null);

    const gradeNum = parseFloat(grade);
    const creditsNum = parseInt(credits, 10);

    if (isNaN(gradeNum)) {
      setError('Please enter a valid grade');
      return;
    }

    const result = actions.addSubject({
      name: name.trim() || `Subject ${subjectCount + 1}`,
      grade: gradeNum,
      credits: creditsNum || state.defaultSubjectCredits,
    });

    if (result.success) {
      setName('');
      setGrade('');
      setCredits(state.defaultSubjectCredits.toString());
      gradeInputRef.current?.focus();
    } else {
      setError(result.error || 'Failed to add subject');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const inputClasses = `
    w-full px-4 py-3 rounded-xl
    bg-[var(--color-bg-tertiary)]
    border border-[var(--color-border)]
    text-[var(--color-text-primary)]
    placeholder:text-[var(--color-text-muted)]
    focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]
    transition-all duration-200
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="subject-name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Subject Name
            <span className="text-[var(--color-text-muted)] ml-1">(optional)</span>
          </label>
          <input
            id="subject-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Subject ${subjectCount + 1}`}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="subject-grade" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Grade
            <span className="text-[var(--color-accent)] ml-1">*</span>
          </label>
          <input
            ref={gradeInputRef}
            id="subject-grade"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={grade}
            onChange={e => setGrade(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0-100"
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="subject-credits" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Credit Points
          </label>
          <input
            id="subject-credits"
            type="number"
            min="2"
            max="12"
            step="2"
            value={credits}
            onChange={e => {
              setCredits(e.target.value);
              actions.setDefaultSubjectCredits(parseInt(e.target.value, 10) || 6);
            }}
            onKeyDown={handleKeyDown}
            className={inputClasses}
          />
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-[var(--color-danger)] text-sm animate-scale-in">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-[var(--color-bg-primary)]
                   bg-[var(--color-accent)] hover:bg-[var(--color-accent-dim)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)]
                   transform hover:scale-[1.02] active:scale-[0.98]
                   transition-all duration-200"
      >
        Add Subject
      </button>
    </form>
  );
}

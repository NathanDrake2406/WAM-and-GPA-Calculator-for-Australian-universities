import { useState } from 'react';
import { useCalculator } from './CalculatorProvider';

const PRESET_OPTIONS = [144, 192, 240, 288];

export function DegreeCreditsSelector() {
  const { state, actions, meta } = useCalculator();
  const [isCustom, setIsCustom] = useState(!PRESET_OPTIONS.includes(state.totalDegreeCredits));
  const [customValue, setCustomValue] = useState(
    !PRESET_OPTIONS.includes(state.totalDegreeCredits) ? state.totalDegreeCredits.toString() : ''
  );

  const handlePresetChange = (value: string) => {
    if (value === 'custom') {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      actions.setTotalDegreeCredits(parseInt(value, 10));
    }
  };

  const handleCustomChange = (value: string) => {
    setCustomValue(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      actions.setTotalDegreeCredits(num);
    }
  };

  const selectClasses = `
    px-4 py-2.5 rounded-xl
    bg-[var(--color-bg-tertiary)]
    border border-[var(--color-border)]
    text-[var(--color-text-primary)]
    focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
    cursor-pointer
  `;

  const inputClasses = `
    w-28 px-4 py-2.5 rounded-xl
    bg-[var(--color-bg-tertiary)]
    border border-[var(--color-border)]
    text-[var(--color-text-primary)]
    focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
  `;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <label className="text-sm font-medium text-[var(--color-text-secondary)]">
        Total Degree Credits:
      </label>

      <select
        value={isCustom ? 'custom' : state.totalDegreeCredits}
        onChange={(e) => handlePresetChange(e.target.value)}
        disabled={meta.usedCredits > 0}
        className={selectClasses}
      >
        {PRESET_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option} credits
          </option>
        ))}
        <option value="custom">Custom</option>
      </select>

      {isCustom && (
        <input
          type="number"
          min="1"
          value={customValue}
          onChange={(e) => handleCustomChange(e.target.value)}
          disabled={meta.usedCredits > 0}
          placeholder="Enter credits"
          className={inputClasses}
        />
      )}

      {meta.usedCredits > 0 && (
        <span className="text-xs text-[var(--color-text-muted)]">
          (Clear subjects to change)
        </span>
      )}
    </div>
  );
}

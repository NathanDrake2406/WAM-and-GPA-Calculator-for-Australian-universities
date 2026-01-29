import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import type { Subject, CalculatorState, CalculatorContextValue, ValidationResult } from '../../types';
import {
  calculateWAM,
  calculateGPA7,
  calculateGPA4,
  calculateThresholds,
  validateSubject,
} from '../../utils/calculations';

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

const initialState: CalculatorState = {
  subjects: [],
  totalDegreeCredits: 144,
  defaultSubjectCredits: 6,
};

interface CalculatorProviderProps {
  children: ReactNode;
}

export function CalculatorProvider({ children }: CalculatorProviderProps) {
  const [state, setState] = useState<CalculatorState>(initialState);

  // Derived values - calculated during render, not stored
  const usedCredits = useMemo(
    () => state.subjects.reduce((sum, s) => sum + s.credits, 0),
    [state.subjects]
  );

  const remainingCredits = state.totalDegreeCredits - usedCredits;

  const wam = useMemo(() => calculateWAM(state.subjects), [state.subjects]);
  const gpa7 = useMemo(() => calculateGPA7(state.subjects), [state.subjects]);
  const gpa4 = useMemo(() => calculateGPA4(state.subjects), [state.subjects]);
  const thresholds = useMemo(
    () => remainingCredits > 0 ? calculateThresholds(state.subjects, remainingCredits) : null,
    [state.subjects, remainingCredits]
  );

  // Actions
  const addSubject = useCallback((subject: Omit<Subject, 'id'>): ValidationResult => {
    const validation = validateSubject(
      subject.grade,
      subject.credits,
      usedCredits,
      state.totalDegreeCredits
    );

    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const newSubject: Subject = {
      ...subject,
      id: crypto.randomUUID(),
    };

    setState(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));

    return { success: true };
  }, [usedCredits, state.totalDegreeCredits]);

  const removeSubject = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.id !== id),
    }));
  }, []);

  const setTotalDegreeCredits = useCallback((credits: number) => {
    setState(prev => ({ ...prev, totalDegreeCredits: credits }));
  }, []);

  const setDefaultSubjectCredits = useCallback((credits: number) => {
    setState(prev => ({ ...prev, defaultSubjectCredits: credits }));
  }, []);

  const clearAll = useCallback(() => {
    setState(prev => ({ ...prev, subjects: [] }));
  }, []);

  const contextValue: CalculatorContextValue = {
    state,
    actions: {
      addSubject,
      removeSubject,
      setTotalDegreeCredits,
      setDefaultSubjectCredits,
      clearAll,
    },
    meta: {
      wam,
      gpa7,
      gpa4,
      remainingCredits,
      usedCredits,
      thresholds,
    },
  };

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator(): CalculatorContextValue {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}

export { CalculatorContext };

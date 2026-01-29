export interface Subject {
  id: string;
  name: string;
  grade: number;
  credits: number;
}

export interface CalculatorState {
  subjects: Subject[];
  totalDegreeCredits: number;
  defaultSubjectCredits: number;
}

export interface CalculatorActions {
  addSubject: (subject: Omit<Subject, 'id'>) => ValidationResult;
  removeSubject: (id: string) => void;
  setTotalDegreeCredits: (credits: number) => void;
  setDefaultSubjectCredits: (credits: number) => void;
  clearAll: () => void;
}

export interface CalculatorMeta {
  wam: number;
  gpa7: number;
  gpa4: number;
  remainingCredits: number;
  usedCredits: number;
  thresholds: GradeThresholds | null;
}

export interface GradeThresholds {
  hd: number | null;
  d: number | null;
  c: number | null;
  p: number | null;
}

export interface ValidationResult {
  success: boolean;
  error?: string;
}

export interface CalculatorContextValue {
  state: CalculatorState;
  actions: CalculatorActions;
  meta: CalculatorMeta;
}

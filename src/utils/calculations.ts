import type { Subject, GradeThresholds } from '../types';

/**
 * Calculate WAM (Weighted Average Mark)
 * Formula: sum(grade * credits) / sum(credits)
 */
export function calculateWAM(subjects: Subject[]): number {
  if (subjects.length === 0) return 0;

  const totalWeightedGrade = subjects.reduce(
    (sum, subject) => sum + subject.grade * subject.credits,
    0
  );
  const totalCredits = subjects.reduce(
    (sum, subject) => sum + subject.credits,
    0
  );

  return totalCredits > 0 ? totalWeightedGrade / totalCredits : 0;
}

/**
 * Convert a grade to 7-point GPA scale (Australian standard)
 */
function gradeToGPA7(grade: number): number {
  if (grade >= 85) return 7; // HD
  if (grade >= 75) return 6; // D
  if (grade >= 65) return 5; // C
  if (grade >= 50) return 4; // P
  return 0; // N/F
}

/**
 * Calculate GPA on 7-point scale
 */
export function calculateGPA7(subjects: Subject[]): number {
  if (subjects.length === 0) return 0;

  const totalWeightedGPA = subjects.reduce(
    (sum, subject) => sum + gradeToGPA7(subject.grade) * subject.credits,
    0
  );
  const totalCredits = subjects.reduce(
    (sum, subject) => sum + subject.credits,
    0
  );

  return totalCredits > 0 ? totalWeightedGPA / totalCredits : 0;
}

/**
 * Convert a grade to 4-point GPA scale (US standard)
 */
function gradeToGPA4(grade: number): number {
  if (grade >= 85) return 4.0;  // HD
  if (grade >= 75) return 3.5;  // D
  if (grade >= 65) return 2.5;  // C
  if (grade >= 50) return 1.5;  // P
  return 0.5; // N/F
}

/**
 * Calculate GPA on 4-point scale
 */
export function calculateGPA4(subjects: Subject[]): number {
  if (subjects.length === 0) return 0;

  const totalWeightedGPA = subjects.reduce(
    (sum, subject) => sum + gradeToGPA4(subject.grade) * subject.credits,
    0
  );
  const totalCredits = subjects.reduce(
    (sum, subject) => sum + subject.credits,
    0
  );

  return totalCredits > 0 ? totalWeightedGPA / totalCredits : 0;
}

/**
 * Calculate the average grade needed in remaining subjects to achieve target WAM
 */
function calculateRequiredGrade(
  currentSubjects: Subject[],
  remainingCredits: number,
  targetWAM: number
): number | null {
  if (remainingCredits <= 0) return null;

  const currentWeightedTotal = currentSubjects.reduce(
    (sum, s) => sum + s.grade * s.credits,
    0
  );
  const currentCredits = currentSubjects.reduce(
    (sum, s) => sum + s.credits,
    0
  );
  const totalCredits = currentCredits + remainingCredits;

  // targetWAM = (currentWeightedTotal + requiredGrade * remainingCredits) / totalCredits
  // requiredGrade = (targetWAM * totalCredits - currentWeightedTotal) / remainingCredits
  const requiredGrade = (targetWAM * totalCredits - currentWeightedTotal) / remainingCredits;

  // Return null if impossible (> 100 or < 0)
  if (requiredGrade > 100 || requiredGrade < 0) return null;

  return requiredGrade;
}

/**
 * Calculate grade thresholds for HD (85), D (75), C (65), P (50)
 */
export function calculateThresholds(
  subjects: Subject[],
  remainingCredits: number
): GradeThresholds {
  return {
    hd: calculateRequiredGrade(subjects, remainingCredits, 85),
    d: calculateRequiredGrade(subjects, remainingCredits, 75),
    c: calculateRequiredGrade(subjects, remainingCredits, 65),
    p: calculateRequiredGrade(subjects, remainingCredits, 50),
  };
}

/**
 * Validate subject input
 */
export function validateSubject(
  grade: number,
  credits: number,
  usedCredits: number,
  totalDegreeCredits: number
): { valid: boolean; error?: string } {
  if (grade < 0 || grade > 100) {
    return { valid: false, error: 'Grade must be between 0 and 100' };
  }

  if (credits <= 0) {
    return { valid: false, error: 'Credit points must be greater than 0' };
  }

  if (credits % 2 !== 0) {
    return { valid: false, error: 'Credit points must be divisible by 2' };
  }

  if (credits > 12) {
    return { valid: false, error: 'Credit points cannot exceed 12' };
  }

  if (usedCredits + credits > totalDegreeCredits) {
    return {
      valid: false,
      error: `Adding this subject would exceed your total degree credits (${totalDegreeCredits})`
    };
  }

  return { valid: true };
}

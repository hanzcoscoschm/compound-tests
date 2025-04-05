export type DosageForm = 'Cream' | 'Capsule' | 'Tablet' | 'Suspension' | 'Solution' | 'Ointment';
export type CapsuleSize = '#0' | '#1' | '#2' | '#3' | '#4' | '#5';
export type NumericField = 'expiryDays' | 'finalUnits' | 'wastagePercentage';
export type IngredientAction = 'edit' | 'remove' | 'duplicate' | 'use-as-excipient';

export interface Ingredient {
    name: string;
    strength: string;
    isExcipient?: boolean;
}

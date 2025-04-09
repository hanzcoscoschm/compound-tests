// Common dosage forms in compounding pharmacy
export type DosageForm = 'Capsule' | 'Troche' | 'Oral Liquid' | 'Cream' | 'Suppository' | 'Powder';

// Standard capsule sizes used in pharmacy practice
export type CapsuleSize = '00' | '0' | '1' | '2' | '3' | '4' | '5';

// Fields that accept numeric input
export type NumericField = 'expiryDays' | 'finalUnits' | 'wastagePercentage';

// Actions that can be performed on ingredients
export type IngredientAction = 'delete' | 'use-as-excipient';

// Ingredient structure based on USP guidelines
export interface Ingredient {
    name: string;
    strength: number;
    strengthUnit: string;
    isExcipient: boolean;
    percentage: number;
}

// Common compound types for validation
export interface CompoundFormulation {
    dosageForm: DosageForm;
    ingredients: Ingredient[];
    expiryDays: number;
    finalUnits: number;
    wastagePercentage: number;
    capsuleSize?: CapsuleSize;
}

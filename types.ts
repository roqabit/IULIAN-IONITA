// FIX: Removed the import of `LegalEntityOption` from `./constants` to resolve a circular dependency, as the interface is defined in this file.
export enum ServiceType {
  Cleaning = 'cleaning',
  Inspection = 'inspection',
  Both = 'both',
}

export enum CustomerType {
  Physical = 'physical',
  Legal = 'legal',
}

export interface LegalEntitySubOption {
  id: string;
  label: string;
  type: 'per_meter' | 'fixed';
  category: 'cleaning' | 'inspection' | 'report' | 'other_fixed';
  price?: number; // for fixed type
  multiplier?: number; // for per_meter type
}

export interface LegalEntityOption {
  value: string;
  label: string;
  subOptions: LegalEntitySubOption[];
}

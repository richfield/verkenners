export type IncidentType = 'late' | 'uniform' | 'unknown';

export type UniformIncident = {
  RowNumber?: number;
  Datum: string;
  VerkennerNaam: string;
  Type: IncidentType;
};

export type Traktatie = {
  RowNumber: number;
  VerkennerNaam: string;
  AantalKeerVergeten: number;
  KerenOver: number;
  Getrakteerd: boolean;
  Aantal: number;
};
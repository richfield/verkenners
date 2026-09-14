export type IncidentType = 'late' | 'uniform';

export type UniformIncident = {
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
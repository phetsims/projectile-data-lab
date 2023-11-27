// Copyright 2023, University of Colorado Boulder

export const ProjectilePhaseValues = [ 'LOADED', 'AIRBORNE', 'LANDED', 'AIRBORNE_BELOW_FIELD' ] as const;

export type ProjectilePhase = typeof ProjectilePhaseValues[number];
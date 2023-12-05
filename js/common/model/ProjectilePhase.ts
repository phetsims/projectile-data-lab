// Copyright 2023, University of Colorado Boulder

export const ProjectilePhaseValues = [ 'AIRBORNE', 'LANDED' ] as const;

export type ProjectilePhase = typeof ProjectilePhaseValues[number];
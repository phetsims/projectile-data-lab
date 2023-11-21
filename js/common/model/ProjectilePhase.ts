// Copyright 2023, University of Colorado Boulder

export const ProjectilePhaseValues = [ 'LOADED', 'AIRBORNE', 'LANDED' ] as const;

export type ProjectilePhase = typeof ProjectilePhaseValues[number];
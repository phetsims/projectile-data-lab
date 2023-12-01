// Copyright 2023, University of Colorado Boulder

export const ProjectileTypeValues = [ 'CANNONBALL', 'PUMPKIN', 'TOY_PIANO' ] as const;

export type ProjectileType = typeof ProjectileTypeValues[number];
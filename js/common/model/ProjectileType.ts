// Copyright 2023, University of Colorado Boulder

export const ProjectileTypeValues = [ 'cannonball', 'pumpkin', 'piano' ] as const;

export type ProjectileType = typeof ProjectileTypeValues[number];
// Copyright 2023, University of Colorado Boulder

// REVIEW: Do we want to use this pattern for our enums, or EnumerationValue? I didn't know we would have to put 'as const' at other usage sites too.
export const ProjectileTypeValues = [ 'CANNONBALL', 'PUMPKIN', 'TOY_PIANO' ] as const;

export type ProjectileType = typeof ProjectileTypeValues[number];
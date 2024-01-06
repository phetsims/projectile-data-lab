// Copyright 2023-2024, University of Colorado Boulder

/**
 * ProjectileType is a string literal union enumeration that describes the type of the projectile.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export const ProjectileTypeValues = [ 'cannonball', 'pumpkin', 'piano' ] as const;

export type ProjectileType = typeof ProjectileTypeValues[number];
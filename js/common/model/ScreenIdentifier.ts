// Copyright 2023, University of Colorado Boulder

/**
 * ScreenIdentifier is a string literal union enumeration that describes the type of the projectile.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export const ScreenIdentifierValues = [ 'variabilityScreen', 'sourcesScreen', 'measuresScreen', 'samplingScreen' ] as const;

export type ScreenIdentifier = typeof ScreenIdentifierValues[number];
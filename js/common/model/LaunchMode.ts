// Copyright 2023-2024, University of Colorado Boulder

/**
 * LaunchMode is a string literal union enumeration that describes whether the launch mode is single or continuous.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export const LaunchModeValues = [ 'single', 'continuous' ] as const;

export type LaunchMode = typeof LaunchModeValues[number];
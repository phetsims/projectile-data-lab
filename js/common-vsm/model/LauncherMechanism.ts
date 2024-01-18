// Copyright 2023-2024, University of Colorado Boulder

/**
 * Enumeration that describes the mechanism used to launch the projectile.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

export const LauncherMechanismValues = [ 'spring', 'pressure', 'explosion' ] as const;

// TODO: These will need to be instrumented for PhET-iO - see https://github.com/phetsims/projectile-data-lab/issues/80
export const speedMeans = {
  spring: 25,
  pressure: 25,
  explosion: 25
};

export const speedStandardDeviations = {
  spring: 0.3,
  pressure: 0.6,
  explosion: 1.2
};

export type LauncherMechanism = typeof LauncherMechanismValues[number];
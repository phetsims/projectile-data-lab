// Copyright 2023-2024, University of Colorado Boulder

import PDLConstants from '../../common/PDLConstants.js';

/**
 * Enumeration that describes the mechanism used to launch the projectile.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

export const LauncherMechanismValues = [ 'spring', 'pressure', 'explosion' ] as const;

// TODO: Duplicated, see https://github.com/phetsims/projectile-data-lab/issues/77
const speedAverages = [ PDLConstants.SPRING_SPEED_MEAN, PDLConstants.PRESSURE_SPEED_MEAN, PDLConstants.EXPLOSION_SPEED_MEAN ];

export const MeanLaunchSpeedForMechanism = ( type: LauncherMechanism ): number => {
  return speedAverages[ LauncherMechanismValues.indexOf( type ) ];
};

export type LauncherMechanism = typeof LauncherMechanismValues[number];
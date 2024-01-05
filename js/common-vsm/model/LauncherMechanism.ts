// Copyright 2023-2024, University of Colorado Boulder

/**
 * Enumeration that describes the mechanism used to launch the projectile.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import PDLConstants from '../../common/PDLConstants.js';

export const LauncherMechanismValues = [ 'spring', 'pressure', 'explosion' ] as const;

// 'spring', 'pressure', 'explosion'
const speedAverages = [ PDLConstants.SPRING_SPEED_MEAN, PDLConstants.PRESSURE_SPEED_MEAN, PDLConstants.EXPLOSION_SPEED_MEAN ];
const speedStandardDeviations = [ PDLConstants.SPRING_SPEED_SD, PDLConstants.PRESSURE_SPEED_SD, PDLConstants.EXPLOSION_SPEED_SD ];

export const MeanLaunchSpeedForMechanism = ( type: LauncherMechanism ): number => {
  return speedAverages[ LauncherMechanismValues.indexOf( type ) ];
};

export const SDLaunchSpeedForMechanism = ( type: LauncherMechanism ): number => {
  return speedStandardDeviations[ LauncherMechanismValues.indexOf( type ) ];
};

export type LauncherMechanism = typeof LauncherMechanismValues[number];
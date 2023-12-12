// Copyright 2023, University of Colorado Boulder

import PDLConstants from '../../common/PDLConstants.js';

export const CustomLauncherTypeValues = [ 'SPRING', 'PRESSURE', 'EXPLOSION' ] as const;

// 'SPRING', 'PRESSURE', 'EXPLOSION'
const speedAverages = [ PDLConstants.SPRING_SPEED_MEAN, PDLConstants.PRESSURE_SPEED_MEAN, PDLConstants.EXPLOSION_SPEED_MEAN ];
const speedStandardDeviations = [ PDLConstants.SPRING_SPEED_SD, PDLConstants.PRESSURE_SPEED_SD, PDLConstants.EXPLOSION_SPEED_SD ];

export const CustomLauncherSpeedForType = ( type: LauncherMechanism ): number => {
  return speedAverages[ CustomLauncherTypeValues.indexOf( type ) ];
};

export const CustomLauncherSpeedSDForType = ( type: LauncherMechanism ): number => {
  return speedStandardDeviations[ CustomLauncherTypeValues.indexOf( type ) ];
};

export type LauncherMechanism = typeof CustomLauncherTypeValues[number];
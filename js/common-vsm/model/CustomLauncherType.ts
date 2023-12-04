// Copyright 2023, University of Colorado Boulder

export const CustomLauncherTypeValues = [ 'SPRING', 'PRESSURE', 'EXPLOSION' ] as const;

// 'SPRING', 'PRESSURE', 'EXPLOSION'
const speedAverages = [ 25, 25, 25 ];
const speedStandardDeviations = [ 0.1, 1, 2 ];

export const CustomLauncherSpeedForType = ( type: CustomLauncherType ): number => {
  return speedAverages[ CustomLauncherTypeValues.indexOf( type ) ];
};

export const CustomLauncherSpeedSDForType = ( type: CustomLauncherType ): number => {
  return speedStandardDeviations[ CustomLauncherTypeValues.indexOf( type ) ];
};

export type CustomLauncherType = typeof CustomLauncherTypeValues[number];
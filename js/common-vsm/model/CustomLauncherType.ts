// Copyright 2023, University of Colorado Boulder

export const CustomLauncherTypeValues = [ 'SPRING', 'PRESSURE', 'EXPLOSION' ] as const;

// 'SPRING', 'PRESSURE', 'EXPLOSION'
const speedAverages = [ 26.8, 26.8, 20 ];
const speedStandardDeviations = [ 0.2, 1, 4 ];

export const CustomLauncherSpeedForType = ( type: CustomLauncherType ): number => {
  return speedAverages[ CustomLauncherTypeValues.indexOf( type ) ];
};

export const CustomLauncherSpeedSDForType = ( type: CustomLauncherType ): number => {
  return speedStandardDeviations[ CustomLauncherTypeValues.indexOf( type ) ];
};

export type CustomLauncherType = typeof CustomLauncherTypeValues[number];
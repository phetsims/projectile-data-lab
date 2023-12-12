// Copyright 2023, University of Colorado Boulder

export const LauncherConfigurationValues = [ 'ANGLE_30', 'ANGLE_45', 'ANGLE_60', 'ANGLE_0_RAISED' ] as const;

const meanLaunchAngles = [ 30, 45, 60, 0 ];

// Export a mapping that returns the numrical value of the launcher configuration.
export const AngleForConfiguration = ( configuration: LauncherConfiguration ): number => {
  return meanLaunchAngles[ LauncherConfigurationValues.indexOf( configuration ) ];
};

export type LauncherConfiguration = typeof LauncherConfigurationValues[number];
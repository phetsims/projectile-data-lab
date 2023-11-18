// Copyright 2023, University of Colorado Boulder

// REVIEW: Do we want to use this pattern for our enums, or EnumerationValue? I didn't know we would have to put 'as const' at other usage sites too.
export const LauncherConfigurationValues = [ 'ANGLE_30', 'ANGLE_45', 'ANGLE_60', 'ANGLE_0' ] as const;

export type LauncherConfiguration = typeof LauncherConfigurationValues[number];
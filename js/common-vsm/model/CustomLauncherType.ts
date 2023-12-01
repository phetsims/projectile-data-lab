// Copyright 2023, University of Colorado Boulder

export const CustomLauncherTypeValues = [ 'SPRING', 'PRESSURE', 'EXPLOSION' ] as const;

export type CustomLauncherType = typeof CustomLauncherTypeValues[number];
// Copyright 2023, University of Colorado Boulder

export const LaunchModeValues = [ 'single', 'continuous' ] as const;

export type LaunchMode = typeof LaunchModeValues[number];
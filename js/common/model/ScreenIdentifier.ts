// Copyright 2023, University of Colorado Boulder
export const ScreenIdentifierValues = [ 'variabilityScreen', 'sourcesScreen', 'measuresScreen', 'samplingScreen' ] as const;

export type ScreenIdentifier = typeof ScreenIdentifierValues[number];
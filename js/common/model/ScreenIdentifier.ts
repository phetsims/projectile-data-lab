// Copyright 2023, University of Colorado Boulder
export const ScreenIdentifierValues = [ 'variability', 'sources', 'measures', 'sampling' ] as const;

export type ScreenIdentifier = typeof ScreenIdentifierValues[number];
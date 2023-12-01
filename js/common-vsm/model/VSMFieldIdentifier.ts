// Copyright 2023, University of Colorado Boulder

/**
 * Also used as tandems
 */
export const VSMFieldIdentifierValues = [
  'field1', 'field2', 'field3',
  'field4', 'field5', 'field6',
  'field7', 'field8'
] as const;

export type VSMFieldIdentifier = typeof VSMFieldIdentifierValues[number];
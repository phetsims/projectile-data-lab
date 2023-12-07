// Copyright 2023, University of Colorado Boulder

// TODO: Some files are missing author and header doc, see https://github.com/phetsims/projectile-data-lab/issues/7
// TODO:  Some enumerations are lowercase and some are uppercase, see https://github.com/phetsims/projectile-data-lab/issues/7

/**
 * Enumeration that describes whether the histogram is showing bars (one per bin) or blocks (one per projectile).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export const HistogramRepresentationValues = [ 'blocks', 'bars' ] as const;

export type HistogramRepresentation = typeof HistogramRepresentationValues[number];
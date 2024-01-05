// Copyright 2023, University of Colorado Boulder

/**
 * BinStrategy is a string literal union enumeration that describes the user preference to view the histogram bins
 * by width or by total number of bins.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export const BinStrategyValues = [ 'binWidth', 'totalBins' ] as const;

export type BinStrategy = typeof BinStrategyValues[number];
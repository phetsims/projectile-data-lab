// Copyright 2023, University of Colorado Boulder
export const BinStrategyValues = [ 'binWidth', 'totalBins' ] as const;

export type BinStrategy = typeof BinStrategyValues[number];
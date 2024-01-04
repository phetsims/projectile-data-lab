// Copyright 2023, University of Colorado Boulder

export const SamplingPhaseValues = [
  'idle',
  'showingAirborneProjectiles',
  'showingCompleteSampleWithoutMean',
  'showingCompleteSampleWithMean',
  'maxSamplesReached' ] as const;

export type SamplingPhase = typeof SamplingPhaseValues[number];
// Copyright 2023, University of Colorado Boulder

export const StopwatchPhaseValues = [ 'clear', 'running', 'stopped' ] as const;

export type StopwatchPhase = typeof StopwatchPhaseValues[number];
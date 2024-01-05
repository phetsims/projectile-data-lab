// Copyright 2023, University of Colorado Boulder

/**
 * Indicates the phase of the stopwatch.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
export const StopwatchPhaseValues = [ 'clear', 'running', 'stopped' ] as const;

export type StopwatchPhase = typeof StopwatchPhaseValues[number];
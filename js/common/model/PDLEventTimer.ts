// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';

/**
 * Abstraction for timed-event series that helps with variable frame-rates. Note this has similar functionality to
 * EventTimer, but has an interface and simplifications that are appropriate for the Projectile Data Lab.
 *
 * This is used to sequence the continuous mode firing, and within- and between- sample firing in the Sampling screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
export default class PDLEventTimer {

  // Whether the timer is running
  private isRunning = false;

  // Amount of time between events, in seconds
  private period: number;

  // Remaining time until the next event, in seconds
  private timeRemaining: number;

  // The original period of the timer, in seconds, for resetting
  private readonly originalPeriod: number;

  public constructor( period: number ) {
    this.period = period;
    this.timeRemaining = period;

    this.originalPeriod = period;
  }

  /**
   * Advance the elapsed time by dt seconds, triggering callbacks as necessary. May trigger 0 or more callbacks.
   * Note the callbacks may change the timer, such as stopping it or changing the period.
   */
  public step( dt: number, callback: () => void ): void {

    if ( this.isRunning ) {

      // isRunning may be changed in the callbacks, so we much check it each time
      while ( dt >= this.timeRemaining && this.isRunning ) {
        dt -= this.timeRemaining;
        this.timeRemaining = this.period;
        callback();
      }

      // use up the remaining time
      this.timeRemaining -= dt;
    }
  }

  /**
   * Called from reset(), restore all the initial state.
   */
  public reset(): void {
    this.period = this.originalPeriod;
    this.timeRemaining = this.period;
    this.isRunning = false;
  }

  /**
   * Schedule the next event to occur at the current period, and start the timer.
   */
  public restart(): void {
    this.timeRemaining = this.period;
    this.isRunning = true;
  }

  /**
   * Stop the timer, and do not schedule the next event. Any accumulated time remains.
   */
  public stop(): void {
    this.isRunning = false;
  }

  /**
   * Schedule the next event to occur on the very next step(dt). Note the timer may be paused. In that case, the next
   * event would occur when unpaused.
   */
  public setZeroTimeRemaining(): void {
    this.timeRemaining = 0;
  }

  /**
   * Change the period of the timer. May be changed while the timer is sending events.
   */
  public setPeriod( period: number ): void {
    this.period = period;
  }
}

projectileDataLab.register( 'PDLEventTimer', PDLEventTimer );
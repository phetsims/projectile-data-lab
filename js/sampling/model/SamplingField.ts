// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Projectile from '../../common/model/Projectile.js';
import HistogramData from '../../common/model/HistogramData.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import Emitter from '../../../../axon/js/Emitter.js';

/**
 * The SamplingField is an extension of the Field class that adds fields for the Sampling model. Note in order to support
 * CODAP, the "sample" is a number stored within the Projectile (rather than adding arrays or data structures here).
 * This allows CODAP students to see projectiles from different samples, or to filter by sample.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type SamplingFieldOptions = SelfOptions & FieldOptions;

// This is the delay between the last projectile landing and the mean symbol appearing, in 'Single sample' mode.
const SHOWING_CLEAR_PRESAMPLE_TIME = 0.2;
const SHOWING_SAMPLE_TIME = 0.3;
const SHOWING_SAMPLE_AND_MEAN_TIME = 0.5;

// In single mode, we transition through these phases:
// 1. idle (user has not yet pressed the launch button)
// 2. showingClearPresample (don't do that on the 1st run because there is nothing to clear).
// 3. showingProjectiles (individual projectiles have highlighted paths)
// 4. showingCompleteSampleWithMean - User can press the launch button, which goes back to 2

// In continuous mode, we transition through these phases:
// 1. idle (user has not yet pressed the launch button)
// 2. showingClearPresample (don't do that on the 1st run because there is nothing to clear).
// 3. showingCompleteSampleWithoutMean (user has pressed the launch button, and we are creating a sample)
// 4. showingCompleteSampleWithMean (user has pressed the launch button, and we are creating a sample)
// GO TO 2

type SamplingPhase = 'idle' | 'showingClearPresample' | 'showingProjectiles' | 'showingCompleteSampleWithoutMean' | 'showingCompleteSampleWithMean';

// TODO: Gracefully handle changes of mode while a sample is in progress, see https://github.com/phetsims/projectile-data-lab/issues/17
export default class SamplingField extends Field {
  public override identifier: string;

  // The simulation begins with 0 samples, showing sample 0 of 0. When a sample begins, this number increases. This is
  // a convenience Property to simplify the user interface -- it is fully computable from the Projectiles.
  // TODO: Get rid of these now that we have phase? See https://github.com/phetsims/projectile-data-lab/issues/17
  public readonly numberOfStartedSamplesProperty: NumberProperty;

  // In order to show an accumulating sample, we must differentiate between the total samples and total completed samples.
  // This is a convenience Property to simplify the user interface -- it is fully computable from the Projectiles.
  // TODO: Get rid of these now that we have phase? See https://github.com/phetsims/projectile-data-lab/issues/17
  public readonly numberOfCompletedSamplesProperty: NumberProperty;

  // This property is used to set the visibility and position of the mean indicator.
  // If it is null, the current sample is not yet complete and the mean indicator is not visible.
  // Note: In 'Single sample' mode, there is a delay between the last projectile in a sample and the mean indicator appearing.
  // TODO: Get rid of these now that we have phase? See https://github.com/phetsims/projectile-data-lab/issues/17
  public readonly sampleMeanProperty: Property<number | null>;

  // Total elapsed time of running the model, so we can update the current phase and/or move to the next phase.
  private time = 0;

  // Mark the time when a phase began, so we can track how long we have been in the phase.
  private phaseStartTime = 0;

  // Total time to launch all projectiles in single mode.
  private readonly totalSampleTime: number;

  // Current phase, see documentation above
  private phase: SamplingPhase = 'idle';
  public readonly phaseChangedEmitter = new Emitter();

  public constructor( public readonly launcher: number,
                      public readonly sampleSize: number,
                      options: SamplingFieldOptions ) {
    super( options );

    this.identifier = window.phetio.PhetioIDUtils.getComponentName( this.phetioID );

    // PhET-iO instrumentation not needed since this is computable from the Projectiles
    this.numberOfStartedSamplesProperty = new NumberProperty( 0 );

    // PhET-iO instrumentation not needed since this is computable from the Projectiles
    this.numberOfCompletedSamplesProperty = new NumberProperty( 0 );

    // Increase the total time as the sample size increases, so that larger samples take longer but not too long.
    this.totalSampleTime =
      this.sampleSize === 2 ? 0.5 :
      this.sampleSize === 5 ? 1 :
      this.sampleSize === 15 ? 1.5 :
      this.sampleSize === 40 ? 2 :
      0;

    assert && assert( this.totalSampleTime > 0, 'this.totalSampleTime should be greater than 0' );

    this.sampleMeanProperty = new Property<number | null>( null, {
      reentrant: true
    } );

    this.mysteryLauncherProperty.value = launcher;
    this.updateCounts();

    this.selectedSampleProperty.lazyLink( () => {

      // TODO: Factor out: https://github.com/phetsims/projectile-data-lab/issues/17
      const projectilesInSelectedSample = this.getProjectilesInSelectedSample();

      // TODO: This wouldn't work if we ever have sample size = 1, see https://github.com/phetsims/projectile-data-lab/issues/17
      if ( projectilesInSelectedSample.length > 1 ) {
        this.sampleMeanProperty.value = _.mean( projectilesInSelectedSample.map( projectile => projectile.x ) );
      }
      else {
        this.sampleMeanProperty.value = null;
      }
    } );

    Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => {
      this.updateCounts();
    } );
  }

  public getProjectilesInSelectedSample(): Projectile[] {
    return this.getAllProjectiles().filter( projectile => projectile.sampleNumber === this.selectedSampleProperty.value );
  }

  /**
   * Return an array of samples, where each sample is an object with a single property, x, which is the mean of the
   * projectiles in that sample. This is used for the histogram.
   */
  public getSamples(): HistogramData[] {
    const samples: HistogramData[] = [];
    for ( let sampleNumber = 1; sampleNumber <= this.numberOfCompletedSamplesProperty.value; sampleNumber++ ) {

      const members = this.landedProjectiles.filter( projectile => projectile.sampleNumber === sampleNumber );

      assert && assert( members.length === this.sampleSize, 'members should have the correct length. sampleNumber = ' + sampleNumber + ', members.length = ' + members.length + ', this.sampleSize = ' + this.sampleSize );

      const mean = _.mean( members.map( projectile => projectile.x ) );
      assert && assert( !isNaN( mean ), 'mean should not be NaN' );

      samples.push( { x: mean } );
    }
    return samples;
  }

  // NOTE: you probably want to this.updateCounts(); after calling this.
  public createLandedProjectile(): void {
    const projectile = this.createProjectile( this.numberOfCompletedSamplesProperty.value + 1 );
    projectile.setLanded();

    this.landedProjectiles.push( projectile );
    this.projectilesChangedEmitter.emit();
  }

  public override updateCounts(): void {
    const totalProjectiles = this.getTotalProjectileCount();

    const completed = Math.floor( totalProjectiles / this.sampleSize );
    const hasStartedAnUnfinishedSample = totalProjectiles % this.sampleSize !== 0;

    this.numberOfCompletedSamplesProperty.value = completed;
    this.numberOfStartedSamplesProperty.value = completed + ( hasStartedAnUnfinishedSample ? 1 : 0 );
  }

  public startNewSample(): void {

    // When starting a new sample, the mean indicator should be hidden.
    this.sampleMeanProperty.value = null;

    // Any time we start a new sample, if an old sample was in-progress, we must complete it immediately/synchronously
    // before starting the new one. Typically, this would only happen when the user clicks the launch button while
    // continuous launching is enabled.
    let updated = false;
    while ( this.getTotalProjectileCount() % this.sampleSize !== 0 ) {
      this.createLandedProjectile();
      updated = true;
    }

    // Make sure we are pointing at the right sample for the new Projectile
    updated && this.updateCounts();

    // Create the first projectile in the new sample if there is none, otherwise immediately clear and schedule one
    // to appear when the timer expires.
    if ( this.getTotalProjectileCount() === 0 ) {
      this.createLandedProjectile();
    }

    // Show the new sample in the selector panel. Note this means if sample 2/8 was selected, then we
    // create a new one, it will jump to 9/9. This is the desired behavior.
    this.selectedSampleProperty.value = this.numberOfStartedSamplesProperty.value + 1;

    this.updateCounts();
  }

  public step( dt: number, launchMode: 'continuous' | 'single', isContinuousLaunching: boolean ): void {
    this.time += dt;
    const timeInMode = this.time - this.phaseStartTime;

    const updateMean = () => {
      const projectilesInSelectedSample = this.getProjectilesInSelectedSample();
      if ( projectilesInSelectedSample.length > 0 ) {
        this.sampleMeanProperty.value = _.mean( projectilesInSelectedSample.map( projectile => projectile.x ) );
      }
      else {
        this.sampleMeanProperty.value = null;
      }
    };

    if ( this.phase === 'idle' ) {

      // Nothing to do, waiting for user to press the launch button
    }
    else if ( this.phase === 'showingClearPresample' ) {

      if ( timeInMode >= SHOWING_CLEAR_PRESAMPLE_TIME ) {

        if ( launchMode === 'continuous' ) {

          // Create all projectiles for this sample immediately and go into showingSamplePhase
          this.startNewSample();
          while ( this.getProjectilesInSelectedSample().length < this.sampleSize ) {
            this.createLandedProjectile();
          }
          this.updateCounts();
          this.startPhase( 'showingCompleteSampleWithoutMean' );
        }
        else {
          this.startPhase( 'showingProjectiles' );
          this.startNewSample();
        }
      }
    }
    else if ( this.phase === 'showingProjectiles' ) { // Only for single mode

      // The continuous amount we have progressed through the current sample
      const portionOfSample = Math.min( timeInMode / this.totalSampleTime, 1 );

      // Compute the number of projectile that should be showing at this time
      const numberProjectilesToShow = Math.ceil( portionOfSample * this.sampleSize );

      while ( this.getProjectilesInSelectedSample().length < numberProjectilesToShow ) {
        this.createLandedProjectile();
      }
      this.updateCounts();

      // Allow extra time to show focus on the final projectile before showing the sample mean
      if ( timeInMode > this.totalSampleTime ) {
        updateMean();
        this.startPhase( 'showingCompleteSampleWithMean' );
      }
    }
    else if ( this.phase === 'showingCompleteSampleWithoutMean' ) { // Only in continuous mode

      if ( timeInMode > SHOWING_SAMPLE_TIME ) {
        updateMean();
        this.startPhase( 'showingCompleteSampleWithMean' );
      }
    }
    else if ( this.phase === 'showingCompleteSampleWithMean' ) {
      if ( launchMode === 'continuous' && isContinuousLaunching && timeInMode >= SHOWING_SAMPLE_AND_MEAN_TIME ) {
        this.startPhase( 'showingClearPresample' );
        this.selectedSampleProperty.value++;
        this.updateCounts();
      }
    }
  }

  public startPhase( phase: SamplingPhase ): void {
    this.phase = phase;
    this.phaseStartTime = this.time;
    this.phaseChangedEmitter.emit();
  }

  public getPhase(): SamplingPhase {
    return this.phase;
  }

  // When the eraser button is pressed, clear the selected Field's projectiles.
  public override clearProjectiles(): void {
    super.clearProjectiles();

    this.numberOfStartedSamplesProperty.reset();
    this.numberOfCompletedSamplesProperty.reset();

    this.updateCounts();

    this.sampleMeanProperty.reset();
  }
}

projectileDataLab.register( 'SamplingField', SamplingField );

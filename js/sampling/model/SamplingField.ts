// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import Projectile from '../../common/model/Projectile.js';
import HistogramData from '../../common/model/HistogramData.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PDLConstants from '../../common/PDLConstants.js';

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
const SHOWING_CLEAR_PRESAMPLE_TIME = 0.3;
const SHOWING_SAMPLE_TIME = 0.3;
const SHOWING_SAMPLE_AND_MEAN_TIME = 0.3;

// In single mode, we transition through these phases:
// 1. idle (user has not yet pressed the launch button)
// 2. showingClearPresample (on the first sample, this phase only lasts for a single frame).
// 3. showingProjectiles (individual projectiles have highlighted paths)
// 4. showingCompleteSampleWithMean - User can press the launch button, which goes back to 2

// In continuous mode, we transition through these phases:
// 1. idle (user has not yet pressed the launch button)
// 2. showingClearPresample (on the first sample, this phase only lasts for a single frame).
// 3. showingCompleteSampleWithoutMean (user has pressed the launch button, and we are creating a sample)
// 4. showingCompleteSampleWithMean
// GO TO 2

// TODO: Move to a different file, see https://github.com/phetsims/projectile-data-lab/issues/17
const SamplingPhaseValues = [ 'idle', 'showingClearPresample', 'showingProjectiles', 'showingCompleteSampleWithoutMean', 'showingCompleteSampleWithMean' ] as const;
type SamplingPhase = typeof SamplingPhaseValues[ number ];

// TODO: Gracefully handle changes of mode while a sample is in progress, see https://github.com/phetsims/projectile-data-lab/issues/17
// TODO: Gracefully handle starting a new sample when selectedSample < max, see https://github.com/phetsims/projectile-data-lab/issues/17
export default class SamplingField extends Field {
  public override identifier: string;

  public readonly numberOfSamplesWithMeansShowingProperty: NumberProperty;

  // This property is used to set the visibility and position of the mean indicator.
  // If it is null, the current sample is not yet complete and the mean indicator is not visible.
  // Note: In 'Single sample' mode, there is a delay between the last projectile in a sample and the mean indicator appearing.
  // TODO: Get rid of these now that we have phase? See https://github.com/phetsims/projectile-data-lab/issues/17
  public readonly sampleMeanProperty: Property<number | null>;

  // Total elapsed time of running the model, so we can update the current phase and/or move to the next phase.
  private readonly timeProperty: NumberProperty;

  // Mark the time when a phase began, so we can track how long we have been in the phase.
  private readonly phaseStartTimeProperty: NumberProperty;

  // Total time to launch all projectiles in single mode.
  private readonly totalSampleTime: number;

  // Current phase, see documentation above
  public readonly phaseProperty: StringUnionProperty<SamplingPhase>;

  public constructor( public readonly launcher: number,
                      public readonly sampleSize: number,
                      options: SamplingFieldOptions ) {
    super( options );

    this.identifier = window.phetio.PhetioIDUtils.getComponentName( this.phetioID );

    // PhET-iO instrumentation not needed since this is computable from the Projectiles and the phase
    this.numberOfSamplesWithMeansShowingProperty = new NumberProperty( 0 );

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

    this.phaseProperty = new StringUnionProperty<SamplingPhase>( 'idle', {
      validValues: SamplingPhaseValues,
      tandem: options.tandem.createTandem( 'phaseProperty' ),
      phetioDocumentation: 'The sampling screen is managed by a finite state machine. The possible states are called phases. For internal phet-io use only, for managing state save and load.'
    } );

    this.timeProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'timeProperty' ),
      phetioDocumentation: 'The total elapsed time of running the model, so we can update the current phase and/or move to the next phase. For PhET-iO internal use only for managing state save and load.'
    } );

    this.phaseStartTimeProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'phaseStartTimeProperty' ),
      phetioDocumentation: 'Mark the time when a phase began, so we can track how long we have been in the phase. For PhET-iO internal use only for managing state save and load.'
    } );

    const phaseChanged = () => {
      this.phaseStartTimeProperty.value = this.timeProperty.value;
      this.updateNumberOfSamplesWithMeansShowing();
    };
    this.phaseProperty.link( phaseChanged );

    Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => {
      this.updateNumberOfSamplesWithMeansShowing();
    } );
  }

  private updateNumberOfSamplesWithMeansShowing(): void {

    const totalProjectiles = this.getTotalProjectileCount();
    const numCompletedSamples = Math.floor( totalProjectiles / this.sampleSize );
    const numSamplesWithMeansShowing = Math.max( 0, this.phaseProperty.value !== 'showingCompleteSampleWithMean' ? numCompletedSamples - 1 : numCompletedSamples );

    if ( this.phaseProperty.value === 'showingCompleteSampleWithMean' ) {
      this.numberOfSamplesWithMeansShowingProperty.value = numSamplesWithMeansShowing;
      if ( this.landedProjectiles.length === 0 ) {
        assert && assert( this.numberOfSamplesWithMeansShowingProperty.value === 0, 'numberOfSamplesWithMeansShowingProperty should be 0 when there are no projectiles' );
      }
    }
  }

  public getProjectilesInSelectedSample(): Projectile[] {
    return this.getAllProjectiles().filter( projectile => projectile.sampleNumber === this.selectedSampleProperty.value );
  }

  /**
   * Return an array of samples which have their means currently showing. Each sample is an object with a single property, x,
   * which is the mean distance of projectiles in that sample. This is used for the histogram.
   */
  public getHistogramData(): HistogramData[] {

    const samples: HistogramData[] = [];

    for ( let sampleIndex = 0; sampleIndex < this.numberOfSamplesWithMeansShowingProperty.value; sampleIndex++ ) {
      const sampleNumber = sampleIndex + 1;

      const members = this.landedProjectiles.filter( projectile => projectile.sampleNumber === sampleNumber );

      if ( members.length === this.sampleSize ) {

        const mean = _.mean( members.map( projectile => projectile.x ) );
        assert && assert( !isNaN( mean ), 'mean should not be NaN' );

        samples.push( { x: mean } );
      }
      else {
        console.log( `Histogram data shows inconsistent samples for sampleNumber: ${sampleNumber}, members.length = ` + members.length + ', this.sampleSize = ' + this.sampleSize );
      }
    }
    return samples;
  }

  public createLandedProjectile(): void {
    const projectile = this.createProjectile( this.selectedSampleProperty.value );
    projectile.setLanded();

    this.landedProjectiles.push( projectile );
    this.projectilesChangedEmitter.emit();
  }

  public startNewSample(): void {

    // When starting a new sample, the mean indicator should be hidden.
    this.sampleMeanProperty.value = null;

    // Any time we start a new sample, if an old sample was in-progress, we must complete it immediately/synchronously
    // before starting the new one. Typically, this would only happen when the user clicks the launch button while
    // continuous launching is enabled.

    // TODO: Update this to use the phase system - see https://github.com/phetsims/projectile-data-lab/issues/17
    // let updated = false;
    // while ( this.getTotalProjectileCount() % this.sampleSize !== 0 ) {
    //   this.createLandedProjectile();
    //   updated = true;
    // }

    // Show the new sample in the selector panel. Note this means if sample 2/8 was selected, then we
    // create a new one, it will jump to 9/9. This is the desired behavior.

    this.selectedSampleProperty.value++;
  }

  // If the user fires a new sample while a prior sample was in progress, finish up the prior sample.
  // Only relevant for 'single' mode.
  public finishCurrentSample(): void {
    let addedProjectiles = false;
    while ( this.getProjectilesInSelectedSample().length < this.sampleSize ) {
      this.createLandedProjectile();
      addedProjectiles = true;
    }

    if ( addedProjectiles ) {

      // The number of mean counts only updates when in this phase, so we need to adopt this phase temporarily to get
      // that to update
      this.phaseProperty.value = 'showingCompleteSampleWithMean';
    }
  }

  public step( dt: number, launchMode: 'continuous' | 'single', isContinuousLaunching: boolean ): void {
    this.timeProperty.value += dt;
    const timeInMode = this.timeProperty.value - this.phaseStartTimeProperty.value;

    const updateMean = () => {
      const projectilesInSelectedSample = this.getProjectilesInSelectedSample();
      if ( projectilesInSelectedSample.length > 0 ) {
        this.sampleMeanProperty.value = _.mean( projectilesInSelectedSample.map( projectile => projectile.x ) );
      }
      else {
        this.sampleMeanProperty.value = null;
      }
    };

    if ( this.phaseProperty.value === 'idle' ) {

      // Nothing to do, waiting for user to press the launch button
    }
    else if ( this.phaseProperty.value === 'showingClearPresample' ) {

      // If this is the first sample on the current field, do not delay the start of the sample
      // Otherwise, wait for SHOWING_CLEAR_PRESAMPLE_TIME while highlighting the first projectile
      if ( this.landedProjectiles.length === 0 || timeInMode >= SHOWING_CLEAR_PRESAMPLE_TIME ) {

        if ( launchMode === 'continuous' ) {

          // Create all projectiles for this sample immediately and go into showingSamplePhase
          while ( this.getProjectilesInSelectedSample().length < this.sampleSize ) {
            this.createLandedProjectile();
          }
          this.phaseProperty.value = 'showingCompleteSampleWithoutMean';
        }
        else {
          this.phaseProperty.value = 'showingProjectiles';
        }
      }
    }
    else if ( this.phaseProperty.value === 'showingProjectiles' ) { // Only for single mode

      // The continuous amount we have progressed through the current sample
      const portionOfSample = Math.min( timeInMode / this.totalSampleTime, 1 );

      // Compute the number of projectile that should be showing at this time
      const numberProjectilesToShow = Math.ceil( portionOfSample * this.sampleSize );

      while ( this.getProjectilesInSelectedSample().length < numberProjectilesToShow ) {
        this.createLandedProjectile();
      }

      // Allow extra time to show focus on the final projectile before showing the sample mean
      if ( timeInMode > this.totalSampleTime ) {
        this.phaseProperty.value = 'showingCompleteSampleWithMean';
        updateMean();
      }
    }
    else if ( this.phaseProperty.value === 'showingCompleteSampleWithoutMean' ) { // Only in continuous mode

      if ( timeInMode > SHOWING_SAMPLE_TIME ) {

        this.phaseProperty.value = 'showingCompleteSampleWithMean';
        updateMean();
      }
    }
    else if ( this.phaseProperty.value === 'showingCompleteSampleWithMean' ) {
      if (
        launchMode === 'continuous' &&
        isContinuousLaunching && timeInMode >= SHOWING_SAMPLE_AND_MEAN_TIME &&
        this.numberOfSamplesWithMeansShowingProperty.value < PDLConstants.MAX_SAMPLES_PER_FIELD
      ) {
        this.phaseProperty.value = 'showingClearPresample';
        this.startNewSample();
      }
    }
  }

  // When the eraser button is pressed, clear the selected Field's projectiles.
  public override clearProjectiles(): void {
    super.clearProjectiles();

    this.phaseProperty.reset();
    this.numberOfSamplesWithMeansShowingProperty.reset();
    this.sampleMeanProperty.reset();
  }
}

projectileDataLab.register( 'SamplingField', SamplingField );

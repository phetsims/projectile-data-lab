// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Projectile from '../../common/model/Projectile.js';
import PDLEventTimer from '../../common/model/PDLEventTimer.js';
import HistogramData from '../../common/model/HistogramData.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';

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

// When running in continuous mode, show all projectiles appearing at once. This allows us to compute the mean
// immediately, and it looks better in the histogram, showing the selected part. There is no flickering. The user
// can still see data sweep in when in single mode.
const WITHIN_SAMPLE_TIME_CONTINUOUS = 0;

// This is the delay between the last projectile landing and the mean symbol appearing, in 'Single sample' mode.
const MEAN_SYMBOL_DELAY_TIME = 0.3;
const NEXT_SAMPLE_DELAY_TIME = 0.5;

export default class SamplingField extends Field {
  public override identifier: string;

  private readonly withinSampleTimer: PDLEventTimer;
  private readonly betweenSamplesTimer = new PDLEventTimer( MEAN_SYMBOL_DELAY_TIME + NEXT_SAMPLE_DELAY_TIME );

  // After a sample completes, this timer counts down until we show the mean indicator.
  private meanIndicatorDelayTimer: PDLEventTimer | null = null;

  // The simulation begins with 0 samples, showing sample 0 of 0. When a sample begins, this number increases. This is
  // a convenience Property to simplify the user interface -- it is fully computable from the Projectiles.
  public readonly numberOfStartedSamplesProperty: NumberProperty;

  // In order to show an accumulating sample, we must differentiate between the total samples and total completed samples.
  // This is a convenience Property to simplify the user interface -- it is fully computable from the Projectiles.
  public readonly numberOfCompletedSamplesProperty: NumberProperty;

  // This property is used to set the visibility and position of the mean indicator.
  // If it is null, the current sample is not yet complete and the mean indicator is not visible.
  // Note: In 'Single sample' mode, there is a delay between the last projectile in a sample and the mean indicator appearing.
  public readonly sampleMeanProperty: Property<number | null>;

  // private currentLandedCount = 0;
  private readonly singleModeWithinSamplePeriod: number;

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
    const totalSampleTime =
      this.sampleSize === 2 ? 0.5 :
      this.sampleSize === 5 ? 1 :
      this.sampleSize === 15 ? 1.5 :
      this.sampleSize === 40 ? 2 :
      0;

    assert && assert( totalSampleTime > 0, 'totalSampleTime should be greater than 0' );

    this.sampleMeanProperty = new Property<number | null>( null, {
      reentrant: true
    } );

    this.singleModeWithinSamplePeriod = totalSampleTime / this.sampleSize;

    this.withinSampleTimer = new PDLEventTimer( this.singleModeWithinSamplePeriod );

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

    this.betweenSamplesTimer.stop();
    this.withinSampleTimer.restart();

    this.updateCounts();
  }

  public step( dt: number, isContinuousLaunching: boolean ): void {
    if ( this.meanIndicatorDelayTimer !== null ) {
      this.meanIndicatorDelayTimer.step( dt, () => {
        const projectilesInSelectedSample = this.getProjectilesInSelectedSample();
        if ( projectilesInSelectedSample.length > 0 ) {
          this.sampleMeanProperty.value = _.mean( projectilesInSelectedSample.map( projectile => projectile.x ) );
        }
        else {
          this.sampleMeanProperty.value = null;
        }
        this.meanIndicatorDelayTimer = null;
      } );
    }

    if ( isContinuousLaunching ) {

      // TODO: For https://github.com/phetsims/projectile-data-lab/issues/17, show a "blank" phase as part of the rhythm
      this.betweenSamplesTimer.step( dt, () => {
        this.startNewSample();
      } );
    }

    this.withinSampleTimer.step( dt, () => {

      this.createLandedProjectile();
      this.updateCounts();

      if ( this.getTotalProjectileCount() % this.sampleSize === 0 ) {

        // When a sample is completed, timeSinceSampleFinished will be set from null to 0
        this.meanIndicatorDelayTimer = new PDLEventTimer( MEAN_SYMBOL_DELAY_TIME );
        this.meanIndicatorDelayTimer.restart();

        // Finished a sample, schedule the next one to begin soon
        this.withinSampleTimer.stop();
        this.betweenSamplesTimer.restart();
      }
    } );
  }

  // When the eraser button is pressed, clear the selected Field's projectiles.
  public override clearProjectiles(): void {
    super.clearProjectiles();

    this.numberOfStartedSamplesProperty.reset();
    this.numberOfCompletedSamplesProperty.reset();

    this.withinSampleTimer.stop();
    this.betweenSamplesTimer.stop();

    this.updateCounts();

    this.sampleMeanProperty.reset();
    this.meanIndicatorDelayTimer = null;
  }

  public setLaunchMode( launchMode: 'single' | 'continuous' ): void {
    this.withinSampleTimer.setPeriod( launchMode === 'single' ? this.singleModeWithinSamplePeriod : WITHIN_SAMPLE_TIME_CONTINUOUS / this.sampleSize );
  }
}

projectileDataLab.register( 'SamplingField', SamplingField );

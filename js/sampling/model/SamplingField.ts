// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Projectile from '../../common/model/Projectile.js';
import PDLEventTimer from '../../common/model/PDLEventTimer.js';
import HistogramData from '../../common/model/HistogramData.js';
import Tandem from '../../../../tandem/js/Tandem.js';

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

const WITHIN_SAMPLE_TIME_CONTINUOUS = 0.2;

export default class SamplingField extends Field {
  public override identifier: string;

  private readonly withinSampleTimer: PDLEventTimer;
  private readonly betweenSamplesTimer = new PDLEventTimer( 0.2 );

  // The simulation begins with 0 samples, showing sample 0 of 0. When a sample begins, this number increases. This is
  // a convenience Property to simplify the user interface -- it is fully computable from the Projectiles.
  public readonly numberOfStartedSamplesProperty: NumberProperty;

  // In order to show an accumulating sample, we must differentiate between the total samples and total completed samples.
  // This is a convenience Property to simplify the user interface -- it is fully computable from the Projectiles.
  public readonly numberOfCompletedSamplesProperty: NumberProperty;

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
      this.sampleSize === 5 ? 0.75 :
      this.sampleSize === 15 ? 0.85 :
      this.sampleSize === 40 ? 1 :
      0;

    assert && assert( totalSampleTime > 0, 'totalSampleTime should be greater than 0' );

    this.singleModeWithinSamplePeriod = totalSampleTime / this.sampleSize;

    this.withinSampleTimer = new PDLEventTimer( this.singleModeWithinSamplePeriod );

    this.presetLauncherProperty.value = launcher;
    this.updateCounts();

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

  public updateCounts(): void {
    const totalProjectiles = this.getTotalProjectileCount();

    const completed = Math.floor( totalProjectiles / this.sampleSize );
    const started = totalProjectiles % this.sampleSize + completed;

    this.numberOfStartedSamplesProperty.value = started;
    this.numberOfCompletedSamplesProperty.value = completed;
  }

  public startNewSample(): void {
    this.createLandedProjectile();
    this.selectedSampleProperty.value++;

    this.betweenSamplesTimer.stop();
    this.withinSampleTimer.restart();

    this.updateCounts();
  }

  public step( dt: number, isContinuousLaunching: boolean ): void {

    if ( isContinuousLaunching ) {
      this.betweenSamplesTimer.step( dt, () => {
        this.startNewSample();
      } );
    }

    this.withinSampleTimer.step( dt, () => {

      this.createLandedProjectile();
      this.updateCounts();

      if ( this.getTotalProjectileCount() % this.sampleSize === 0 ) {

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
  }

  public setLaunchMode( launchMode: 'single' | 'continuous' ): void {
    this.withinSampleTimer.setPeriod( launchMode === 'single' ? this.singleModeWithinSamplePeriod : WITHIN_SAMPLE_TIME_CONTINUOUS / this.sampleSize );
  }
}

projectileDataLab.register( 'SamplingField', SamplingField );

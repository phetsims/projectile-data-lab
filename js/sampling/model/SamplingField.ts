// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Projectile from '../../common/model/Projectile.js';
import PDLEventTimer from '../../common/model/PDLEventTimer.js';

/**
 * The SamplingField is an extension of the Field class that adds fields for the Sampling model.
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

  public readonly numberOfSamplesProperty: NumberProperty;
  public readonly numberOfCompletedSamplesProperty: NumberProperty;

  private currentLandedCount = 0;
  private readonly singleModeWithinSamplePeriod: number;

  public constructor( public readonly launcher: number, public readonly sampleSize: number, options: SamplingFieldOptions ) {
    super( options );

    this.identifier = window.phetio.PhetioIDUtils.getComponentName( this.phetioID );

    this.numberOfSamplesProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'numberOfSamplesProperty' ),
      phetioDocumentation: 'the number of samples collected'
    } );

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
  }

  public getProjectilesInCurrentSample(): Projectile[] {
    return this.landedProjectiles.filter( projectile => projectile.sampleNumber === this.selectedSampleProperty.value );
  }

  public createLandedProjectile(): void {
    const projectile = this.createProjectile( this.numberOfSamplesProperty.value );
    projectile.setLanded();

    this.landedProjectiles.push( projectile );
    this.projectilesChangedEmitter.emit();
    this.currentLandedCount++;
  }

  public startNewSample(): void {
    this.selectedSampleProperty.value++;
    this.numberOfSamplesProperty.value++;
    this.currentLandedCount = 0;
    this.createLandedProjectile();

    this.betweenSamplesTimer.stop();
    this.withinSampleTimer.restart();
  }

  // TODO: Some of this logic should be called from SamplingModel, like we do in VSMModel.step (maybe?) https://github.com/phetsims/projectile-data-lab/issues/7
  public step( dt: number, isContinuousLaunching: boolean ): void {

    if ( isContinuousLaunching ) {
      this.betweenSamplesTimer.step( dt, () => {
        this.startNewSample();
      } );
    }

    this.withinSampleTimer.step( dt, () => {

      this.createLandedProjectile();

      if ( this.currentLandedCount === this.sampleSize ) {
        this.numberOfCompletedSamplesProperty.value++;

        // Finished a sample, schedule the next one to begin soon
        this.withinSampleTimer.stop();
        this.betweenSamplesTimer.restart();
      }
    } );
  }

  // When the eraser button is pressed, clear the selected Field's projectiles.
  public override clearProjectiles(): void {
    super.clearProjectiles();

    this.numberOfSamplesProperty.reset();
    this.currentLandedCount = 0;

    this.numberOfCompletedSamplesProperty.reset();

    this.withinSampleTimer.stop();
    this.betweenSamplesTimer.stop();
  }

  public setLaunchMode( launchMode: 'single' | 'continuous' ): void {
    this.withinSampleTimer.setPeriod( launchMode === 'single' ? this.singleModeWithinSamplePeriod : WITHIN_SAMPLE_TIME_CONTINUOUS / this.sampleSize );
  }
}

projectileDataLab.register( 'SamplingField', SamplingField );

// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Projectile from '../../common/model/Projectile.js';

/**
 * The SamplingField is an extension of the Field class that adds fields for the Sampling model.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type SamplingFieldOptions = SelfOptions & FieldOptions;

export default class SamplingField extends Field {
  public override identifier: string;

  private elapsedTimeIntraSample = 0;
  public readonly numberOfSamplesProperty: NumberProperty;
  public readonly numberOfCompletedSamplesProperty: NumberProperty;

  public currentLandedCount = 0;
  public timeBetweenProjectiles: number;
  public currentTime = 0;
  public lastSampleCompletionTime: number | null = null;

  // TODO: In 'continuous' mode, this should be 0.2 - see https://github.com/phetsims/projectile-data-lab/issues/7
  private interSampleTime = 0.5;

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

    // TODO: In 'continuous' mode, totalSampleTime should be 0.2 - see https://github.com/phetsims/projectile-data-lab/issues/7
    this.timeBetweenProjectiles = totalSampleTime / this.sampleSize;

    this.presetLauncherProperty.value = launcher;
  }

  public getProjectilesInCurrentSample(): Projectile[] {
    return this.projectiles.filter( projectile => projectile.sampleNumber === this.selectedSampleProperty.value );
  }

  public createLandedProjectile(): void {
    const projectile = this.createProjectile( this.numberOfSamplesProperty.value );
    projectile.setLanded( this );

    this.projectiles.push( projectile );
    this.projectilesChangedEmitter.emit();
  }

  public launchProjectile(): void {
    this.selectedSampleProperty.value++;
    this.numberOfSamplesProperty.value++;
    this.createLandedProjectile();
    this.currentLandedCount = 1;
    this.elapsedTimeIntraSample = 0;
  }

  public step( dt: number, isContinuousLaunching: boolean ): void {

    this.currentTime += dt;
    this.elapsedTimeIntraSample += dt;

    if ( isContinuousLaunching && this.lastSampleCompletionTime !== null ) {
      const timeSinceLastSampleCompleted = this.currentTime - this.lastSampleCompletionTime;
      if ( isContinuousLaunching && timeSinceLastSampleCompleted >= this.interSampleTime ) {
        this.launchProjectile();
        this.lastSampleCompletionTime = null;
      }
    }

    while ( this.currentLandedCount > 0 && this.currentLandedCount < this.sampleSize && ( this.elapsedTimeIntraSample - this.timeBetweenProjectiles > 0 ) ) {
      this.createLandedProjectile();
      this.currentLandedCount++;
      this.elapsedTimeIntraSample -= this.timeBetweenProjectiles;

      if ( this.currentLandedCount === this.sampleSize ) {
        this.numberOfCompletedSamplesProperty.value++;
        this.lastSampleCompletionTime = this.currentTime;
      }
    }
  }

  // When the eraser button is pressed, clear the selected Field's projectiles.
  public override clearProjectiles(): void {
    super.clearProjectiles();

    this.elapsedTimeIntraSample = 0;
    this.numberOfSamplesProperty.reset();
    this.currentLandedCount = 0;

    this.numberOfCompletedSamplesProperty.reset();

    this.currentTime = 0;
    this.lastSampleCompletionTime = null;
  }
}

projectileDataLab.register( 'SamplingField', SamplingField );

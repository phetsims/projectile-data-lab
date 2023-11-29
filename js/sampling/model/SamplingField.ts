// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

/**
 * The SamplingField is an extension of the Field class that adds fields for the Sampling model.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type SamplingFieldOptions = SelfOptions & FieldOptions;

export default class SamplingField extends Field {

  private elapsedTime = 0;
  public readonly numberOfSamplesProperty: NumberProperty;
  public readonly selectedSampleProperty: NumberProperty;

  public currentLandedCount = 0;
  public timeBetweenProjectiles: number;

  public constructor( public readonly launcher: number, public readonly sampleSize: number, options: SamplingFieldOptions ) {
    super( options );

    this.numberOfSamplesProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'numberOfSamplesProperty' ),
      phetioDocumentation: 'the number of samples collected'
    } );

    this.selectedSampleProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'selectedSampleProperty' ),
      phetioDocumentation: 'the selected sample'
    } );

    const TIME_BETWEEN_PROJECTILES = 0.5; // seconds

    // constant time per sample, independent of sample size
    this.timeBetweenProjectiles = TIME_BETWEEN_PROJECTILES / this.sampleSize;
  }

  public createLandedProjectile(): void {
    const projectile = this.createProjectile();
    projectile.setLanded( this );

    this.projectiles.push( projectile );
    this.mostRecentlyLaunchedProjectileProperty.value = projectile;
    this.projectilesChangedEmitter.emit();
  }

  public launchButtonPressed(): void {

    this.createLandedProjectile();
    this.currentLandedCount = 1;
    this.elapsedTime = 0;
  }

  public step( dt: number ): void {

    this.elapsedTime += dt;

    while ( this.currentLandedCount > 0 && this.currentLandedCount < this.sampleSize && ( this.elapsedTime - this.timeBetweenProjectiles > 0 ) ) {
      this.createLandedProjectile();
      this.currentLandedCount++;
      this.elapsedTime -= this.timeBetweenProjectiles;
    }
  }
}

projectileDataLab.register( 'SamplingField', SamplingField );

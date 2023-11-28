// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';

/**
 * The SamplingField is an extension of the Field class that adds fields for the Sampling model.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type SamplingFieldOptions = SelfOptions & FieldOptions;

export default class SamplingField extends Field {

  public constructor( options: SamplingFieldOptions ) {
    super( options );
  }

  public createLandedProjectile(): void {
    const projectile = this.createProjectile();
    projectile.setLanded( this );

    this.projectiles.push( projectile );
    this.mostRecentlyLaunchedProjectileProperty.value = projectile;
    this.projectilesChangedEmitter.emit();
  }
}

projectileDataLab.register( 'SamplingField', SamplingField );

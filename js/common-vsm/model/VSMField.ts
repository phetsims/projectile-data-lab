// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';

/**
 * The VSMField is an extension of the Field class that adds fields for the VSM models.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type VSMFieldOptions = SelfOptions & FieldOptions;

export default class VSMField extends Field {

  public constructor( options: VSMFieldOptions ) {
    super( options );
  }

  public launchProjectile(): void {
    const projectile = this.createProjectile();
    this.projectiles.push( projectile );
    this.mostRecentlyLaunchedProjectileProperty.value = projectile;
  }

  public step( dt: number ): void {
    this.projectiles.forEach( projectile => projectile.step( this, dt ) );
    this.projectilesChangedEmitter.emit();
  }
}

projectileDataLab.register( 'VSMField', VSMField );

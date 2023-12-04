// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import Projectile from '../../common/model/Projectile.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import { CustomLauncherType, CustomLauncherTypeValues } from './CustomLauncherType.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import { VSMFieldIdentifier } from './VSMFieldIdentifier.js';
import PDLConstants from '../../common/PDLConstants.js';

/**
 * The VSMField is an extension of the Field class that adds fields for the VSM models.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type VSMFieldOptions = SelfOptions & FieldOptions;

export default class VSMField extends Field {
  public readonly isLauncherCustomProperty: Property<boolean>;
  public readonly customLauncherTypeProperty: Property<CustomLauncherType>;
  public readonly angleStabilizerProperty: NumberProperty;

  public timeElapsedSinceLastLaunch = 0;

  public readonly projectileLaunchedEmitter = new Emitter<[ Projectile ]>( {
    parameters: [ {
      name: 'projectile',
      valueType: Projectile
    } ]
  } );

  public constructor( public readonly identifier: VSMFieldIdentifier, providedOptions: VSMFieldOptions ) {
    super( providedOptions );

    this.isLauncherCustomProperty = new Property<boolean>( false, {
      tandem: providedOptions.tandem.createTandem( 'isLauncherCustomProperty' ),
      phetioDocumentation: 'This property is true when the custom launcher is selected.',
      phetioValueType: BooleanIO
    } );

    this.customLauncherTypeProperty = new Property<CustomLauncherType>( 'SPRING', {
      validValues: CustomLauncherTypeValues,
      tandem: providedOptions.tandem.createTandem( 'customLauncherTypeProperty' ),
      phetioDocumentation: 'This property configures the mechanism of the custom launcher.',
      phetioValueType: StringUnionIO( CustomLauncherTypeValues )
    } );

    this.angleStabilizerProperty = new NumberProperty( 1, {
      range: PDLConstants.ANGLE_STABILIZER_RANGE,
      tandem: providedOptions.tandem.createTandem( 'angleStabilizerProperty' ),
      phetioDocumentation: 'This property configures the width of the angle stabilizer for the custom launcher.'
    } );
  }

  public override launchProjectile(): void {
    if ( this.projectiles.length >= PDLConstants.MAX_PROJECTILES_PER_FIELD ) {
      return;
    }
    this.timeElapsedSinceLastLaunch = 0;

    const projectile = this.createProjectile( 0 );
    this.projectiles.push( projectile );

    this.projectileLaunchedEmitter.emit( projectile );
  }

  public step( dt: number ): void {
    this.timeElapsedSinceLastLaunch += dt;

    this.projectiles.forEach( projectile => projectile.step( this, dt ) );
    this.projectilesChangedEmitter.emit();
  }
}

projectileDataLab.register( 'VSMField', VSMField );

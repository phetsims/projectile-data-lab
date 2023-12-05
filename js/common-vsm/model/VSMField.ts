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
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

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

  public readonly selectedProjectileNumberProperty: NumberProperty;
  public readonly selectedProjectileProperty: TReadOnlyProperty<Projectile | null>;

  public readonly projectileLaunchedEmitter = new Emitter<[ Projectile ]>( {
    parameters: [ {
      name: 'projectile',
      valueType: Projectile
    } ]
  } );
  public readonly landedProjectileCountProperty: NumberProperty;

  public constructor( public readonly identifier: VSMFieldIdentifier, providedOptions: VSMFieldOptions ) {
    super( providedOptions );

    this.selectedProjectileNumberProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'selectedProjectileNumberProperty' ),
      phetioDocumentation: 'This property is the number of the selected projectile, in order of landing. This number is 1-indexed, and 0 means no projectile is selected.'
    } );

    this.selectedProjectileProperty = new DerivedProperty( [ this.selectedProjectileNumberProperty ],
      highlightedProjectileNumber => {
        return this.projectiles[ highlightedProjectileNumber - 1 ] || null;
      } );

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

    this.projectileLandedEmitter.addListener( projectile => {
      this.selectedProjectileNumberProperty.value = this.projectiles.indexOf( projectile ) + 1;
    } );

    // A projectile is counted if it is landed or if it goes below y=0 meters (beyond the 100m mark horizontally)
    this.landedProjectileCountProperty = new NumberProperty( 0 );
    const updateProjectileCountProperty = () => {
      const projectiles = this.projectiles.filter(
        projectile => projectile.phase === 'LANDED' || projectile.phase === 'AIRBORNE_BELOW_FIELD' || projectile.phase === 'LANDED_BELOW_FIELD'
      );
      this.landedProjectileCountProperty.value = projectiles.length;
    };

    // TODO: When phetio-state is set, does it trigger "landed" on things? Probably not. And it probably shouldn't. https://github.com/phetsims/projectile-data-lab/issues/7
    // But in that case we will need to track this data another way.
    this.projectileLandedEmitter.addListener( updateProjectileCountProperty );
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

  public override reset(): void {
    super.reset();

    this.isLauncherCustomProperty.reset();
    this.customLauncherTypeProperty.reset();
    this.angleStabilizerProperty.reset();
  }

  public override clearProjectiles(): void {
    super.clearProjectiles();

    this.selectedProjectileNumberProperty.reset();
    this.landedProjectileCountProperty.reset();
  }
}

projectileDataLab.register( 'VSMField', VSMField );

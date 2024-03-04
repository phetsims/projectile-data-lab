// Copyright 2023-2024, University of Colorado Boulder

/**
 * Type that describes the projectile object, which affects the speed multiplier for the launch of the projectile.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';

export default class ProjectileType extends PhetioObject {
  public readonly speedMultiplierProperty: NumberProperty;

  public constructor( tandem: Tandem, speedMultiplier: number ) {

    super( {
      tandem: tandem,
      phetioType: ProjectileType.ProjectileTypeIO,
      phetioState: false
    } );

    this.speedMultiplierProperty = new NumberProperty( speedMultiplier, {
      tandem: tandem.createTandem( 'speedMultiplierProperty' ),
      phetioFeatured: true,
      range: new Range( 0.5, 1.2 ),
      rangePropertyOptions: {
        tandem: Tandem.OPT_OUT
      },
      phetioDocumentation: 'The multiplier for the mean launch speed for this projectile type'
    } );
  }

  public static ProjectileTypeIO = new IOType<ProjectileType>( 'ProjectileTypeIO', {
    valueType: ProjectileType,
    documentation: 'The type of object being launched.',
    supertype: ReferenceIO( IOType.ObjectIO ),
    defaultDeserializationMethod: 'fromStateObject'
  } );
}

projectileDataLab.register( 'ProjectileType', ProjectileType );

export const CANNONBALL = new ProjectileType( Tandem.GLOBAL_MODEL.createTandem( 'projectileTypes' ).createTandem( 'cannonball' ), 1 );
export const PUMPKIN = new ProjectileType( Tandem.GLOBAL_MODEL.createTandem( 'projectileTypes' ).createTandem( 'pumpkin' ), 1.1 );
export const PIANO = new ProjectileType( Tandem.GLOBAL_MODEL.createTandem( 'projectileTypes' ).createTandem( 'piano' ), 0.9 );
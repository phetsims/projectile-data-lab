// Copyright 2023, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Property from '../../../../axon/js/Property.js';
import { LauncherConfiguration, LauncherConfigurationValues } from './LauncherConfiguration.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import { ProjectileType, ProjectileTypeValues } from './ProjectileType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PDLConstants from '../PDLConstants.js';
import Projectile, { ProjectileStateObject } from './Projectile.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import Emitter from '../../../../axon/js/Emitter.js';
import dotRandom from '../../../../dot/js/dotRandom.js';

type SelfOptions = EmptySelfOptions;
export type FieldOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export default class Field extends PhetioObject {

  public readonly launcherConfigurationProperty: Property<LauncherConfiguration>;

  public readonly projectileTypeProperty: Property<ProjectileType>;

  // Launcher type is the number of the active launcher, from 1-6
  public readonly launcherTypeProperty: Property<number>;

  // Launcher angle is the number of degrees between the launcher and the horizontal axis.
  public readonly launcherAngleProperty: Property<number>;

  // Launcher height is the vertical distance between the launch point and the origin, in field units.
  public readonly launcherHeightProperty: Property<number>;

  public readonly projectiles: Projectile[] = [];

  public readonly projectilesChangedEmitter = new Emitter();

  // REVIEW: Do we really want and need this as a redundant emitter?
  public readonly projectileLandedEmitter;

  public readonly projectilesClearedEmitter;

  // TODO: Refactor this into the emitter pattern - see https://github.com/phetsims/projectile-data-lab/issues/7
  public readonly lastProjectileSpeedProperty;
  public readonly lastProjectileAngleProperty;

  public constructor( providedOptions: FieldOptions ) {
    const options = optionize<FieldOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: Field.FieldIO,
      phetioState: true
    }, providedOptions );

    super( options );

    this.projectileLandedEmitter = new Emitter<[ Projectile ]>( {
      parameters: [ {
        name: 'projectile',
        valueType: Projectile,
        phetioType: Projectile.ProjectileIO
      } ],
      tandem: options.tandem.createTandem( 'projectileLandedEmitter' )
    } );

    this.projectilesClearedEmitter = new Emitter();

    this.launcherConfigurationProperty = new Property<LauncherConfiguration>( 'ANGLE_30', {

      // TODO: On the sampling screen, only allow valid value of 30.  So make the LauncherConfigurationValues an option passed in, see https://github.com/phetsims/projectile-data-lab/issues/7
      validValues: LauncherConfigurationValues,

      // TODO: Do not instrument on the sampling screen, see https://github.com/phetsims/projectile-data-lab/issues/7
      tandem: providedOptions.tandem.createTandem( 'launcherConfigurationProperty' ),
      phetioDocumentation: 'This property configures the angle and height of the cannon. When set to ANGLE_0, the cannon is raised.',
      phetioValueType: StringUnionIO( LauncherConfigurationValues )
    } );

    this.projectileTypeProperty = new Property<ProjectileType>( 'CANNONBALL', {
      validValues: ProjectileTypeValues,
      tandem: providedOptions.tandem.createTandem( 'projectileTypeProperty' ),
      phetioDocumentation: 'This property configures the type of projectile.',
      phetioValueType: StringUnionIO( ProjectileTypeValues )
    } );

    // TODO: Keep in mind that in screens 2-3 it will have more sub-data structure, see https://github.com/phetsims/projectile-data-lab/issues/7
    // TODO: That may be done in another Property in Screen 2 + 3, see https://github.com/phetsims/projectile-data-lab/issues/7
    this.launcherTypeProperty = new Property<number>( 1, {
      validValues: _.range( 1, 7 ),
      tandem: providedOptions.tandem.createTandem( 'launcherTypeProperty' ),
      phetioDocumentation: 'This property configures the active launcher by number.',
      phetioValueType: NumberIO
    } );

    this.launcherAngleProperty = new Property<number>( 30, {
      validValues: [ 0, 30, 45, 60 ],
      tandem: Tandem.OPT_OUT
    } );

    this.launcherHeightProperty = new Property<number>( 0, {
      validValues: [ 0, PDLConstants.RAISED_LAUNCHER_HEIGHT ],
      tandem: Tandem.OPT_OUT
    } );

    this.launcherConfigurationProperty.link( configuration => {

      // REVIEW: Should these be DerivedProperties? YES
      this.launcherAngleProperty.value = Field.angleForConfiguration( configuration );
      this.launcherHeightProperty.value = configuration === 'ANGLE_0' ? PDLConstants.RAISED_LAUNCHER_HEIGHT : 0;
    } );

    this.lastProjectileSpeedProperty = new Property<number>( 0, {
      tandem: providedOptions.tandem.createTandem( 'lastProjectileSpeedProperty' ),
      phetioDocumentation: 'The speed of the last projectile launched.',
      phetioValueType: NumberIO
    } );

    this.lastProjectileAngleProperty = new Property<number>( 0, {
      tandem: providedOptions.tandem.createTandem( 'lastProjectileAngleProperty' ),
      phetioDocumentation: 'The angle of the last projectile launched.',
      phetioValueType: NumberIO
    } );
  }

  public reset(): void {
    this.launcherConfigurationProperty.reset();
    this.projectileTypeProperty.reset();
    this.launcherTypeProperty.reset();
    this.launcherAngleProperty.reset();
    this.launcherHeightProperty.reset();

    this.clearProjectiles();
  }

  public clearProjectiles(): void {
    this.projectiles.length = 0;
    this.projectilesChangedEmitter.emit();

    this.projectilesClearedEmitter.emit();
  }

  public toStateObject(): object {
    return {
      projectiles: this.projectiles.map( projectile => Projectile.ProjectileIO.toStateObject( projectile ) )
    };
  }

  public step( dt: number ): void {
    this.projectiles.forEach( projectile => projectile.step( this, dt ) );
    this.projectilesChangedEmitter.emit();
  }

  public launchProjectile(): void {

    const launchAngle = this.launcherAngleProperty.value + dotRandom.nextGaussian() * 5;
    const launchSpeed = 25 + dotRandom.nextGaussian() * 1;

    // TODO: Let's use radians https://github.com/phetsims/projectile-data-lab/issues/7
    // TODO: Get the field number and screen identifier correct. See https://github.com/phetsims/projectile-data-lab/issues/7
    this.projectiles.push( new Projectile( -1, 'sources', 0, 0, 'CANNONBALL', 'AIRBORNE', 1, 0, 0, launchAngle, launchSpeed, this.launcherHeightProperty.value ) );

    this.lastProjectileAngleProperty.value = launchAngle;
    this.lastProjectileSpeedProperty.value = launchSpeed;
  }

  public static FieldIO = new IOType( 'FieldIO', {
    valueType: Field,
    documentation: 'A field in the Projectile Data Lab', // TODO: https://github.com/phetsims/projectile-data-lab/issues/7 document fully
    defaultDeserializationMethod: 'applyState',
    stateSchema: {
      projectiles: ArrayIO( Projectile.ProjectileIO )
    },
    toStateObject: field => field.toStateObject(),
    applyState: ( field, stateObject ) => {
      field.projectiles.length = 0;
      stateObject.projectiles.forEach( ( projectileStateObject: ProjectileStateObject ) => {
        field.projectiles.push( Projectile.ProjectileIO.fromStateObject( projectileStateObject ) );
      } );
    }
  } );

  private static angleForConfiguration( configuration: LauncherConfiguration ): number {
    switch( configuration ) {
      case 'ANGLE_45':
        return 45;
      case 'ANGLE_60':
        return 60;
      case 'ANGLE_30':
        return 30;
      default:
        return 0;
    }
  }
}

projectileDataLab.register( 'Field', Field );
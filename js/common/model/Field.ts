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
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type SelfOptions = EmptySelfOptions;
export type FieldOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class Field extends PhetioObject {

  public readonly launcherConfigurationProperty: Property<LauncherConfiguration>;

  public readonly projectileTypeProperty: Property<ProjectileType>;

  // TODO: Does every field need a launcher type property, or just the VSM fields? - see https://github.com/phetsims/projectile-data-lab/issues/7
  // (Because the sampling field has a single launcher type per field)
  // Launcher type is the number of the active launcher, from 1-6
  public readonly launcherTypeProperty: Property<number>;

  public readonly launchSpeedAverageProperty: Property<number>;

  public readonly launchSpeedStandardDeviationProperty: Property<number>;

  // Launcher angle is the number of degrees between the launcher and the horizontal axis.
  public readonly launchAngleAverageProperty: Property<number>;

  public readonly launchAngleStandardDeviationProperty: Property<number>;

  // Launcher height is the vertical distance between the launch point and the origin, in field units.
  public readonly launchHeightProperty: Property<number>;

  public readonly isContinuousLaunchingProperty: BooleanProperty;

  public readonly projectiles: Projectile[] = [];

  public readonly projectilesChangedEmitter = new Emitter();

  // REVIEW: Do we really want and need this as a redundant emitter?
  public readonly projectileLandedEmitter;

  public readonly projectilesClearedEmitter;

  public readonly mostRecentlyLaunchedProjectileProperty: Property<Projectile | null>;

  public readonly selectedSampleProperty: NumberProperty;

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

    this.launcherConfigurationProperty = new Property<LauncherConfiguration>( 'ANGLE_45', {

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

    this.isContinuousLaunchingProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isContinuousLaunchingProperty' )
    } );

    this.launchSpeedAverageProperty = new Property<number>( 25, {
      tandem: Tandem.OPT_OUT
    } );

    this.launchSpeedStandardDeviationProperty = new Property<number>( 0, {
      tandem: Tandem.OPT_OUT
    } );

    this.launchAngleAverageProperty = new Property<number>( 30, {
      validValues: [ 0, 30, 45, 60 ],
      tandem: Tandem.OPT_OUT
    } );

    this.launchAngleStandardDeviationProperty = new Property<number>( 0, {
      tandem: Tandem.OPT_OUT
    } );

    this.launchHeightProperty = new Property<number>( 0, {
      validValues: [ 0, PDLConstants.RAISED_LAUNCHER_HEIGHT ],
      tandem: Tandem.OPT_OUT
    } );

    this.selectedSampleProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'selectedSampleProperty' ),
      phetioDocumentation: 'The selected sample being shown on the field.'
    } );

    // Note: this is not phet-io instrumented, but when a Field is restored from phet-io we must set this property
    this.mostRecentlyLaunchedProjectileProperty = new Property<Projectile | null>( null );

    this.launcherConfigurationProperty.link( configuration => {

      // REVIEW: Should these be DerivedProperties? YES
      this.launchAngleAverageProperty.value = Field.angleForConfiguration( configuration );
      this.launchHeightProperty.value = configuration === 'ANGLE_0' ? PDLConstants.RAISED_LAUNCHER_HEIGHT : 0;
    } );

    // Note: This is incorrect for the custom launcher ('Sources' and 'Measures' screens)
    this.launcherTypeProperty.link( launcherType => {
      const launcherProperties = PDLConstants.LAUNCHER_CONFIGS[ launcherType - 1 ];
      this.launchSpeedAverageProperty.value = launcherProperties.speedAverage;
      this.launchSpeedStandardDeviationProperty.value = launcherProperties.speedStandardDeviation;
      this.launchAngleStandardDeviationProperty.value = launcherProperties.angleStandardDeviation;
    } );
  }

  // Get the projectiles that are within the currently selected sample.
  public getProjectilesInCurrentSample(): Projectile[] {
    return this.projectiles.filter( projectile => projectile.sampleNumber === this.selectedSampleProperty.value );
  }

  public reset(): void {
    this.isContinuousLaunchingProperty.reset();
    this.launcherConfigurationProperty.reset();
    this.projectileTypeProperty.reset();
    this.launcherTypeProperty.reset();

    this.clearProjectiles();
  }

  public clearProjectiles(): void {
    this.projectiles.length = 0;

    this.projectilesChangedEmitter.emit();
    this.projectilesClearedEmitter.emit();

    this.mostRecentlyLaunchedProjectileProperty.reset();
    this.selectedSampleProperty.reset();
  }

  protected createProjectile( sampleNumber: number ): Projectile {
    const launchAngle = this.launchAngleAverageProperty.value + dotRandom.nextGaussian() * this.launchAngleStandardDeviationProperty.value; // in degrees
    const launchSpeed = this.launchSpeedAverageProperty.value + dotRandom.nextGaussian() * this.launchSpeedStandardDeviationProperty.value;
    const landedImageIndex = dotRandom.nextInt( 3 );

    // If the projectile type is not a cannonball, set scaleX to either 1 or -1
    const projectileScaleX = this.projectileTypeProperty.value === 'CANNONBALL' ? 1 : dotRandom.nextBoolean() ? 1 : -1;

    // TODO: Get the field number and screen identifier correct. See https://github.com/phetsims/projectile-data-lab/issues/7
    return new Projectile( 'sources', -1, sampleNumber, 0, 0, this.projectileTypeProperty.value,
      'AIRBORNE', projectileScaleX, landedImageIndex, 0, launchAngle, launchSpeed,
      this.launchHeightProperty.value );
  }

  public abstract launchButtonPressed(): void;
  public toStateObject(): object {
    return {
      projectiles: this.projectiles.map( projectile => Projectile.ProjectileIO.toStateObject( projectile ) )
    };
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
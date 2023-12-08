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
import arrayRemove from '../../../../phet-core/js/arrayRemove.js';
import { LaunchMode, LaunchModeValues } from './LaunchMode.js';
import { CustomLauncherSpeedForType, CustomLauncherSpeedSDForType } from '../../common-vsm/model/CustomLauncherType.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;
export type FieldOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

/**
 * The Field is the area where projectiles are launched and land. Each Field manages its own configuration, sequencing,
 * and projectiles.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
export default abstract class Field extends PhetioObject {

  public readonly launchModeProperty: Property<LaunchMode>;

  public readonly launcherConfigurationProperty: Property<LauncherConfiguration>;

  public readonly projectileTypeProperty: Property<ProjectileType>;

  // TODO: Does every field need a launcher type property, or just the VSM fields? - see https://github.com/phetsims/projectile-data-lab/issues/7
  // (Because the sampling field has a single launcher type per field)
  // Launcher type is the number of the active launcher, from 1-6
  public readonly presetLauncherProperty: Property<number>;

  public readonly launchSpeedAverageProperty: Property<number>;

  public readonly launchSpeedStandardDeviationProperty: Property<number>;

  // Launcher angle is the number of degrees between the launcher and the horizontal axis.
  public readonly launchAngleAverageProperty: Property<number>;

  public readonly launchAngleStandardDeviationProperty: Property<number>;

  // Launcher height is the vertical distance between the launch point and the origin, in field units.
  public readonly launchHeightProperty: TReadOnlyProperty<number>;

  public readonly isContinuousLaunchingProperty: BooleanProperty;

  // NOTE: Make sure no Projectile appears in both arrays at the same time

  // TODO: Move airborneParticles to VSM????????? See https://github.com/phetsims/projectile-data-lab/issues/7
  public readonly airborneProjectiles: Projectile[] = [];
  public readonly landedProjectiles: Projectile[] = [];

  public readonly projectilesChangedEmitter = new Emitter();

  public readonly projectileLandedEmitter;

  public readonly projectilesClearedEmitter;

  public readonly selectedSampleProperty: NumberProperty;

  public readonly abstract identifier: string;

  protected constructor( providedOptions: FieldOptions ) {
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
      tandem: options.tandem.createTandem( 'projectileLandedEmitter' ),

      // We must update the arrays before anything else, see below.
      hasListenerOrderDependencies: true
    } );

    this.projectileLandedEmitter.addListener( projectile => {

      assert && assert( this.airborneProjectiles.includes( projectile ), 'projectile should be in airborneProjectiles' );
      assert && assert( !this.landedProjectiles.includes( projectile ), 'projectile should be in airborneProjectiles' );

      arrayRemove( this.airborneProjectiles, projectile );
      this.landedProjectiles.push( projectile );

    } );

    this.projectilesClearedEmitter = new Emitter();

    this.launcherConfigurationProperty = new Property<LauncherConfiguration>( 'ANGLE_45', {

      // TODO: On the sampling screen, only allow valid value of 30.  So make the LauncherConfigurationValues an option passed in, see https://github.com/phetsims/projectile-data-lab/issues/7
      validValues: LauncherConfigurationValues,

      // TODO: Do not instrument on the sampling screen, see https://github.com/phetsims/projectile-data-lab/issues/7
      tandem: providedOptions.tandem.createTandem( 'launcherConfigurationProperty' ),
      phetioDocumentation: 'This property configures the angle and height of the cannon. When set to ANGLE_0_RAISED, the cannon is raised.',
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
    this.presetLauncherProperty = new Property<number>( 1, {
      validValues: _.range( 1, 7 ),
      tandem: providedOptions.tandem.createTandem( 'presetLauncherProperty' ),
      phetioDocumentation: 'This property configures the active launcher by number.',
      phetioValueType: NumberIO
    } );

    this.launchModeProperty = new Property<LaunchMode>( 'single', {
      validValues: LaunchModeValues,
      tandem: providedOptions.tandem.createTandem( 'launchModeProperty' ),
      phetioDocumentation: 'This property indicates whether the launcher is in continuous launch (rapid fire) mode.',
      phetioValueType: StringUnionIO( LaunchModeValues )
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

    this.launchHeightProperty = new DerivedProperty( [ this.launcherConfigurationProperty ], configuration => {
      return configuration === 'ANGLE_0_RAISED' ? PDLConstants.RAISED_LAUNCHER_HEIGHT : 0;
    } );

    this.selectedSampleProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'selectedSampleProperty' ),
      phetioDocumentation: 'The selected sample being shown on the field.'
    } );

    this.launcherConfigurationProperty.link( configuration => {

      // REVIEW: Should these be DerivedProperties? YES
      this.launchAngleAverageProperty.value = Field.angleForConfiguration( configuration );
    } );

    // Note: This is incorrect for the custom launcher ('Sources' and 'Measures' screens)
    this.presetLauncherProperty.link( presetLauncher => {
      const launcherConfig = PDLConstants.LAUNCHER_CONFIGS[ presetLauncher - 1 ];
      this.launchSpeedAverageProperty.value = CustomLauncherSpeedForType( launcherConfig.launcherType );
      this.launchSpeedStandardDeviationProperty.value = CustomLauncherSpeedSDForType( launcherConfig.launcherType );
      this.launchAngleStandardDeviationProperty.value = launcherConfig.angleStandardDeviation;
    } );
  }

  public getTotalProjectileCount(): number {
    return this.airborneProjectiles.length + this.landedProjectiles.length;
  }

  public getAllProjectiles(): Projectile[] {
    return [ ...this.airborneProjectiles, ...this.landedProjectiles ];
  }

  public reset(): void {
    this.isContinuousLaunchingProperty.reset();

    this.launcherConfigurationProperty.reset();
    this.projectileTypeProperty.reset();
    this.presetLauncherProperty.reset();

    this.clearProjectiles();
  }

  protected updateCounts(): void {

    // Available for override in subclasses that must update before triggering emitters
  }

  public clearProjectiles(): void {
    this.airborneProjectiles.length = 0;
    this.landedProjectiles.length = 0;

    this.updateCounts();

    this.projectilesChangedEmitter.emit();
    this.projectilesClearedEmitter.emit();

    this.selectedSampleProperty.reset();
  }

  protected createProjectile( sampleNumber: number ): Projectile {
    const launchAngle = this.launchAngleAverageProperty.value + dotRandom.nextGaussian() * this.launchAngleStandardDeviationProperty.value; // in degrees
    const launchSpeed = this.launchSpeedAverageProperty.value + dotRandom.nextGaussian() * this.launchSpeedStandardDeviationProperty.value;
    const landedImageIndex = dotRandom.nextInt( 3 );

    // If the projectile type is not a cannonball, set isFlippedHorizontally randomly
    const isFlippedHorizontally = this.projectileTypeProperty.value === 'CANNONBALL' ? false : dotRandom.nextBoolean();

    const screenPhetioID = window.phetio.PhetioIDUtils.getScreenID( this.phetioID );
    const screenTandemName = window.phetio.PhetioIDUtils.getComponentName( screenPhetioID );

    return new Projectile( screenTandemName, this.identifier, sampleNumber, 0, 0, this.projectileTypeProperty.value,
      isFlippedHorizontally, landedImageIndex, 0, launchAngle, launchSpeed,
      this.launchHeightProperty.value );
  }

  public toStateObject(): object {
    return {
      airborneProjectiles: this.airborneProjectiles.map( projectile => Projectile.ProjectileIO.toStateObject( projectile ) ),
      landedProjectiles: this.landedProjectiles.map( projectile => Projectile.ProjectileIO.toStateObject( projectile ) )
    };
  }

  public static FieldIO = new IOType( 'FieldIO', {
    valueType: Field,
    documentation: 'A field in the Projectile Data Lab', // TODO: https://github.com/phetsims/projectile-data-lab/issues/7 document fully
    defaultDeserializationMethod: 'applyState',
    stateSchema: {
      airborneProjectiles: ArrayIO( Projectile.ProjectileIO ),
      landedProjectiles: ArrayIO( Projectile.ProjectileIO )
    },
    toStateObject: field => field.toStateObject(),
    applyState: ( field: Field, stateObject ) => {

      field.airborneProjectiles.length = 0;
      field.landedProjectiles.length = 0;

      stateObject.airborneProjectiles.forEach( ( projectileStateObject: ProjectileStateObject ) => {
        field.airborneProjectiles.push( Projectile.ProjectileIO.fromStateObject( projectileStateObject ) );
      } );

      stateObject.landedProjectiles.forEach( ( projectileStateObject: ProjectileStateObject ) => {
        field.landedProjectiles.push( Projectile.ProjectileIO.fromStateObject( projectileStateObject ) );
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
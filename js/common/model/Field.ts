// Copyright 2023-2024, University of Colorado Boulder

import optionize from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Property from '../../../../axon/js/Property.js';
import { AngleForConfiguration, LauncherConfiguration, LauncherConfigurationValues } from './LauncherConfiguration.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import { ProjectileType, ProjectileTypeValues } from './ProjectileType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PDLConstants from '../PDLConstants.js';
import Projectile, { ProjectileStateObject } from './Projectile.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import Emitter from '../../../../axon/js/Emitter.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import arrayRemove from '../../../../phet-core/js/arrayRemove.js';
import { MeanLaunchSpeedForMechanism, SDLaunchSpeedForMechanism } from '../../common-vsm/model/LauncherMechanism.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {

  // Only instrument the launcher configuration property in VSM screens.
  isLauncherConfigurationPhetioInstrumented: boolean;
};
export type FieldOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

/**
 * The Field is the area where projectiles are launched and land. Each Field manages its own configuration, sequencing,
 * and projectiles.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
export default abstract class Field extends PhetioObject {

  public readonly launcherConfigurationProperty: Property<LauncherConfiguration>;

  // The most recent launch angle on this field, in degrees
  public readonly latestLaunchAngleProperty: Property<number>;

  // Launcher angle average is the configured number of degrees between the launcher and the horizontal axis.
  public readonly meanLaunchAngleProperty: TReadOnlyProperty<number>;

  public readonly launchAngleStandardDeviationProperty: Property<number>;

  // Launcher height is the vertical distance between the launch point and the origin, in field units.
  public readonly launchHeightProperty: TReadOnlyProperty<number>;

  // The mean speed of a projectile launched by the launcher, in meters per second
  public readonly meanLaunchSpeedProperty: Property<number>;

  public readonly launchSpeedStandardDeviationProperty: Property<number>;

  public readonly projectileTypeProperty: Property<ProjectileType>;

  // Numerical index (1-based) for the type of the mystery launcher, from 1-6
  public readonly mysteryLauncherProperty: Property<number>;

  public readonly isContinuousLaunchingProperty: BooleanProperty;

  // NOTE: Make sure no Projectile appears in both arrays at the same time
  public readonly airborneProjectiles: Projectile[] = [];
  public readonly landedProjectiles: Projectile[] = [];

  public readonly projectilesChangedEmitter = new Emitter();

  public readonly projectileLandedEmitter: Emitter<[ Projectile ]>;

  public readonly projectilesClearedEmitter: Emitter;

  public readonly selectedSampleProperty: NumberProperty;

  // Are there any landed projectiles in the field? This is used for the data indicator on the field selector panel.
  public readonly isContainingDataProperty = new BooleanProperty( false );

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
      phetioFeatured: true,

      // We must update the arrays before anything else, see below.
      hasListenerOrderDependencies: true
    } );

    const updateIsContainingDataProperty = () => {
      this.isContainingDataProperty.value = this.landedProjectiles.length > 0;
    };

    this.projectileLandedEmitter.addListener( projectile => {

      assert && assert( this.airborneProjectiles.includes( projectile ), 'projectile should be in airborneProjectiles' );
      assert && assert( !this.landedProjectiles.includes( projectile ), 'projectile should be in airborneProjectiles' );

      arrayRemove( this.airborneProjectiles, projectile );
      this.landedProjectiles.push( projectile );

      updateIsContainingDataProperty();
    } );

    // Update after phet-io state set
    Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( updateIsContainingDataProperty );

    this.projectilesClearedEmitter = new Emitter();

    this.projectilesClearedEmitter.addListener( updateIsContainingDataProperty );

    const launcherConfigurationOptions = options.isLauncherConfigurationPhetioInstrumented ? {
      validValues: LauncherConfigurationValues,
      tandem: providedOptions.tandem.createTandem( 'launcherConfigurationProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property configures the height and mean launch angle of the launcher. When set to ANGLE_0_RAISED, the launcher is raised.',
      phetioValueType: StringUnionIO( LauncherConfigurationValues )
    } : { validValues: [ 'angle45' ] } as const;
    this.launcherConfigurationProperty = new Property<LauncherConfiguration>( 'angle45', launcherConfigurationOptions );

    this.meanLaunchAngleProperty = new DerivedProperty( [ this.launcherConfigurationProperty ],
      configuration => {
        return AngleForConfiguration( configuration );
      } );

    this.latestLaunchAngleProperty = new Property<number>( this.meanLaunchAngleProperty.value, {
      tandem: providedOptions.tandem.createTandem( 'latestLaunchAngleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'This property is the current angle of the launcher, in degrees. When a projectile is launched, this property is set to the launch angle.'
                           + ' When the launcher configuration or angle stabilizer changes, this property is set to the configured launch angle.',
      phetioValueType: NumberIO
    } );

    this.launchAngleStandardDeviationProperty = new Property<number>( 0, {
      tandem: providedOptions.tandem.createTandem( 'launchAngleStandardDeviationProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'This property is the standard deviation of the launch angle in degrees.',
      phetioValueType: NumberIO
    } );

    this.launchHeightProperty = new DerivedProperty( [ this.launcherConfigurationProperty ], configuration => {
      return configuration === 'angle0Raised' ? PDLConstants.RAISED_LAUNCHER_HEIGHT : 0;
    }, {
      tandem: providedOptions.tandem.createTandem( 'launchHeightProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'This property is the initial height of launched projectiles in meters.',
      phetioValueType: NumberIO
    } );

    this.projectileTypeProperty = new Property<ProjectileType>( 'cannonball', {
      validValues: ProjectileTypeValues,
      tandem: providedOptions.tandem.createTandem( 'projectileTypeProperty' ),
      phetioDocumentation: 'This property configures the type of projectile.',
      phetioValueType: StringUnionIO( ProjectileTypeValues )
    } );

    // TODO: Keep in mind that in screens 2-3 it will have more sub-data structure, see https://github.com/phetsims/projectile-data-lab/issues/25
    // TODO: That may be done in another Property in Screen 2 + 3, see https://github.com/phetsims/projectile-data-lab/issues/25
    this.mysteryLauncherProperty = new Property<number>( 1, {
      validValues: _.range( 1, 7 ),
      tandem: providedOptions.tandem.createTandem( 'mysteryLauncherProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property configures the active launcher by number.',
      phetioValueType: NumberIO
    } );

    this.isContinuousLaunchingProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isContinuousLaunchingProperty' ),
      phetioFeatured: true
    } );

    // TODO: These should be based on whether the launcher is custom or not, see https://github.com/phetsims/projectile-data-lab/issues/25
    const initialMeanLaunchSpeed = MeanLaunchSpeedForMechanism( 'spring' );
    const initialSDLaunchSpeed = SDLaunchSpeedForMechanism( 'spring' );

    this.meanLaunchSpeedProperty = new Property<number>( initialMeanLaunchSpeed, {
      tandem: providedOptions.tandem.createTandem( 'meanLaunchSpeedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'This property configures the mean launch speed of the launcher.',
      phetioValueType: NumberIO
    } );

    this.launchSpeedStandardDeviationProperty = new Property<number>( initialSDLaunchSpeed, {
      tandem: providedOptions.tandem.createTandem( 'launchSpeedStandardDeviationProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'This property is the standard deviation of the launch speed, in meters per second.',
      phetioValueType: NumberIO
    } );

    this.selectedSampleProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'selectedSampleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The selected sample being shown on the field.'
    } );

    // Note: This is incorrect for the custom launcher ('Sources' and 'Measures' screens)
    this.mysteryLauncherProperty.link( mysteryLauncher => {
      const launcherConfig = PDLConstants.LAUNCHER_CONFIGS[ mysteryLauncher - 1 ];
      this.meanLaunchSpeedProperty.value = MeanLaunchSpeedForMechanism( launcherConfig.launcherMechanism );
      this.launchSpeedStandardDeviationProperty.value = SDLaunchSpeedForMechanism( launcherConfig.launcherMechanism );
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
    this.mysteryLauncherProperty.reset();

    this.clearProjectiles();
  }

  public clearProjectiles(): void {
    this.airborneProjectiles.length = 0;
    this.landedProjectiles.length = 0;

    this.projectilesChangedEmitter.emit();
    this.projectilesClearedEmitter.emit();

    this.selectedSampleProperty.reset();
  }

  protected createProjectile( sampleNumber: number ): Projectile {
    const launchAngle = this.meanLaunchAngleProperty.value + dotRandom.nextGaussian() * this.launchAngleStandardDeviationProperty.value; // in degrees
    const launchSpeed = this.meanLaunchSpeedProperty.value + dotRandom.nextGaussian() * this.launchSpeedStandardDeviationProperty.value;
    const landedImageIndex = dotRandom.nextInt( 3 );

    // If the projectile type is not a cannonball, set isFlippedHorizontally randomly
    const isFlippedHorizontally = this.projectileTypeProperty.value === 'cannonball' ? false : dotRandom.nextBoolean();

    const screenPhetioID = window.phetio.PhetioIDUtils.getScreenID( this.phetioID );
    const screenTandemName = window.phetio.PhetioIDUtils.getComponentName( screenPhetioID );

    return new Projectile( screenTandemName, this.identifier, sampleNumber, 0, 0, this.projectileTypeProperty.value,
      isFlippedHorizontally, landedImageIndex, 0, launchAngle, launchSpeed,
      this.launchHeightProperty.value );
  }

  protected stepAirborneParticles( dt: number ): void {

    // If any projectiles were airborne at the beginning of the step, repaint the canvas at the end
    const numInitialAirborneProjectiles = this.airborneProjectiles.length;

    this.airborneProjectiles.forEach( projectile => {
      projectile.step( this, dt );
    } );

    // Repaint if any projectiles were airborne at the beginning of the step
    if ( numInitialAirborneProjectiles ) {
      this.projectilesChangedEmitter.emit();
    }
  }

  public toStateObject(): object {
    return {
      airborneProjectiles: this.airborneProjectiles.map( projectile => Projectile.ProjectileIO.toStateObject( projectile ) ),
      landedProjectiles: this.landedProjectiles.map( projectile => Projectile.ProjectileIO.toStateObject( projectile ) )
    };
  }

  public static FieldIO = new IOType( 'FieldIO', {
    valueType: Field,
    documentation: 'A field in the Projectile Data Lab. This contains the state for the projectiles, separated into airborne and landed projectiles.',
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
}

projectileDataLab.register( 'Field', Field );
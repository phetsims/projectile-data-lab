// Copyright 2023-2024, University of Colorado Boulder

import optionize from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Property from '../../../../axon/js/Property.js';
import { LauncherConfiguration, LauncherConfigurationValues, MEAN_LAUNCH_ANGLES } from './LauncherConfiguration.js';
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
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Launcher from './Launcher.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Utils from '../../../../dot/js/Utils.js';
import launch_mp3 from '../../../sounds/launch_mp3.js';

const launchSoundClip = new SoundClip( launch_mp3, {
  initialOutputLevel: 1
} );
soundManager.addSoundGenerator( launchSoundClip );

type SelfOptions = {

  // Only instrument the launcher configuration property in VSM screens.
  isLauncherConfigurationPhetioInstrumented: boolean;

  // Only instrument the projectile type property in VSM screens.
  isProjectileTypePhetioInstrumented: boolean;

  // Only instrument the launch height property in VSM screens.
  isLaunchHeightPhetioInstrumented: boolean;
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

  public readonly projectileTypeProperty: Property<ProjectileType>;

  public readonly meanSpeedProperty: DynamicProperty<number, number, Launcher>;

  public readonly standardDeviationSpeedProperty: DynamicProperty<number, number, Launcher>;

  public readonly standardDeviationAngleProperty: DynamicProperty<number, number, Launcher>;

  // Launcher angle average is the configured number of degrees between the launcher and the horizontal axis.
  public readonly meanAngleProperty: TReadOnlyProperty<number>;

  // Launcher height is the vertical distance between the launch point and the origin, in field units.
  public readonly launchHeightProperty: TReadOnlyProperty<number>;

  public readonly isContinuousLaunchingProperty: BooleanProperty;

  // NOTE: Make sure no Projectile appears in both arrays at the same time
  public readonly airborneProjectiles: Projectile[] = [];
  public readonly landedProjectiles: Projectile[] = [];

  public readonly projectilesChangedEmitter = new Emitter();

  public readonly projectileLandedEmitter: Emitter<[ Projectile ]>;

  public readonly projectilesClearedEmitter: Emitter;

  public readonly abstract selectedSampleNumberProperty: NumberProperty;

  // Are there any landed projectiles in the field? This is used for the data indicator on the field selector panel.
  public readonly isContainingDataProperty = new BooleanProperty( false );

  public readonly abstract identifier: string;

  protected constructor(
    public readonly launchers: readonly Launcher[],
    public readonly launcherProperty: Property<Launcher>,
    providedOptions: FieldOptions ) {
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
      phetioDocumentation: 'This property configures the height and mean launch angle of the launcher.',
      phetioValueType: StringUnionIO( LauncherConfigurationValues )
    } : { validValues: [ 'angle45' ] } as const;

    this.launcherConfigurationProperty = new Property<LauncherConfiguration>( 'angle45', launcherConfigurationOptions );

    const projectileTypeOptions = options.isProjectileTypePhetioInstrumented ? {
      validValues: ProjectileTypeValues,
      tandem: providedOptions.tandem.createTandem( 'projectileTypeProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property configures the type of projectile.',
      phetioValueType: StringUnionIO( ProjectileTypeValues )
    } : { validValues: [ 'cannonball' ] } as const;

    this.projectileTypeProperty = new Property<ProjectileType>( 'cannonball', projectileTypeOptions );

    this.meanAngleProperty = new DerivedProperty( [ this.launcherConfigurationProperty ],
      configuration => MEAN_LAUNCH_ANGLES[ configuration ] );

    this.meanSpeedProperty = new DynamicProperty<number, number, Launcher>( this.launcherProperty, {
      bidirectional: true,
      derive: t => t.meanLaunchSpeedProperty
    } );

    this.standardDeviationSpeedProperty = new DynamicProperty<number, number, Launcher>( this.launcherProperty, {
      bidirectional: true,
      derive: t => t.standardDeviationSpeedProperty
    } );

    this.standardDeviationAngleProperty = new DynamicProperty<number, number, Launcher>( this.launcherProperty, {
      bidirectional: true,
      derive: t => t.standardDeviationAngleProperty
    } );

    this.launchHeightProperty = new DerivedProperty( [ this.launcherConfigurationProperty ], configuration => {
      return configuration === 'angle0Raised' ? PDLConstants.RAISED_LAUNCHER_HEIGHT : 0;
    }, {
      tandem: providedOptions.isLaunchHeightPhetioInstrumented ? providedOptions.tandem.createTandem( 'launchHeightProperty' ) : Tandem.OPT_OUT,
      phetioDocumentation: 'This property is the initial height of launched projectiles in meters.',
      phetioValueType: NumberIO
    } );

    this.isContinuousLaunchingProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isContinuousLaunchingProperty' ),
      phetioReadOnly: true
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

    this.launcherProperty.reset();

    this.clearProjectiles();
  }

  public clearProjectiles(): void {
    this.airborneProjectiles.length = 0;
    this.landedProjectiles.length = 0;

    this.projectilesChangedEmitter.emit();
    this.projectilesClearedEmitter.emit();

    this.selectedSampleNumberProperty.reset();
  }

  protected createProjectile( sampleNumber: number, playSound: boolean ): Projectile {
    const angleDeviation = dotRandom.nextGaussian() * this.standardDeviationAngleProperty.value;
    const launchAngle = this.meanAngleProperty.value + angleDeviation;
    const launchSpeed = this.meanSpeedProperty.value + dotRandom.nextGaussian() * this.standardDeviationSpeedProperty.value;
    const landedImageIndex = dotRandom.nextInt( 3 );

    // If the projectile type is not a cannonball, set isFlippedHorizontally randomly
    const isFlippedHorizontally = this.projectileTypeProperty.value === 'cannonball' ? false : dotRandom.nextBoolean();

    const screenPhetioID = window.phetio.PhetioIDUtils.getScreenID( this.phetioID );
    const screenTandemName = window.phetio.PhetioIDUtils.getComponentName( screenPhetioID );

    const launcher = this.launcherProperty.value;

    if ( playSound ) {
      const playbackRate = Utils.linear( 20, 30, 0.4, 0.8, launchSpeed );
      const clamped = Utils.clamp( playbackRate, 0.3, 0.9 );

      launchSoundClip.setPlaybackRate( clamped );
      launchSoundClip.play();
    }

    return new Projectile(
      screenTandemName,
      this.identifier,
      sampleNumber,
      this.launcherConfigurationProperty.value,
      launcher,
      launcher.launcherMechanismProperty.value,
      this.standardDeviationAngleProperty.value,
      0,
      this.launchHeightProperty.value,
      this.projectileTypeProperty.value,
      isFlippedHorizontally,
      landedImageIndex,
      0,
      launchAngle,
      launchSpeed,
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
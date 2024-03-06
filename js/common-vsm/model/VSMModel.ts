// Copyright 2023-2024, University of Colorado Boulder

//REVIEW Incomplete doc. What does this class add?
/**
 * The VSMModel is the base class for the Variability, Sources, and Measurement (VSM) models.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import projectileDataLab from '../../projectileDataLab.js';
import PDLModel, { PDLModelOptions } from '../../common/model/PDLModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import VSMField from './VSMField.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Projectile from '../../common/model/Projectile.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PDLConstants from '../../common/PDLConstants.js';
import Launcher from '../../common/model/Launcher.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';

import stopwatchTick_mp3 from '../../../sounds/stopwatchTick_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import PDLQueryParameters from '../../common/PDLQueryParameters.js';
import PDLPreferences from '../../common/PDLPreferences.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';

const tickSound = new SoundClip( stopwatchTick_mp3, { initialOutputLevel: 1 } );
soundManager.addSoundGenerator( tickSound );

type SelfOptions = {
  isStandardDeviationAnglePropertyPhetioInstrumented: boolean;
};
export type VSMModelOptions<T extends VSMField> = SelfOptions & StrictOmit<PDLModelOptions<T>, 'timeSpeedValues' | 'fields' | 'isPathsVisible' | 'isFieldPropertyPhetioReadonly' | 'fieldPropertyPhetioDocumentation' | 'isPathVisibilityPhetioInstrumented'>;

export default class VSMModel<T extends VSMField> extends PDLModel<T> {

  //REVIEW Declarations of BooleanProperty should be Property<boolean>

  // Static tool visibility
  public readonly isLaunchAngleVisibleProperty: BooleanProperty;
  public readonly isLaunchSpeedVisibleProperty: BooleanProperty;

  // Interactive tool visibility
  public readonly isMeasuringTapeVisibleProperty: BooleanProperty;

  public readonly stopwatch: Stopwatch;

  public readonly measuringTapeBasePositionProperty;
  public readonly measuringTapeTipPositionProperty;

  ////////////////////////////////////////////////////////////////////////////////////////
  // These DynamicProperties select based on the selected VSMField

  public readonly latestLaunchAngleProperty: TReadOnlyProperty<number>;
  public readonly latestLaunchSpeedProperty: TReadOnlyProperty<number>;

  // The angleStabilizerProperty represents the amount of angle stabilization applied to the launcher. The value is between 0 and 1, where 0 means minimum stabilization and 1 means maximum stabilization.
  public readonly angleStabilizerProperty: PhetioProperty<number>;
  public readonly standardDeviationAngleProperty: TReadOnlyProperty<number>;

  public readonly selectedProjectileNumberProperty: PhetioProperty<number>;
  public readonly selectedProjectileProperty: TReadOnlyProperty<Projectile | null>;
  public readonly numberOfLandedProjectilesProperty: TReadOnlyProperty<number>;
  public readonly totalProjectileCountProperty: TReadOnlyProperty<number>;

  public readonly launcherProperty: PhetioProperty<Launcher>;

  // End of DynamicProperties
  ////////////////////////////////////////////////////////////////////////////////////////

  protected constructor( fields: T[], providedOptions: VSMModelOptions<T> ) {

    const options = optionize<VSMModelOptions<T>, SelfOptions, PDLModelOptions<T>>()( {
      timeSpeedValues: [ TimeSpeed.NORMAL, TimeSpeed.FAST ],
      fields: fields,
      isPathsVisible: false,
      isPathVisibilityPhetioInstrumented: true,
      isFieldPropertyPhetioReadonly: false,
      fieldPropertyPhetioDocumentation: 'This Property represents the field that is currently selected.'
    }, providedOptions );
    super( options );

    const allLaunchers: Launcher[] = [];

    this.fields.forEach( field => {
      field.launchers.forEach( launcher => {
        if ( !allLaunchers.includes( launcher ) ) {
          allLaunchers.push( launcher );
        }
      } );
    } );

    // In the VSM screens, the launcher can be chosen independently in each Field
    this.launcherProperty = new DynamicProperty<Launcher, Launcher, T>( this.fieldProperty, {
      bidirectional: true,
      derive: field => field.launcherProperty,
      phetioFeatured: true,
      phetioDocumentation: 'This Property represents the selected launcher within the selected field.',
      tandem: this.fieldProperty.value.launcherProperty.isPhetioInstrumented() ? options.tandem.createTandem( 'launcherProperty' ) : Tandem.OPT_OUT,
      phetioReadOnly: true,
      phetioState: false,
      phetioValueType: ReferenceIO( IOType.ObjectIO ),
      validValues: allLaunchers
    } );

    this.latestLaunchAngleProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      bidirectional: true,
      derive: field => field.latestLaunchAngleProperty
    } );

    this.latestLaunchSpeedProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      bidirectional: true,
      derive: field => field.latestLaunchSpeedProperty
    } );

    this.angleStabilizerProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      bidirectional: true,
      derive: field => field.angleStabilizerProperty,
      tandem: options.isStandardDeviationAnglePropertyPhetioInstrumented ? options.tandem.createTandem( 'angleStabilizerProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true,
      phetioDocumentation: 'The angleStabilizerProperty represents the amount of angle stabilization applied to the launcher. The value is between 0 and 1, where 0 means minimum stabilization and 1 means maximum stabilization.',
      phetioValueType: NumberIO,
      phetioReadOnly: true,
      phetioState: false
    } );

    this.standardDeviationAngleProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      derive: field => field.standardDeviationAngleProperty,
      tandem: options.isStandardDeviationAnglePropertyPhetioInstrumented ? options.tandem.createTandem( 'standardDeviationAngleProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true,
      phetioDocumentation: 'This Property represents the standard deviation of the angle of launch.',
      phetioValueType: NumberIO,
      phetioReadOnly: true,
      phetioState: false
    } );

    this.selectedProjectileNumberProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      bidirectional: true,
      derive: field => field.selectedProjectileNumberProperty,
      phetioFeatured: true,
      phetioDocumentation: 'This Property represents the selected projectile by number (1-indexed)',
      tandem: options.tandem.createTandem( 'selectedProjectileNumberProperty' ),
      phetioValueType: NumberIO,
      phetioReadOnly: true,
      phetioState: false
    } );

    this.selectedProjectileProperty = new DynamicProperty<Projectile | null, Projectile | null, T>( this.fieldProperty, {
      derive: field => field.selectedProjectileProperty
    } );

    this.totalProjectileCountProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      derive: field => field.totalProjectileCountProperty
    } );

    this.numberOfLandedProjectilesProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      derive: field => field.numberOfLandedProjectilesProperty,
      phetioFeatured: true,
      phetioDocumentation: 'This Property represents the number of projectiles that have landed.',
      tandem: options.tandem.createTandem( 'numberOfLandedProjectilesProperty' ),
      phetioReadOnly: true,
      phetioState: false,
      phetioValueType: NumberIO
    } );

    const visiblePropertiesTandem = providedOptions.tandem.createTandem( 'visibleProperties' );

    this.isLaunchAngleVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isLaunchAngleVisibleProperty' ),
      phetioDocumentation: 'This Property indicates whether the launch angle tool is showing.',
      phetioFeatured: true
    } );

    this.isLaunchSpeedVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isLaunchSpeedVisibleProperty' ),
      phetioDocumentation: 'This Property indicates whether the launch speed tool is showing.',
      phetioFeatured: true
    } );

    this.isMeasuringTapeVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isMeasuringTapeVisibleProperty' ),
      phetioFeatured: true
    } );

    const measuringTapeTandem = providedOptions.tandem.createTandem( 'measuringTape' );

    //README Why is this not Vector2Property?
    this.measuringTapeBasePositionProperty = new Property<Vector2>( new Vector2( 0, 0 ), {
      tandem: measuringTapeTandem.createTandem( 'basePositionProperty' ),
      phetioValueType: Vector2.Vector2IO,
      phetioReadOnly: true
    } );

    //README Why is this not Vector2Property?
    this.measuringTapeTipPositionProperty = new Property<Vector2>( new Vector2( 50, 0 ), {
      tandem: measuringTapeTandem.createTandem( 'tipPositionProperty' ),
      phetioValueType: Vector2.Vector2IO,
      phetioReadOnly: true
    } );

    this.stopwatch = new Stopwatch( {
      tandem: providedOptions.tandem.createTandem( 'stopwatch' ),
      phetioFeatured: true,

      // View coordinates. Positioned so it doesn't overlap with the histogram or field sign.
      position: new Vector2( 650, 350 )
    } );
  }

  /**
   * When the launch button is pressed, the behavior depends on a variety of factors:
   * - If AUTO_GENERATE_DATA_PROPERTY is true, then the field is cleared and new projectiles are generated.
   * - If the singleOrContinuousProperty is 'single', then a single projectile is launched.
   * - If the singleOrContinuousProperty is 'continuous', then isContinuousLaunchingProperty is toggled
   *      If toggled to true, it begins by launching the first projectile in that series.
   *
   * See also the superclass documentation.
   */
  public override launchButtonPressed(): void {

    if ( PDLPreferences.autoGenerateDataProperty.value ) {
      this.fieldProperty.value.clearProjectiles();
      for ( let i = 0; i < PDLQueryParameters.maxProjectilesVSMField; i++ ) {
        this.fieldProperty.value.createLandedProjectile();
      }
    }
    else {
      if ( this.singleOrContinuousProperty.value === 'single' ) {
        this.launchProjectile();
      }
      else {

        this.fieldProperty.value.isContinuousLaunchingProperty.value = !this.fieldProperty.value.isContinuousLaunchingProperty.value;

        if ( this.isContinuousLaunchingProperty.value ) {
          this.launchProjectile();
          this.fieldProperty.value.continuousLaunchTimer.restart();
        }
      }
    }
  }

  public launchProjectile(): void {

    // If the simulation is paused, unpause it.
    this.isPlayingProperty.value = true;

    this.fieldProperty.value.launchProjectile();
  }

  public override step( dt: number ): void {
    super.step( dt );

    if ( !this.isPlayingProperty.value ) {
      return;
    }

    dt = dt * ( this.timeSpeedProperty.value === TimeSpeed.FAST ? PDLConstants.TIME_SPEED_FAST : 1 );

    if ( this.singleOrContinuousProperty.value === 'continuous' && this.isContinuousLaunchingProperty.value ) {

      this.fieldProperty.value.continuousLaunchTimer.step( dt, () => {
        this.launchProjectile();
      } );
    }

    this.fieldProperty.value.step( dt );

    if ( this.stopwatch.isRunningProperty.value ) {

      const oldTime = this.stopwatch.timeProperty.value;

      this.stopwatch.step( dt );

      const time = this.stopwatch.timeProperty.value;

      // if time crossed over an integer second, play a sound
      // do not compete with the launch sound
      if ( time > 0.5 && Math.floor( time ) !== Math.floor( oldTime ) ) {
        tickSound.play();
      }
    }
  }

  public override reset(): void {
    super.reset();

    this.isLaunchAngleVisibleProperty.reset();
    this.isLaunchSpeedVisibleProperty.reset();

    this.isMeasuringTapeVisibleProperty.reset();
    this.measuringTapeBasePositionProperty.reset();
    this.measuringTapeTipPositionProperty.reset();

    this.stopwatch.reset();
  }
}
projectileDataLab.register( 'VSMModel', VSMModel );
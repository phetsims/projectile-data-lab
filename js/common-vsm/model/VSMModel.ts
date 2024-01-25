// Copyright 2023-2024, University of Colorado Boulder

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
import { StopwatchPhase } from './StopwatchPhase.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PDLConstants from '../../common/PDLConstants.js';
import Launcher from '../../common/model/Launcher.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {
  isStandardDeviationAnglePropertyPhetioInstrumented: boolean;
};
export type VSMModelOptions<T extends VSMField> = SelfOptions & StrictOmit<PDLModelOptions<T>, 'timeSpeedValues' | 'fields' | 'isPathsVisible' | 'fieldPropertyPhetioDocumentation'>;

export default class VSMModel<T extends VSMField> extends PDLModel<T> {

  // Static tool visibility
  public readonly isLaunchAngleVisibleProperty: BooleanProperty;
  public readonly isLaunchSpeedVisibleProperty: BooleanProperty;

  // Interactive tool visibility
  public readonly isMeasuringTapeVisibleProperty: BooleanProperty;
  public readonly isStopwatchVisibleProperty: BooleanProperty;

  public readonly stopwatch: Stopwatch;

  public readonly measuringTapeBasePositionProperty;
  public readonly measuringTapeTipPositionProperty;

  public readonly latestLaunchSpeedProperty: DynamicProperty<number, number, T>;

  public readonly standardDeviationAngleProperty: DynamicProperty<number, number, T>;

  public readonly selectedProjectileNumberProperty: DynamicProperty<number, number, T>;
  public readonly selectedProjectileProperty: DynamicProperty<Projectile | null, Projectile | null, T>;
  public readonly landedProjectileCountProperty: DynamicProperty<number, number, T>;
  public readonly totalProjectileCountProperty: DynamicProperty<number, number, T>;
  public readonly stopwatchPhaseProperty: DynamicProperty<StopwatchPhase, StopwatchPhase, T>;
  public readonly stopwatchElapsedTimeProperty: DynamicProperty<number, number, T>;

  public readonly launcherProperty: DynamicProperty<Launcher, Launcher, T>;

  public constructor( fields: T[], providedOptions: VSMModelOptions<T> ) {

    const options = optionize<VSMModelOptions<T>, SelfOptions, PDLModelOptions<T>>()( {
      timeSpeedValues: [ TimeSpeed.NORMAL, TimeSpeed.FAST ],
      fields: fields,
      isPathsVisible: false,
      fieldPropertyPhetioDocumentation: 'This Property represents the field that is currently selected.'
    }, providedOptions );
    super( options );

    // In the VSM screens, the launcher can be chosen independently in each Field
    this.launcherProperty = new DynamicProperty<Launcher, Launcher, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.launcherProperty,
      phetioFeatured: true,
      phetioDocumentation: 'This Property represents the selected launcher within the selected field.',
      tandem: this.fieldProperty.value.launcherProperty.isPhetioInstrumented() ? options.tandem.createTandem( 'launcherProperty' ) : Tandem.OPT_OUT,
      phetioState: false,
      phetioValueType: ReferenceIO( IOType.ObjectIO ),
      validValues: this.fieldProperty.value.launcherProperty.validValues
    } );

    this.latestLaunchSpeedProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.latestLaunchSpeedProperty
    } );

    this.standardDeviationAngleProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.standardDeviationAngleProperty,
      tandem: options.isStandardDeviationAnglePropertyPhetioInstrumented ? options.tandem.createTandem( 'standardDeviationAngleProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true,
      phetioDocumentation: 'This Property represents the standard deviation of the angle of launch.',
      phetioValueType: NumberIO,
      phetioReadOnly: true,
      phetioState: false
    } );

    this.selectedProjectileNumberProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.selectedProjectileNumberProperty,
      phetioFeatured: true,
      phetioDocumentation: 'This Property represents the selected projectile by number (1-indexed)',
      tandem: options.tandem.createTandem( 'selectedProjectileNumberProperty' ),
      phetioValueType: NumberIO
    } );

    this.selectedProjectileProperty = new DynamicProperty<Projectile | null, Projectile | null, T>( this.fieldProperty, {
      derive: t => t.selectedProjectileProperty
    } );

    this.totalProjectileCountProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      derive: t => t.totalProjectileCountProperty
    } );

    this.landedProjectileCountProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      derive: t => t.landedProjectileCountProperty,
      phetioFeatured: true,
      phetioDocumentation: 'This Property represents the number of projectiles that have landed.',
      tandem: options.tandem.createTandem( 'landedProjectileCountProperty' ),
      phetioReadOnly: true,
      phetioState: false,
      phetioValueType: NumberIO
    } );

    this.stopwatchPhaseProperty = new DynamicProperty<StopwatchPhase, StopwatchPhase, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.stopwatchPhaseProperty
    } );

    this.stopwatchElapsedTimeProperty = new DynamicProperty<number, number, T>( this.fieldProperty, {
      derive: t => t.stopwatchElapsedTimeProperty
    } );

    const visiblePropertiesTandem = providedOptions.tandem.createTandem( 'visibleProperties' );

    this.isLaunchAngleVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isLaunchAngleVisibleProperty' ),
      phetioDocumentation: 'This property indicates whether the launch angle tool is showing.',
      phetioFeatured: true
    } );

    this.isLaunchSpeedVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isLaunchSpeedVisibleProperty' ),
      phetioDocumentation: 'This property indicates whether the launch speed tool is showing.',
      phetioFeatured: true
    } );

    this.isMeasuringTapeVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isMeasuringTapeVisibleProperty' ),
      phetioFeatured: true
    } );

    const measuringTapeTandem = providedOptions.tandem.createTandem( 'measuringTape' );

    this.measuringTapeBasePositionProperty = new Property<Vector2>( new Vector2( 0, 0 ), {
      tandem: measuringTapeTandem.createTandem( 'basePositionProperty' ),
      phetioValueType: Vector2.Vector2IO,
      phetioReadOnly: true
    } );

    this.measuringTapeTipPositionProperty = new Property<Vector2>( new Vector2( 50, 0 ), {
      tandem: measuringTapeTandem.createTandem( 'tipPositionProperty' ),
      phetioValueType: Vector2.Vector2IO,
      phetioReadOnly: true
    } );

    this.isStopwatchVisibleProperty = new BooleanProperty( false, {
      tandem: visiblePropertiesTandem.createTandem( 'isStopwatchVisibleProperty' ),
      phetioFeatured: true
    } );

    this.stopwatch = new Stopwatch( {
      tandem: providedOptions.tandem.createTandem( 'stopwatch' )
    } );

    // When the stopwatch is hidden, clear it.
    this.isStopwatchVisibleProperty.link( isStopwatchVisible => {
      if ( !isStopwatchVisible ) {
        this.stopwatchPhaseProperty.value = 'clear';
      }
    } );

    // When displaying the stopwatch or switching field with the stopwatch displayed, stop continuous launching
    Multilink.multilink( [ this.isStopwatchVisibleProperty, this.fieldProperty ],
      ( isStopwatchVisible, field ) => {
        if ( isStopwatchVisible ) {
          field.isContinuousLaunchingProperty.value = false;
        }
      } );

    this.stopwatchPhaseProperty.lazyLink( stopwatchPhase => {
      if ( stopwatchPhase === 'clear' ) {
        this.stopwatch.reset();
        this.fieldProperty.value.stopwatchElapsedTimeProperty.reset();
      }
      else if ( stopwatchPhase === 'running' ) {
        this.stopwatch.isRunningProperty.value = true;
      }
      else {
        this.stopwatch.isRunningProperty.value = false;
      }
    } );
  }

  public override launchButtonPressed(): void {

    if ( this.isStopwatchVisibleProperty.value ) {

      if ( this.stopwatchPhaseProperty.value === 'clear' ) {
        this.stopwatchPhaseProperty.value = 'running';
        this.launchProjectile();
      }
      else if ( this.stopwatchPhaseProperty.value === 'running' ) {
        this.stopwatchPhaseProperty.value = 'stopped';
      }
      else {
        this.stopwatchPhaseProperty.value = 'clear';
      }
    }
    else if ( this.singleOrContinuousProperty.value === 'single' ) {
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

  public launchProjectile(): void {

    // If the simulation is paused, unpause it.
    this.isPlayingProperty.value = true;

    this.fieldProperty.value.launchProjectile();
  }

  public step( dt: number ): void {

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
      this.stopwatch.step( dt );
    }
  }

  public override reset(): void {
    super.reset();

    this.isLaunchAngleVisibleProperty.reset();
    this.isLaunchSpeedVisibleProperty.reset();

    this.isMeasuringTapeVisibleProperty.reset();
    this.isStopwatchVisibleProperty.reset();
    this.stopwatchPhaseProperty.reset();

    this.measuringTapeBasePositionProperty.reset();
    this.measuringTapeTipPositionProperty.reset();

    this.stopwatch.reset();
  }
}
projectileDataLab.register( 'VSMModel', VSMModel );
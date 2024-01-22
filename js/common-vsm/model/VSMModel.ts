// Copyright 2023-2024, University of Colorado Boulder

/**
 * The VSMModel is the base class for the Variability, Sources, and Measurement (VSM) models.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import projectileDataLab from '../../projectileDataLab.js';
import PDLModel, { PDLModelOptions } from '../../common/model/PDLModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import VSMField from './VSMField.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import LauncherMechanism from './LauncherMechanism.js';
import Projectile from '../../common/model/Projectile.js';
import { StopwatchPhase } from './StopwatchPhase.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PDLConstants from '../../common/PDLConstants.js';

type SelfOptions = EmptySelfOptions;
export type VSMModelOptions<T extends VSMField> = SelfOptions & StrictOmit<PDLModelOptions<T>, 'timeSpeedValues' | 'fields' | 'isPathsVisible'>;

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

  public readonly latestLaunchSpeedProperty: DynamicProperty<number, number, VSMField>;

  public readonly customLauncherMechanismProperty: DynamicProperty<LauncherMechanism, LauncherMechanism, VSMField>;
  public readonly standardDeviationAngleProperty: DynamicProperty<number, number, VSMField>;

  public readonly selectedProjectileNumberProperty: DynamicProperty<number, number, VSMField>;
  public readonly selectedProjectileProperty: DynamicProperty<Projectile | null, Projectile | null, VSMField>;
  public readonly landedProjectileCountProperty: DynamicProperty<number, number, VSMField>;
  public readonly totalProjectileCountProperty: DynamicProperty<number, number, VSMField>;
  public readonly stopwatchPhaseProperty: DynamicProperty<StopwatchPhase, StopwatchPhase, VSMField>;
  public readonly stopwatchElapsedTimeProperty: DynamicProperty<number, number, VSMField>;

  public constructor( fields: T[], providedOptions: VSMModelOptions<T> ) {

    const options = optionize<VSMModelOptions<T>, SelfOptions, PDLModelOptions<T>>()( {
      timeSpeedValues: [ TimeSpeed.NORMAL, TimeSpeed.FAST ],
      fields: fields,
      isPathsVisible: false
    }, providedOptions );
    super( options );

    this.latestLaunchSpeedProperty = new DynamicProperty<number, number, VSMField>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.latestLaunchSpeedProperty
    } );

    this.customLauncherMechanismProperty = new DynamicProperty<LauncherMechanism, LauncherMechanism, VSMField>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.customLauncherMechanismProperty
    } );

    this.standardDeviationAngleProperty = new DynamicProperty<number, number, VSMField>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.standardDeviationAngleProperty
    } );

    this.selectedProjectileNumberProperty = new DynamicProperty<number, number, VSMField>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.selectedProjectileNumberProperty,
      phetioFeatured: true,
      phetioDocumentation: 'This Property represents the selected projectile by number (1-indexed)',
      tandem: options.tandem.createTandem( 'selectedProjectileNumberProperty' ),
      phetioValueType: NumberIO
    } );

    this.selectedProjectileProperty = new DynamicProperty<Projectile | null, Projectile | null, VSMField>( this.fieldProperty, {
      derive: t => t.selectedProjectileProperty
    } );

    this.totalProjectileCountProperty = new DynamicProperty<number, number, VSMField>( this.fieldProperty, {
      derive: t => t.totalProjectileCountProperty
    } );

    this.landedProjectileCountProperty = new DynamicProperty<number, number, VSMField>( this.fieldProperty, {
      derive: t => t.landedProjectileCountProperty
    } );

    this.stopwatchPhaseProperty = new DynamicProperty<StopwatchPhase, StopwatchPhase, VSMField>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.stopwatchPhaseProperty
    } );

    this.stopwatchElapsedTimeProperty = new DynamicProperty<number, number, VSMField>( this.fieldProperty, {
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
      phetioValueType: Vector2.Vector2IO
    } );

    this.measuringTapeTipPositionProperty = new Property<Vector2>( new Vector2( 50, 0 ), {
      tandem: measuringTapeTandem.createTandem( 'tipPositionProperty' ),
      phetioValueType: Vector2.Vector2IO
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
    else if ( this.launchModeProperty.value === 'single' ) {
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

    if ( this.launchModeProperty.value === 'continuous' && this.isContinuousLaunchingProperty.value ) {

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
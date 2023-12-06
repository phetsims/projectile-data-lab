// Copyright 2023, University of Colorado Boulder

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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { CustomLauncherType } from './CustomLauncherType.js';
import { VSMFieldIdentifierValues } from './VSMFieldIdentifier.js';
import Projectile from '../../common/model/Projectile.js';

type SelfOptions = EmptySelfOptions;
export type VSMModelOptions = SelfOptions & StrictOmit<PDLModelOptions<VSMField>, 'timeSpeedValues' | 'fields' | 'isPathsVisible'>;

export default class VSMModel extends PDLModel<VSMField> {

  // Static tool visibility
  public readonly isLaunchAngleVisibleProperty: BooleanProperty;
  public readonly isLaunchSpeedVisibleProperty: BooleanProperty;

  // Interactive tool visibility
  public readonly isTargetVisibleProperty: BooleanProperty;
  public readonly isMeasuringTapeVisibleProperty: BooleanProperty;
  public readonly isStopwatchVisibleProperty: BooleanProperty;

  public readonly stopwatch: Stopwatch;

  public readonly measuringTapeBasePositionProperty;
  public readonly measuringTapeTipPositionProperty;

  // TODO: Don't use number, see https://github.com/phetsims/projectile-data-lab/issues/7
  // Did we decide on this?
  // Number is lightweight in the code, but is it best for selecting a launcher via PhET-IO?
  public readonly presetLauncherProperty: DynamicProperty<number, number, VSMField>;

  public readonly customLauncherTypeProperty: DynamicProperty<CustomLauncherType, CustomLauncherType, VSMField>;
  public readonly angleStabilizerProperty: DynamicProperty<number, number, VSMField>;

  // TODO: Do we still need this in VSMModel now that we have VSMCanvasNode? - see see https://github.com/phetsims/projectile-data-lab/issues/7
  // TODO: Or maybe always create it and only instrument in in the sampling screen? see https://github.com/phetsims/projectile-data-lab/issues/7
  public readonly selectedSampleProperty: TReadOnlyProperty<number> = new Property( 0 );

  public readonly selectedProjectileNumberProperty: DynamicProperty<number, number, VSMField>;
  public readonly selectedProjectileProperty: DynamicProperty<Projectile | null, Projectile | null, VSMField>;
  public readonly landedProjectileCountProperty: DynamicProperty<number, number, VSMField>;

  public constructor( providedOptions: VSMModelOptions ) {

    const fieldsTandem = providedOptions.tandem.createTandem( 'fields' );
    const fields = VSMFieldIdentifierValues.map( identifier => {
      return new VSMField( identifier, {
        tandem: fieldsTandem.createTandem( identifier )
      } );
    } );

    const options = optionize<VSMModelOptions, SelfOptions, PDLModelOptions<VSMField>>()( {
      timeSpeedValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      fields: fields,
      isPathsVisible: false
    }, providedOptions );
    super( options );

    this.presetLauncherProperty = new DynamicProperty<number, number, VSMField>( this.fieldProperty, {
      bidirectional: true,
      derive: 'presetLauncherProperty'
    } );

    this.customLauncherTypeProperty = new DynamicProperty<CustomLauncherType, CustomLauncherType, VSMField>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.customLauncherTypeProperty
    } );

    this.angleStabilizerProperty = new DynamicProperty<number, number, VSMField>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.angleStabilizerProperty
    } );

    this.selectedProjectileNumberProperty = new DynamicProperty<number, number, VSMField>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.selectedProjectileNumberProperty
    } );

    this.selectedProjectileProperty = new DynamicProperty<Projectile | null, Projectile | null, VSMField>( this.fieldProperty, {
      derive: t => t.selectedProjectileProperty
    } );

    this.landedProjectileCountProperty = new DynamicProperty<number, number, VSMField>( this.fieldProperty, {
      derive: t => t.landedProjectileCountProperty
    } );

    this.isLaunchAngleVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isLaunchAngleVisibleProperty' )
    } );

    this.isLaunchSpeedVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isLaunchSpeedVisibleProperty' )
    } );

    this.isTargetVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isTargetVisibleProperty' )
    } );

    this.isMeasuringTapeVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isMeasuringTapeVisibleProperty' )
    } );

    this.measuringTapeBasePositionProperty = new Property<Vector2>( new Vector2( 0, 0 ), {
      tandem: providedOptions.tandem.createTandem( 'measuringTapeBasePositionProperty' ),
      phetioValueType: Vector2.Vector2IO
    } );

    this.measuringTapeTipPositionProperty = new Property<Vector2>( new Vector2( 50, 0 ), {
      tandem: providedOptions.tandem.createTandem( 'measuringTapeTipPositionProperty' ),
      phetioValueType: Vector2.Vector2IO
    } );

    this.isStopwatchVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isStopwatchVisibleProperty' )
    } );

    this.stopwatch = new Stopwatch( {
      tandem: providedOptions.tandem.createTandem( 'stopwatch' )
    } );

    // When the stopwatch is hidden, pause it.
    this.isStopwatchVisibleProperty.lazyLink( isStopwatchVisible => {
      if ( !isStopwatchVisible ) {
        this.stopwatch.isRunningProperty.value = false;
      }
    } );
  }

  public override launchButtonPressed(): void {
    if ( this.launchModeProperty.value === 'single' ) {
      this.fieldProperty.value.launchProjectile();
    }
    else {

      this.fieldProperty.value.isContinuousLaunchingProperty.value = !this.fieldProperty.value.isContinuousLaunchingProperty.value;

      if ( this.isContinuousLaunchingProperty.value ) {
        this.fieldProperty.value.launchProjectile();
        this.fieldProperty.value.continuousLaunchTimer.restart();
      }
    }
  }

  public step( dt: number ): void {

    if ( !this.isPlayingProperty.value ) {
      return;
    }

    dt = dt * ( this.timeSpeedProperty.value === TimeSpeed.SLOW ? 0.5 : 1 );

    if ( this.launchModeProperty.value === 'continuous' &&
         this.isContinuousLaunchingProperty.value ) {

      this.fieldProperty.value.continuousLaunchTimer.step( dt, () => {
        this.fieldProperty.value.launchProjectile();
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

    this.isTargetVisibleProperty.reset();
    this.isMeasuringTapeVisibleProperty.reset();
    this.isStopwatchVisibleProperty.reset();

    this.measuringTapeBasePositionProperty.reset();
    this.measuringTapeTipPositionProperty.reset();

    this.stopwatch.reset();
  }
}
projectileDataLab.register( 'VSMModel', VSMModel );
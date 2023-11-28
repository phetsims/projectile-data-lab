// Copyright 2023, University of Colorado Boulder

/**
 * The VSMModel is the base class for the Variability, Sources, and Measurement (VSM) models.
 */
import projectileDataLab from '../../projectileDataLab.js';
import PDLModel, { PDLModelOptions } from '../../common/model/PDLModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Field from '../../common/model/Field.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';

type SelfOptions = EmptySelfOptions;
export type VSMModelOptions = SelfOptions & StrictOmit<PDLModelOptions, 'timeSpeedValues' | 'fields'>;

export default class VSMModel extends PDLModel {

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

  // TODO: Refactor this into the emitter pattern - see https://github.com/phetsims/projectile-data-lab/issues/7
  public readonly lastProjectileSpeedProperty;
  public readonly lastProjectileAngleProperty;

  public constructor( providedOptions: VSMModelOptions ) {

    const fields = _.range( 1, 9 ).map( i => {
      return new Field( {
        tandem: providedOptions.tandem.createTandem( 'field' + i )
      } );
    } );

    const options = optionize<VSMModelOptions, SelfOptions, PDLModelOptions>()( {
      timeSpeedValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      fields: fields
    }, providedOptions );
    super( options );

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

    this.lastProjectileSpeedProperty = new Property<number | null>( null, {
      tandem: providedOptions.tandem.createTandem( 'lastProjectileSpeedProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioDocumentation: 'The speed of the last projectile launched.'
    } );

    this.lastProjectileAngleProperty = new Property<number | null>( null, {
      tandem: providedOptions.tandem.createTandem( 'lastProjectileAngleProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioDocumentation: 'The angle of the last projectile launched.'
    } );
  }

  public override launchProjectile(): void {
    this.fieldProperty.value.launchProjectile();
    this.lastProjectileSpeedProperty.value = this.fieldProperty.value.lastProjectileSpeedProperty.value;
    this.lastProjectileAngleProperty.value = this.fieldProperty.value.lastProjectileAngleProperty.value;
  }

  public override step( dt: number ): void {
    super.step( dt );
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
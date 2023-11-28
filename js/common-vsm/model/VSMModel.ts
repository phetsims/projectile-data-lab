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
import dotRandom from '../../../../dot/js/dotRandom.js';
import VSMField from './VSMField.js';

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

  public constructor( providedOptions: VSMModelOptions ) {

    const fields = _.range( 1, 9 ).map( i => {
      return new VSMField( {
        tandem: providedOptions.tandem.createTandem( 'field' + i )
      } );
    } );

    const options = optionize<VSMModelOptions, SelfOptions, PDLModelOptions<VSMField>>()( {
      timeSpeedValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      fields: fields,
      isPathsVisible: false
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
  }

  public step( dt: number ): void {

    dt = dt * ( this.timeSpeedProperty.value === TimeSpeed.FAST ? 2 :
                this.timeSpeedProperty.value === TimeSpeed.SLOW ? 0.5 :
                1 );

    if ( this.isContinuousLaunchProperty.value && dotRandom.nextDouble() < 0.05 && this.isPlayingProperty.value ) {
      this.fieldProperty.value.launchProjectile();
    }
    if ( this.isPlayingProperty.value ) {
      this.fieldProperty.value.step( dt );
    }

    if ( this.stopwatch.isRunningProperty.value ) {
      this.stopwatch.step( dt );
    }
  }

  public override launchButtonPressed(): void {
    this.fieldProperty.value.launchProjectile();
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
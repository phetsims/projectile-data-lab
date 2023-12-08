// Copyright 2023, University of Colorado Boulder

/**
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VSMModel from '../../common-vsm/model/VSMModel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import VSMField from '../../common-vsm/model/VSMField.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PDLConstants from '../../common/PDLConstants.js';
import { CustomLauncherSpeedForType, CustomLauncherSpeedSDForType } from '../../common-vsm/model/CustomLauncherType.js';
import { VSMFieldIdentifierValues } from '../../common-vsm/model/VSMFieldIdentifier.js';
import MeasuresField from './MeasuresField.js';

type SelfOptions = EmptySelfOptions;

type PDLModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class MeasuresModel extends VSMModel<MeasuresField> {

  private landedDistanceAverageProperty: DynamicProperty<number | null, number | null, MeasuresField>;

  private landedDistanceStandardDeviationProperty: DynamicProperty<number | null, number | null, MeasuresField>;

  public readonly isLauncherCustomProperty: DynamicProperty<boolean, boolean, VSMField>;

  // Static tool visibility
  public readonly isDataMeasuresVisibleProperty: BooleanProperty;
  public readonly isIntervalToolVisibleProperty: BooleanProperty;

  public constructor( providedOptions: PDLModelOptions ) {
    const fieldsTandem = providedOptions.tandem.createTandem( 'fields' );
    const fields = VSMFieldIdentifierValues.map( identifier => {
      return new MeasuresField( identifier, {
        tandem: fieldsTandem.createTandem( identifier )
      } );
    } );

    super( fields, providedOptions );

    this.landedDistanceAverageProperty = new DynamicProperty<number | null, number | null, MeasuresField>( this.fieldProperty, {
      derive: t => t.landedDistanceAverageProperty
    } );

    this.landedDistanceStandardDeviationProperty = new DynamicProperty<number | null, number | null, MeasuresField>( this.fieldProperty, {
      derive: t => t.landedDistanceStandardDeviationProperty
    } );

    this.landedDistanceAverageProperty.link( landedDistance => {
      console.log( 'landedDistanceAverageProperty changed to ' + landedDistance );
    } );

    this.landedDistanceStandardDeviationProperty.link( landedDistance => {
      console.log( 'landedDistanceStandardDeviationProperty changed to ' + landedDistance );
    } );

    this.isLauncherCustomProperty = new DynamicProperty<boolean, boolean, VSMField>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.isLauncherCustomProperty
    } );

    this.isIntervalToolVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isIntervalToolVisibleProperty' )
    } );

    this.isDataMeasuresVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isDataMeasuresVisibleProperty' )
    } );

    fields.forEach( field => {
      Multilink.multilink( [ this.isLauncherCustomProperty, this.customLauncherTypeProperty, this.angleStabilizerProperty ],
        ( isLauncherCustom, customLauncherType, angleStabilizer ) => {
          if ( isLauncherCustom ) {
            field.launchSpeedAverageProperty.value = CustomLauncherSpeedForType( customLauncherType );
            field.launchSpeedStandardDeviationProperty.value = CustomLauncherSpeedSDForType( customLauncherType );
            field.launchAngleStandardDeviationProperty.value = angleStabilizer;
          }
          else {
            // TODO: Does measures model need to know about the preset launcher? - see https://github.com/phetsims/projectile-data-lab/issues/7
            // Set the launch angle standard deviation to the value for the preset launcher.
            const launcherConfig = PDLConstants.LAUNCHER_CONFIGS[ this.presetLauncherProperty.value - 1 ];
            field.launchSpeedAverageProperty.value = CustomLauncherSpeedForType( launcherConfig.launcherType );
            field.launchSpeedStandardDeviationProperty.value = CustomLauncherSpeedSDForType( launcherConfig.launcherType );
            field.launchAngleStandardDeviationProperty.value = launcherConfig.angleStandardDeviation;
          }
        } );
    } );
  }

  public override reset(): void {
    super.reset();

    this.isDataMeasuresVisibleProperty.reset();
    this.isIntervalToolVisibleProperty.reset();
  }
}

projectileDataLab.register( 'MeasuresModel', MeasuresModel );
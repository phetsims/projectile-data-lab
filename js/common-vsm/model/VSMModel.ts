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

type SelfOptions = EmptySelfOptions;
export type VSMModelOptions = SelfOptions & StrictOmit<PDLModelOptions, 'timeSpeedValues' | 'fields'>;

export default class VSMModel extends PDLModel {
  public readonly arePathsVisibleProperty: BooleanProperty;
  public readonly isLaunchAngleVisibleProperty: BooleanProperty;
  public readonly isLaunchSpeedVisibleProperty: BooleanProperty;

  public constructor( providedOptions: VSMModelOptions ) {

    const fields = _.range( 1, 9 ).map( i => new Field( {
      tandem: providedOptions.tandem.createTandem( 'field' + i )
    } ) );

    const options = optionize<VSMModelOptions, SelfOptions, PDLModelOptions>()( {
      timeSpeedValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      fields: fields
    }, providedOptions );
    super( options );

    this.arePathsVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'arePathsVisibleProperty' )
    } );

    this.isLaunchAngleVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isLaunchAngleVisibleProperty' )
    } );

    this.isLaunchSpeedVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isLaunchSpeedVisibleProperty' )
    } );
  }

  public override reset(): void {
    super.reset();
    this.arePathsVisibleProperty.reset();
    this.isLaunchAngleVisibleProperty.reset();
    this.isLaunchSpeedVisibleProperty.reset();
  }
}
projectileDataLab.register( 'VSMModel', VSMModel );
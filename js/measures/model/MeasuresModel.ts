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

type SelfOptions = EmptySelfOptions;

type PDLModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class MeasuresModel extends VSMModel {

  // Static tool visibility
  public readonly areDataMeasuresVisibleProperty: BooleanProperty;
  public readonly isIdealDistributionVisibleProperty: BooleanProperty;

  public readonly isIntervalToolVisibleProperty: BooleanProperty;

  // public readonly launcherConfigurationProperty: DynamicProperty<LauncherConfiguration,Field,Field>;

  public constructor( providedOptions: PDLModelOptions ) {
    super( providedOptions );
    this.isIntervalToolVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isIntervalToolVisibleProperty' )
    } );

    this.areDataMeasuresVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'areDataMeasuresVisibleProperty' )
    } );
    this.isIdealDistributionVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isIdealDistributionVisibleProperty' )
    } );
  }
}

projectileDataLab.register( 'MeasuresModel', MeasuresModel );
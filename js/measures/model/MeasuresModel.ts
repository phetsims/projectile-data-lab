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

type SelfOptions = EmptySelfOptions;

type PDLModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class MeasuresModel extends VSMModel {
  // public readonly launcherConfigurationProperty: DynamicProperty<LauncherConfiguration,Field,Field>;

  public constructor( providedOptions: PDLModelOptions ) {

    super( providedOptions );
  }
}

projectileDataLab.register( 'MeasuresModel', MeasuresModel );
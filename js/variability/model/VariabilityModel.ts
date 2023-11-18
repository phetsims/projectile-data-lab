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
import VSMModel from '../../common/model/VSMModel.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class VariabilityModel extends VSMModel {

  public constructor( providedOptions: ProjectileDataLabModelOptions ) {

    super( providedOptions );
  }
}

projectileDataLab.register( 'VariabilityModel', VariabilityModel );
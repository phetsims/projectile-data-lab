// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TModel from '../../../../joist/js/TModel.js';

type SelfOptions = {
  //TODO add options that are specific to ProjectileDataLabModel here
};

type ProjectileDataLabModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class ProjectileDataLabModel implements TModel {

  public constructor( providedOptions: ProjectileDataLabModelOptions ) {
    //TODO
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}

projectileDataLab.register( 'ProjectileDataLabModel', ProjectileDataLabModel );
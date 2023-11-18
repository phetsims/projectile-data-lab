// Copyright 2023, University of Colorado Boulder

/**
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import VSMModel from '../../common/model/VSMModel.js';

export default class SourcesModel extends VSMModel {

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    // implement me
  }
}

projectileDataLab.register( 'SourcesModel', SourcesModel );
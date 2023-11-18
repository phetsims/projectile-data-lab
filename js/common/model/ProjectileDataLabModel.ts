// Copyright 2023, University of Colorado Boulder

/**
 * Base class for all models in the Projectile Data Lab.
 */
import TModel from '../../../../joist/js/TModel.js';
import projectileDataLab from '../../projectileDataLab.js';

export default class ProjectileDataLabModel implements TModel {
  public constructor() {

    // implement me
  }

  public reset(): void {
    // implement me
  }
}
projectileDataLab.register( 'ProjectileDataLabModel', ProjectileDataLabModel );
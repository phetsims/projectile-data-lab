// Copyright 2023, University of Colorado Boulder

/**
 * Base class for all models in the Projectile Data Lab.
 */
import TModel from '../../../../joist/js/TModel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = EmptySelfOptions;
export type ProjectileDataLabModelOptions = SelfOptions & { tandem: Tandem };

export default class ProjectileDataLabModel implements TModel {
  public constructor( providedOptions: ProjectileDataLabModelOptions ) {

    // implement me
  }

  public reset(): void {
    // implement me
  }
}
projectileDataLab.register( 'ProjectileDataLabModel', ProjectileDataLabModel );
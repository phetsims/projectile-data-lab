// Copyright 2023, University of Colorado Boulder

/**
 * The VSMModel is the base class for the Variability, Sources, and Measurement models.
 * // REVIEW: A better name would be nice.
 */
import projectileDataLab from '../../projectileDataLab.js';
import ProjectileDataLabModel from './ProjectileDataLabModel.js';
import Property from '../../../../axon/js/Property.js';
import { Configuration } from './Configuration.js';

export default class VSMModel extends ProjectileDataLabModel {
  public readonly configurationProperty: Property<Configuration>;

  public constructor() {
    super();

    this.configurationProperty = new Property<Configuration>( 'ANGLE_30' );
  }

  public override reset(): void {
    this.configurationProperty.reset();
  }
}
projectileDataLab.register( 'VSMModel', VSMModel );
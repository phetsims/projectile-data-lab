// Copyright 2023, University of Colorado Boulder

/**
 * The VSMModel is the base class for the Variability, Sources, and Measurement models.
 * // REVIEW: A better name would be nice.
 */
import projectileDataLab from '../../projectileDataLab.js';
import ProjectileDataLabModel, { ProjectileDataLabModelOptions } from './ProjectileDataLabModel.js';
import Property from '../../../../axon/js/Property.js';
import { Configuration, ConfigurationValues } from './Configuration.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';

type SelfOptions = EmptySelfOptions;
export type VSMModelOptions = SelfOptions & ProjectileDataLabModelOptions;

export default class VSMModel extends ProjectileDataLabModel {
  public readonly configurationProperty: Property<Configuration>;

  public constructor( providedOptions: VSMModelOptions ) {
    super( providedOptions );

    this.configurationProperty = new Property<Configuration>( 'ANGLE_30', {
      validValues: ConfigurationValues,
      tandem: providedOptions.tandem.createTandem( 'configurationProperty' ),
      phetioDocumentation: 'Configures the angle of the cannon. When at ANGLE_0, the cannon also rises above the ground.',
      phetioValueType: StringUnionIO( ConfigurationValues )
    } );
  }

  public override reset(): void {
    this.configurationProperty.reset();
  }
}
projectileDataLab.register( 'VSMModel', VSMModel );
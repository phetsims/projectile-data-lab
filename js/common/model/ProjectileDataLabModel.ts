// Copyright 2023, University of Colorado Boulder

/**
 * Base class for all models in the Projectile Data Lab.
 */
import TModel from '../../../../joist/js/TModel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = EmptySelfOptions;
export type ProjectileDataLabModelOptions = SelfOptions & { tandem: Tandem };

export default class ProjectileDataLabModel implements TModel {

  public readonly launcherProperty: Property<number>;
  public readonly binWidthProperty: Property<number>;

  public constructor( providedOptions: ProjectileDataLabModelOptions ) {

    this.launcherProperty = new Property<number>( 1, {
      validValues: [ 1, 2, 3, 4, 5, 6 ],
      tandem: providedOptions.tandem.createTandem( 'launcherProperty' ),
      phetioDocumentation: 'This property configures the active launcher by number.',
      phetioValueType: NumberIO
    } );

    this.binWidthProperty = new Property<number>( 1, {
      validValues: [ 1, 2, 5, 10 ],
      tandem: providedOptions.tandem.createTandem( 'binWidthProperty' ),
      phetioDocumentation: 'This property configures the bin width of the field and histogram.',
      phetioValueType: NumberIO
    } );

  }

  public reset(): void {
    // implement me
  }
}
projectileDataLab.register( 'ProjectileDataLabModel', ProjectileDataLabModel );
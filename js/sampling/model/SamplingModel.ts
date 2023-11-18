// Copyright 2023, University of Colorado Boulder

/**
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import ProjectileDataLabModel from '../../common/model/ProjectileDataLabModel.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SamplingModel extends ProjectileDataLabModel {

  public readonly sampleSizeProperty: Property<number>;

  public constructor( providedOptions: ProjectileDataLabModelOptions ) {
    super( providedOptions );

    this.sampleSizeProperty = new Property<number>( 2, {
      validValues: [ 2, 5, 15, 40 ],
      tandem: providedOptions.tandem.createTandem( 'sampleSizeProperty' ),
      phetioDocumentation: 'This property configures the number of projectiles in a sample',
      phetioValueType: NumberIO
    } );
  }

  /**
   * Resets the model.
   */
  public override reset(): void {
    this.sampleSizeProperty.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    // implement me
  }
}

projectileDataLab.register( 'SamplingModel', SamplingModel );
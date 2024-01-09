// Copyright 2023-2024, University of Colorado Boulder

/**
 * The VariabilityModel for Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VSMModel from '../../common-vsm/model/VSMModel.js';
import VSMField from '../../common-vsm/model/VSMField.js';
import { VSMFieldIdentifierValues } from '../../common-vsm/model/VSMFieldIdentifier.js';

type SelfOptions = EmptySelfOptions;

type PDLModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class VariabilityModel extends VSMModel<VSMField> {

  public constructor( providedOptions: PDLModelOptions ) {

    const fieldsTandem = providedOptions.tandem.createTandem( 'fields' );
    const fields = VSMFieldIdentifierValues.map( identifier => {
      return new VSMField( identifier, {
        tandem: fieldsTandem.createTandem( identifier ),
        phetioFeatured: true
      } );
    } );

    super( fields, providedOptions );
  }
}

projectileDataLab.register( 'VariabilityModel', VariabilityModel );
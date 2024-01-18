// Copyright 2023-2024, University of Colorado Boulder

/**
 * The SourcesModel contains the model for the Sources screen.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VSMModel from '../../common-vsm/model/VSMModel.js';
import { VSMFieldIdentifierValues } from '../../common-vsm/model/VSMFieldIdentifier.js';
import VSMField from '../../common-vsm/model/VSMField.js';
import Launcher from '../../common/model/Launcher.js';
import PDLConstants from '../../common/PDLConstants.js';

type SelfOptions = EmptySelfOptions;

type PDLModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SourcesModel extends VSMModel<VSMField> {

  public constructor( providedOptions: PDLModelOptions ) {

    const fieldsTandem = providedOptions.tandem.createTandem( 'fields' );
    const fields = VSMFieldIdentifierValues.map( ( identifier, index ) => {
      return new VSMField( [ new Launcher( 'custom', 'spring', PDLConstants.CUSTOM_LAUNCHER_DEFAULT_STANDARD_DEVIATION_ANGLE,

        // TODO: https://github.com/phetsims/projectile-data-lab/issues/77 should this be number 1? Or get rid of Launcher.launcherNumber altogether?
        0, {
          tandem: fieldsTandem.createTandem( 'customLauncher' + index )
        } ) ], identifier, {
        tandem: fieldsTandem.createTandem( identifier ),
        phetioFeatured: true
      } );
    } );

    super( fields, true, providedOptions );
  }
}

projectileDataLab.register( 'SourcesModel', SourcesModel );
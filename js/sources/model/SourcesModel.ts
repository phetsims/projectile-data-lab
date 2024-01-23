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
import { SPRING } from '../../common-vsm/model/LauncherMechanism.js';

type SelfOptions = EmptySelfOptions;

type PDLModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SourcesModel extends VSMModel<VSMField> {

  public constructor( providedOptions: PDLModelOptions ) {

    const fieldsTandem = providedOptions.tandem.createTandem( 'fields' );

    const fields = VSMFieldIdentifierValues.map( ( identifier, index ) => {
      const fieldTandem = fieldsTandem.createTandem( identifier );

      const customLauncher = new Launcher(
        'custom',
        SPRING,
        PDLConstants.CUSTOM_LAUNCHER_DEFAULT_STANDARD_DEVIATION_ANGLE,
        1, {
          tandem: fieldTandem.createTandem( 'customLauncher' )
        } );

      return new VSMField( [ customLauncher ], identifier, {
        tandem: fieldTandem,
        phetioFeatured: true,
        isLauncherPropertyPhetioReadOnly: false
      } );
    } );

    super( fields, providedOptions );
  }
}

projectileDataLab.register( 'SourcesModel', SourcesModel );
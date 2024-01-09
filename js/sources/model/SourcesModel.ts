// Copyright 2023, University of Colorado Boulder

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
import { MeanLaunchSpeedForMechanism, SDLaunchSpeedForMechanism } from '../../common-vsm/model/LauncherMechanism.js';
import { VSMFieldIdentifierValues } from '../../common-vsm/model/VSMFieldIdentifier.js';
import VSMField from '../../common-vsm/model/VSMField.js';

type SelfOptions = EmptySelfOptions;

type PDLModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SourcesModel extends VSMModel<VSMField> {

  public constructor( providedOptions: PDLModelOptions ) {

    const fieldsTandem = providedOptions.tandem.createTandem( 'fields' );
    const fields = VSMFieldIdentifierValues.map( identifier => {
      return new VSMField( identifier, {
        tandem: fieldsTandem.createTandem( identifier ),
        phetioFeatured: true
      } );
    } );

    super( fields, providedOptions );

    fields.forEach( field => {
      field.angleStabilizerProperty.link( angleStabilizer => {
        field.launchAngleStandardDeviationProperty.value = angleStabilizer;
      } );
      field.customLauncherTypeProperty.link( customLauncherType => {
        field.meanLaunchSpeedProperty.value = MeanLaunchSpeedForMechanism( customLauncherType );
        field.launchSpeedStandardDeviationProperty.value = SDLaunchSpeedForMechanism( customLauncherType );
      } );
    } );
  }
}

projectileDataLab.register( 'SourcesModel', SourcesModel );
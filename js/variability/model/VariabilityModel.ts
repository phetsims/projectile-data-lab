// Copyright 2023-2024, University of Colorado Boulder

/**
 * The VariabilityModel for Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VSMModel, { VSMModelOptions } from '../../common-vsm/model/VSMModel.js';
import VSMField from '../../common-vsm/model/VSMField.js';
import { VSMFieldIdentifierValues } from '../../common-vsm/model/VSMFieldIdentifier.js';
import { MYSTERY_LAUNCHERS } from '../../common/model/Launcher.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PDLQueryParameters from '../../common/PDLQueryParameters.js';

type SelfOptions = EmptySelfOptions;
type VariabilityModelOptions = SelfOptions & StrictOmit<WithRequired<VSMModelOptions<VSMField>, 'tandem'>, 'isStandardDeviationAnglePropertyPhetioInstrumented'>;

export default class VariabilityModel extends VSMModel<VSMField> {

  public constructor( providedOptions: VariabilityModelOptions ) {

    const options = optionize<VariabilityModelOptions, SelfOptions, VSMModelOptions<VSMField>>()( {
      isStandardDeviationAnglePropertyPhetioInstrumented: false
    }, providedOptions );

    const fieldsTandem = providedOptions.tandem.createTandem( 'fields' );

    const fields = VSMFieldIdentifierValues.map( identifier => {
      return new VSMField( MYSTERY_LAUNCHERS, identifier, {
        tandem: fieldsTandem.createTandem( identifier ),
        phetioFeatured: true,
        isLauncherPropertyPhetioReadOnly: false
      } );
    } );

    super( fields, options );

    // When using the populate flag, we want to populate the model with a large number of projectiles for each field.
    // Each field will use a different launcher.
    if ( PDLQueryParameters.populate ) {
      for ( let f = 0; f < fields.length; f++ ) {
        const myField = fields[ f ];
        this.fieldProperty.value = myField;
        myField.projectileLaunchedEmitter.addListener( projectile => projectile.setLanded() );
        this.launcherProperty.value = MYSTERY_LAUNCHERS[ f ];

        for ( let i = 0; i < 250; i++ ) {
          this.launchProjectile();
        }
      }
    }
  }
}

projectileDataLab.register( 'VariabilityModel', VariabilityModel );
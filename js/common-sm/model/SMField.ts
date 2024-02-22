// Copyright 2024, University of Colorado Boulder

/**
 * The SMField adds functionality common between the Fields in the Sources and Measures screens.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import LauncherMechanism from '../../common-vsm/model/LauncherMechanism.js';
import Launcher from '../../common/model/Launcher.js';
import VSMField, { VSMFieldOptions } from '../../common-vsm/model/VSMField.js';
import projectileDataLab from '../../projectileDataLab.js';
import { VSMFieldIdentifier } from '../../common-vsm/model/VSMFieldIdentifier.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { AUTO_GENERATE_DATA_PROPERTY } from '../../common/PDLQueryParameters.js';

type SelfOptions = EmptySelfOptions;
export type SMFieldOptions = SelfOptions & VSMFieldOptions;

export default class SMField extends VSMField {

  public readonly customLauncherMechanismProperty: DynamicProperty<LauncherMechanism, LauncherMechanism, Launcher>;

  public constructor( launchers: readonly Launcher[], identifier: VSMFieldIdentifier, providedOptions: SMFieldOptions ) {
    super( launchers, identifier, providedOptions );

    this.customLauncherMechanismProperty = new DynamicProperty<LauncherMechanism, LauncherMechanism, Launcher>( this.launcherProperty, {
      bidirectional: true,
      derive: t => t.launcherMechanismProperty
    } );

    this.customLauncherMechanismProperty.lazyLink( () => {
      if ( AUTO_GENERATE_DATA_PROPERTY.value ) {
        this.clearProjectiles();
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this.customLauncherMechanismProperty.reset();
  }
}

projectileDataLab.register( 'SMField', SMField );
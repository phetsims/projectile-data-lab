// Copyright 2024, University of Colorado Boulder

/**
 * The SMModel adds functionality common between the Models in the Sources and Measures screens.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import LauncherMechanism from '../../common-vsm/model/LauncherMechanism.js';
import projectileDataLab from '../../projectileDataLab.js';
import VSMModel, { VSMModelOptions } from '../../common-vsm/model/VSMModel.js';
import SMField from './SMField.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { AUTO_GENERATE_DATA_PROPERTY } from '../../common/PDLQueryParameters.js';

type SelfOptions = EmptySelfOptions;
export type SMModelOptions = SelfOptions & VSMModelOptions<SMField>;

export default class SMModel<T extends SMField> extends VSMModel<T> {

  public readonly customLauncherMechanismProperty: DynamicProperty<LauncherMechanism, LauncherMechanism, T>;

  public constructor( fields: T[], providedOptions: SMModelOptions ) {

    super( fields, providedOptions );

    this.customLauncherMechanismProperty = new DynamicProperty<LauncherMechanism, LauncherMechanism, T>( this.fieldProperty, {
      bidirectional: true,
      derive: t => t.customLauncherMechanismProperty,
      tandem: providedOptions.tandem.createTandem( 'customLauncherMechanismProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This Property represents the mechanism of the custom launcher.',
      phetioReadOnly: true,
      phetioState: false,
      phetioValueType: LauncherMechanism.LauncherMechanismIO
    } );

    this.customLauncherMechanismProperty.lazyLink( () => {
      if ( AUTO_GENERATE_DATA_PROPERTY.value ) {
        this.fieldProperty.value.clearProjectiles();
      }
    } );
  }
}

projectileDataLab.register( 'SMModel', SMModel );
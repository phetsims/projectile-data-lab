// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { Configuration } from '../model/Configuration.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type ConfigurationSectionOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class ConfigurationSection extends VBox {

  public constructor( configurationProperty: Property<Configuration>, providedOptions: ConfigurationSectionOptions ) {

    const title = new Text( 'Configuration' );

    const configurationRadioButtonGroup = new RectangularRadioButtonGroup( configurationProperty, [ {
      value: 'ANGLE_30' as const,
      tandemName: 'angleThirtyRadioButton',
      createNode: () => new Text( '30' )
    }, {
      value: 'ANGLE_45' as const,
      tandemName: 'angleFortyFiveRadioButton',
      createNode: () => new Text( '45' )
    }, {
      value: 'ANGLE_60' as const,
      tandemName: 'angleSixtyRadioButton',
      createNode: () => new Text( '60' )
    }, {
      value: 'ANGLE_0' as const,
      tandemName: 'angleZeroRadioButton',
      createNode: () => new Text( '0' )
    } ], {
      tandem: providedOptions.tandem.createTandem( 'configurationRadioButtonGroup' ),
      orientation: 'horizontal'
    } );
    super( { children: [ title, configurationRadioButtonGroup ] } );
  }
}
projectileDataLab.register( 'ConfigurationSection', ConfigurationSection );
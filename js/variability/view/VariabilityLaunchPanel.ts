// Copyright 2023, University of Colorado Boulder

import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { Node } from '../../../../scenery/js/imports.js';
import ConfigurationSection from '../../common/view/ConfigurationSection.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Configuration } from '../../common/model/Configuration.js';
import Property from '../../../../axon/js/Property.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VariabilityLaunchPanelOptions = SelfOptions & PDLPanelOptions;

export default class VariabilityLaunchPanel extends PDLPanel {

  public constructor( configurationProperty: Property<Configuration>, providedOptions: VariabilityLaunchPanelOptions ) {

    const content = new Node();
    const configurationSection = new ConfigurationSection( configurationProperty, {
      tandem: providedOptions.tandem
    } );

    content.addChild( configurationSection );
    super( content );
  }
}
projectileDataLab.register( 'VariabilityLaunchPanel', VariabilityLaunchPanel );
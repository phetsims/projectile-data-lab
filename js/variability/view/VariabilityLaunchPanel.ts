// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Configuration } from '../../common/model/Configuration.js';
import Property from '../../../../axon/js/Property.js';
import VSMLaunchPanel, { VSMLaunchPanelOptions } from '../../common/view/VSMLaunchPanel.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VariabilityLaunchPanelOptions = SelfOptions & VSMLaunchPanelOptions;

export default class VariabilityLaunchPanel extends VSMLaunchPanel {

  public constructor( configurationProperty: Property<Configuration>, providedOptions: VariabilityLaunchPanelOptions ) {
    super( configurationProperty, providedOptions );
  }
}
projectileDataLab.register( 'VariabilityLaunchPanel', VariabilityLaunchPanel );
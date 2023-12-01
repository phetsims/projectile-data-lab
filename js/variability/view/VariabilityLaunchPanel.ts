// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import VSMLaunchPanel, { VSMLaunchPanelOptions } from '../../common-vsm/view/VSMLaunchPanel.js';
import { ProjectileType } from '../../common/model/ProjectileType.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import SectionLauncherType from '../../common/view/SectionLauncherType.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VariabilityLaunchPanelOptions = SelfOptions & VSMLaunchPanelOptions;

export default class VariabilityLaunchPanel extends VSMLaunchPanel {

  public constructor( launcherConfigurationProperty: PhetioProperty<LauncherConfiguration>, projectileTypeProperty: PhetioProperty<ProjectileType>, launcherTypeProperty: PhetioProperty<number>, providedOptions: VariabilityLaunchPanelOptions ) {

    const launcherTypeSection = new SectionLauncherType( launcherTypeProperty, {
      tandem: providedOptions.tandem
    } );

    super( [ launcherTypeSection ], launcherConfigurationProperty, projectileTypeProperty, providedOptions );
  }
}
projectileDataLab.register( 'VariabilityLaunchPanel', VariabilityLaunchPanel );
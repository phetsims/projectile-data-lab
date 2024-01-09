// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import VSMLaunchPanel, { VSMLaunchPanelOptions } from '../../common-vsm/view/VSMLaunchPanel.js';
import { ProjectileType } from '../../common/model/ProjectileType.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { LauncherMechanism } from '../../common-vsm/model/LauncherMechanism.js';
import SectionCustomLauncher from '../../common-vsm/view/SectionCustomLauncher.js';

/**
 * The SourcesLaunchPanel extends VSMLaunchPanel and adds the SectionCustomLauncher which allows the user to select
 * between the custom and mystery launchers.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SourcesLaunchPanelOptions = SelfOptions & VSMLaunchPanelOptions;

export default class SourcesLaunchPanel extends VSMLaunchPanel {

  public constructor( launcherConfigurationProperty: PhetioProperty<LauncherConfiguration>,
                      projectileTypeProperty: PhetioProperty<ProjectileType>,
                      customLauncherTypeProperty: PhetioProperty<LauncherMechanism>,
                      angleStabilizerProperty: PhetioProperty<number>,
                      providedOptions: SourcesLaunchPanelOptions ) {

    const launcherTypeSection = new SectionCustomLauncher( customLauncherTypeProperty,
      angleStabilizerProperty, {
        tandem: providedOptions.tandem.createTandem( 'launcherTypeSection' )
      } );

    super( [ launcherTypeSection ], launcherConfigurationProperty, projectileTypeProperty, providedOptions );
  }
}
projectileDataLab.register( 'SourcesLaunchPanel', SourcesLaunchPanel );
// Copyright 2023-2024, University of Colorado Boulder

/**
 * The SourcesLaunchPanel extends VSMLaunchPanel and adds the CustomLauncherSection which allows the user to select
 * between the custom and mystery launchers.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import VSMLaunchPanel, { VSMLaunchPanelOptions } from '../../common-vsm/view/VSMLaunchPanel.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import LauncherMechanism from '../../common-vsm/model/LauncherMechanism.js';
import CustomLauncherSection from '../../common-vsm/view/CustomLauncherSection.js';
import ProjectileType from '../../common/model/ProjectileType.js';

type SelfOptions = EmptySelfOptions;
type SourcesLaunchPanelOptions = SelfOptions & VSMLaunchPanelOptions;

export default class SourcesLaunchPanel extends VSMLaunchPanel {

  public constructor( launcherConfigurationProperty: PhetioProperty<LauncherConfiguration>,
                      projectileTypeProperty: PhetioProperty<ProjectileType>,
                      customLauncherMechanismProperty: PhetioProperty<LauncherMechanism>,
                      angleStabilizerProperty: PhetioProperty<number>,
                      providedOptions: SourcesLaunchPanelOptions ) {

    const customLauncherSection = new CustomLauncherSection( customLauncherMechanismProperty,
      angleStabilizerProperty, {
        tandem: providedOptions.tandem.createTandem( 'customLauncherSection' )
      } );

    super( [ customLauncherSection ], launcherConfigurationProperty, projectileTypeProperty, providedOptions );
  }
}
projectileDataLab.register( 'SourcesLaunchPanel', SourcesLaunchPanel );
// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import VSMLaunchPanel, { VSMLaunchPanelOptions } from '../../common-vsm/view/VSMLaunchPanel.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import LauncherMechanism from '../../common-vsm/model/LauncherMechanism.js';
import SectionCustomLauncher from '../../common-sm/view/SectionCustomLauncher.js';
import ProjectileType from '../../common/model/ProjectileType.js';

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
                      customLauncherMechanismProperty: PhetioProperty<LauncherMechanism>,
                      standardDeviationAngleProperty: PhetioProperty<number>,
                      providedOptions: SourcesLaunchPanelOptions ) {

    const customLauncherSection = new SectionCustomLauncher( customLauncherMechanismProperty,
      standardDeviationAngleProperty, {
        tandem: providedOptions.tandem.createTandem( 'customLauncherSection' )
      } );

    super( [ customLauncherSection ], launcherConfigurationProperty, projectileTypeProperty, providedOptions );
  }
}
projectileDataLab.register( 'SourcesLaunchPanel', SourcesLaunchPanel );
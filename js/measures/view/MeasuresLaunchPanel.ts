// Copyright 2023-2024, University of Colorado Boulder

/**
 * The MeasuresLaunchPanel extends VSMLaunchPanel and adds the MysteryOrCustomLauncherSection which allows the user to select
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
import MysteryOrCustomLauncherSection from './MysteryOrCustomLauncherSection.js';
import { MysteryOrCustom } from '../../common/model/MysteryOrCustom.js';
import Launcher from '../../common/model/Launcher.js';
import ProjectileType from '../../common/model/ProjectileType.js';

type SelfOptions = EmptySelfOptions;
type MeasuresLaunchPanelOptions = SelfOptions & VSMLaunchPanelOptions;

export default class MeasuresLaunchPanel extends VSMLaunchPanel {

  public constructor( launcherConfigurationProperty: PhetioProperty<LauncherConfiguration>,
                      projectileTypeProperty: PhetioProperty<ProjectileType>,
                      mysteryOrCustomProperty: PhetioProperty<MysteryOrCustom>,
                      mysteryLauncherProperty: PhetioProperty<Launcher>,
                      customLauncherMechanismProperty: PhetioProperty<LauncherMechanism>,
                      angleStabilityProperty: PhetioProperty<number>,
                      providedOptions: MeasuresLaunchPanelOptions ) {

    const launcherSection = new MysteryOrCustomLauncherSection( mysteryOrCustomProperty, mysteryLauncherProperty,
      customLauncherMechanismProperty, angleStabilityProperty, {
        tandem: providedOptions.tandem.createTandem( 'launcherSection' )
      } );

    super( [ launcherSection ], launcherConfigurationProperty, projectileTypeProperty, providedOptions );
  }
}
projectileDataLab.register( 'MeasuresLaunchPanel', MeasuresLaunchPanel );
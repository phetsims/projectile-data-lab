// Copyright 2023-2024, University of Colorado Boulder

/**
 * The VariabilityLaunchPanel extends VSMLaunchPanel and adds the MysteryLauncherSection which allows the user to select
 * between the mystery launchers.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherOrientation } from '../../common/model/LauncherOrientation.js';
import VSMLaunchPanel, { VSMLaunchPanelOptions } from '../../common-vsm/view/VSMLaunchPanel.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import MysteryLauncherSection from '../../common/view/MysteryLauncherSection.js';
import Launcher from '../../common/model/Launcher.js';
import ProjectileType from '../../common/model/ProjectileType.js';

type SelfOptions = EmptySelfOptions;
type VariabilityLaunchPanelOptions = SelfOptions & VSMLaunchPanelOptions;

export default class VariabilityLaunchPanel extends VSMLaunchPanel {

  public constructor(
    launcherOrientationProperty: PhetioProperty<LauncherOrientation>,
    projectileTypeProperty: PhetioProperty<ProjectileType>,
    mysteryLauncherProperty: PhetioProperty<Launcher>,
    providedOptions: VariabilityLaunchPanelOptions ) {

    const mysteryLauncherSection = new MysteryLauncherSection( mysteryLauncherProperty, {
      tandem: providedOptions.tandem.createTandem( 'mysteryLauncherSection' )
    } );

    super( [ mysteryLauncherSection ], launcherOrientationProperty, projectileTypeProperty, providedOptions );
  }
}
projectileDataLab.register( 'VariabilityLaunchPanel', VariabilityLaunchPanel );
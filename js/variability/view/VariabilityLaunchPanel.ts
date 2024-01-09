// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import VSMLaunchPanel, { VSMLaunchPanelOptions } from '../../common-vsm/view/VSMLaunchPanel.js';
import { ProjectileType } from '../../common/model/ProjectileType.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import SectionMysteryLauncher from '../../common/view/SectionMysteryLauncher.js';

/**
 * The VariabilityLaunchPanel extends VSMLaunchPanel and adds the SectionMysteryLauncher which allows the user to select
 * between the mystery launchers.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VariabilityLaunchPanelOptions = SelfOptions & VSMLaunchPanelOptions;

export default class VariabilityLaunchPanel extends VSMLaunchPanel {

  public constructor( launcherConfigurationProperty: PhetioProperty<LauncherConfiguration>, projectileTypeProperty: PhetioProperty<ProjectileType>, mysteryLauncherProperty: PhetioProperty<number>, providedOptions: VariabilityLaunchPanelOptions ) {

    const mysteryLauncherSection = new SectionMysteryLauncher( mysteryLauncherProperty, {
      tandem: providedOptions.tandem.createTandem( 'mysteryLauncherSection' )
    } );

    super( [ mysteryLauncherSection ], launcherConfigurationProperty, projectileTypeProperty, providedOptions );
  }
}
projectileDataLab.register( 'VariabilityLaunchPanel', VariabilityLaunchPanel );
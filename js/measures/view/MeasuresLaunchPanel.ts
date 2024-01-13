// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import VSMLaunchPanel, { VSMLaunchPanelOptions } from '../../common-vsm/view/VSMLaunchPanel.js';
import { ProjectileType } from '../../common/model/ProjectileType.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { LauncherMechanism } from '../../common-vsm/model/LauncherMechanism.js';
import SectionAnyLauncher from './SectionAnyLauncher.js';

/**
 * The MeasuresLaunchPanel extends VSMLaunchPanel and adds the SectionAnyLauncher which allows the user to select
 * between the custom and mystery launchers.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type MeasuresLaunchPanelOptions = SelfOptions & VSMLaunchPanelOptions;

export default class MeasuresLaunchPanel extends VSMLaunchPanel {

  public constructor( launcherConfigurationProperty: PhetioProperty<LauncherConfiguration>,
                      projectileTypeProperty: PhetioProperty<ProjectileType>,
                      isLauncherCustomProperty: PhetioProperty<boolean>,
                      mysteryLauncherProperty: PhetioProperty<number>,
                      customLauncherMechanismProperty: PhetioProperty<LauncherMechanism>,
                      angleStabilizerProperty: PhetioProperty<number>,
                      providedOptions: MeasuresLaunchPanelOptions ) {


    const launcherSection = new SectionAnyLauncher( isLauncherCustomProperty, mysteryLauncherProperty,
      customLauncherMechanismProperty, angleStabilizerProperty, {
        tandem: providedOptions.tandem.createTandem( 'launcherSection' )
      } );


    super( [ launcherSection ], launcherConfigurationProperty, projectileTypeProperty, providedOptions );
  }
}
projectileDataLab.register( 'MeasuresLaunchPanel', MeasuresLaunchPanel );
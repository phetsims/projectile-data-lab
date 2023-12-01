// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import VSMLaunchPanel, { VSMLaunchPanelOptions } from '../../common-vsm/view/VSMLaunchPanel.js';
import { ProjectileType } from '../../common/model/ProjectileType.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import SectionPresetLauncher from '../../common/view/SectionPresetLauncher.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VariabilityLaunchPanelOptions = SelfOptions & VSMLaunchPanelOptions;

export default class VariabilityLaunchPanel extends VSMLaunchPanel {

  public constructor( launcherConfigurationProperty: PhetioProperty<LauncherConfiguration>, projectileTypeProperty: PhetioProperty<ProjectileType>, presetLauncherProperty: PhetioProperty<number>, providedOptions: VariabilityLaunchPanelOptions ) {

    const presetLauncherSection = new SectionPresetLauncher( presetLauncherProperty, {
      tandem: providedOptions.tandem
    } );

    super( [ presetLauncherSection ], launcherConfigurationProperty, projectileTypeProperty, providedOptions );
  }
}
projectileDataLab.register( 'VariabilityLaunchPanel', VariabilityLaunchPanel );
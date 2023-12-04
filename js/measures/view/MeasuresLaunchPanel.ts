// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import VSMLaunchPanel, { VSMLaunchPanelOptions } from '../../common-vsm/view/VSMLaunchPanel.js';
import { ProjectileType } from '../../common/model/ProjectileType.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { CustomLauncherType } from '../../common-vsm/model/CustomLauncherType.js';
import SectionAnyLauncher from './SectionAnyLauncher.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type MeasuresLaunchPanelOptions = SelfOptions & VSMLaunchPanelOptions;

export default class MeasuresLaunchPanel extends VSMLaunchPanel {

  public constructor( launcherConfigurationProperty: PhetioProperty<LauncherConfiguration>,
                      projectileTypeProperty: PhetioProperty<ProjectileType>,
                      isLauncherCustomProperty: PhetioProperty<boolean>,
                      presetLauncherProperty: PhetioProperty<number>,
                      customLauncherTypeProperty: PhetioProperty<CustomLauncherType>,
                      angleStabilizerProperty: PhetioProperty<number>,
                      providedOptions: MeasuresLaunchPanelOptions ) {

    const anyLauncherSection = new SectionAnyLauncher( isLauncherCustomProperty, presetLauncherProperty,
      customLauncherTypeProperty, angleStabilizerProperty, { tandem: providedOptions.tandem } );

    super( [ anyLauncherSection ], launcherConfigurationProperty, projectileTypeProperty, providedOptions );
  }
}
projectileDataLab.register( 'MeasuresLaunchPanel', MeasuresLaunchPanel );
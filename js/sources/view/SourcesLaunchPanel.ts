// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import VSMLaunchPanel, { VSMLaunchPanelOptions } from '../../common-vsm/view/VSMLaunchPanel.js';
import { ProjectileType } from '../../common/model/ProjectileType.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { CustomLauncherType } from '../../common-vsm/model/CustomLauncherType.js';
import { Node } from '../../../../scenery/js/imports.js';
import SectionCustomLauncher from '../../common-vsm/view/SectionCustomLauncher.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SourcesLaunchPanelOptions = SelfOptions & VSMLaunchPanelOptions;

export default class SourcesLaunchPanel extends VSMLaunchPanel {

  public constructor( launcherConfigurationProperty: PhetioProperty<LauncherConfiguration>,
                      projectileTypeProperty: PhetioProperty<ProjectileType>,
                      customLauncherTypeProperty: PhetioProperty<CustomLauncherType>,
                      providedOptions: SourcesLaunchPanelOptions ) {

    const customLauncherTypeSection = new SectionCustomLauncher( customLauncherTypeProperty, {
      tandem: providedOptions.tandem
    } );

    const content: Node[] = [ customLauncherTypeSection ];

    super( content, launcherConfigurationProperty, projectileTypeProperty, providedOptions );
  }
}
projectileDataLab.register( 'SourcesLaunchPanel', SourcesLaunchPanel );
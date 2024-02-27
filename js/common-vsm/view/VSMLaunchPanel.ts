// Copyright 2023-2024, University of Colorado Boulder

/**
 * The VSMLaunchPanel presents a UI so the user can choose the launcher configuration and projectile type.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { PDLPanelOptions } from '../../common/view/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import SectionLauncherConfiguration from '../../common/view/SectionLauncherConfiguration.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import SectionProjectileType from '../../common/view/SectionProjectileType.js';
import { PDLLaunchPanel } from '../../common/view/PDLLaunchPanel.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { Node } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ProjectileType from '../../common/model/ProjectileType.js';

type SelfOptions = EmptySelfOptions;
export type VSMLaunchPanelOptions = SelfOptions & WithRequired<PDLPanelOptions, 'tandem'>;

export default class VSMLaunchPanel extends PDLLaunchPanel {

  public constructor( content: Node[], configurationProperty: PhetioProperty<LauncherConfiguration>,
                      projectileTypeProperty: PhetioProperty<ProjectileType>, providedOptions: VSMLaunchPanelOptions ) {

    const launcherConfigurationSection = new SectionLauncherConfiguration( configurationProperty, {
      tandem: providedOptions.tandem.createTandem( 'launcherConfigurationSection' )
    } );

    const projectileTypeSection = new SectionProjectileType( projectileTypeProperty, {
      tandem: providedOptions.tandem.createTandem( 'projectileTypeSection' )
    } );

    super( [ launcherConfigurationSection, projectileTypeSection, ...content ], providedOptions );
  }
}
projectileDataLab.register( 'VSMLaunchPanel', VSMLaunchPanel );
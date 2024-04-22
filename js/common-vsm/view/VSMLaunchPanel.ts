// Copyright 2023-2024, University of Colorado Boulder

/**
 * The VSMLaunchPanel presents a UI so the user can choose the launcher orientation and projectile type.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import LauncherOrientationSection from '../../common/view/LauncherOrientationSection.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherOrientation } from '../../common/model/LauncherOrientation.js';
import ProjectileTypeSection from '../../common/view/ProjectileTypeSection.js';
import { PDLLaunchPanel, PDLLaunchPanelOptions } from '../../common/view/PDLLaunchPanel.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { Node } from '../../../../scenery/js/imports.js';
import ProjectileType from '../../common/model/ProjectileType.js';

type SelfOptions = EmptySelfOptions;
export type VSMLaunchPanelOptions = SelfOptions & PDLLaunchPanelOptions;

export default class VSMLaunchPanel extends PDLLaunchPanel {

  public constructor( content: Node[], orientationProperty: PhetioProperty<LauncherOrientation>,
                      projectileTypeProperty: PhetioProperty<ProjectileType>, providedOptions: VSMLaunchPanelOptions ) {

    const launcherOrientationSection = new LauncherOrientationSection( orientationProperty, {
      tandem: providedOptions.tandem.createTandem( 'launcherOrientationSection' )
    } );

    const projectileTypeSection = new ProjectileTypeSection( projectileTypeProperty, {
      tandem: providedOptions.tandem.createTandem( 'projectileTypeSection' )
    } );

    super( [ launcherOrientationSection, projectileTypeSection, ...content ], providedOptions );
  }
}
projectileDataLab.register( 'VSMLaunchPanel', VSMLaunchPanel );
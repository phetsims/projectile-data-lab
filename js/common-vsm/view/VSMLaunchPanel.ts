// Copyright 2023, University of Colorado Boulder

import { PDLPanelOptions } from '../../common/view/panels/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { Color, HSeparator, Node } from '../../../../scenery/js/imports.js';
import SectionLauncherConfiguration from '../../common/view/panels/SectionLauncherConfiguration.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import SectionProjectileType from '../../common/view/panels/SectionProjectileType.js';
import { ProjectileType } from '../../common/model/ProjectileType.js';
import { PDLLaunchPanel, PDLLaunchPanelOptions } from '../../common/view/panels/PDLLaunchPanel.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import PDLConstants from '../../common/PDLConstants.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type VSMLaunchPanelOptions = SelfOptions & PDLPanelOptions;

export default class VSMLaunchPanel extends PDLLaunchPanel {

  public constructor( configurationProperty: PhetioProperty<LauncherConfiguration>,
                      projectileTypeProperty: PhetioProperty<ProjectileType>,
                      launcherTypeProperty: PhetioProperty<number>,
                      providedOptions: VSMLaunchPanelOptions ) {

    const options = optionize<VSMLaunchPanelOptions, SelfOptions, PDLLaunchPanelOptions>()( {
      left: PDLConstants.SCREEN_VIEW_X_MARGIN,
      top: PDLConstants.SCREEN_VIEW_Y_MARGIN
    }, providedOptions );

    const launcherConfigurationSection = new SectionLauncherConfiguration( configurationProperty, {
      tandem: providedOptions.tandem
    } );

    const projectileTypeSection = new SectionProjectileType( projectileTypeProperty, {
      tandem: providedOptions.tandem
    } );

    const content: Node[] = [];
    content.push( launcherConfigurationSection );
    content.push( new HSeparator( { stroke: Color.BLACK } ) );
    content.push( projectileTypeSection );
    content.push( new HSeparator( { stroke: Color.BLACK } ) );

    super( launcherTypeProperty, content, options );
  }
}
projectileDataLab.register( 'VSMLaunchPanel', VSMLaunchPanel );
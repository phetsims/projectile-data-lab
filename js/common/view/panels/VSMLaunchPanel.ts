// Copyright 2023, University of Colorado Boulder

import { PDLPanelOptions } from './PDLPanel.js';
import projectileDataLab from '../../../projectileDataLab.js';
import { Color, HSeparator, Node } from '../../../../../scenery/js/imports.js';
import SectionLauncherConfiguration from './SectionLauncherConfiguration.js';
import { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../model/LauncherConfiguration.js';
import Property from '../../../../../axon/js/Property.js';
import SectionProjectileType from './SectionProjectileType.js';
import { ProjectileType } from '../../model/ProjectileType.js';
import { PDLLaunchPanel } from './PDLLaunchPanel.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type VSMLaunchPanelOptions = SelfOptions & PDLPanelOptions;

export default class VSMLaunchPanel extends PDLLaunchPanel {

  public constructor( configurationProperty: Property<LauncherConfiguration>,
                      projectileTypeProperty: Property<ProjectileType>,
                      launcherTypeProperty: Property<number>,
                      providedOptions: VSMLaunchPanelOptions ) {

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

    super( launcherTypeProperty, content, providedOptions );
  }
}
projectileDataLab.register( 'VSMLaunchPanel', VSMLaunchPanel );
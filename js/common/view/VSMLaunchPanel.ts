// Copyright 2023, University of Colorado Boulder

import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { Color, HSeparator, Node } from '../../../../scenery/js/imports.js';
import LauncherConfigurationSection from './LauncherConfigurationSection.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../model/LauncherConfiguration.js';
import Property from '../../../../axon/js/Property.js';
import ProjectileTypeSection from './ProjectileTypeSection.js';
import { ProjectileType } from '../model/ProjectileType.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type VSMLaunchPanelOptions = SelfOptions & PDLPanelOptions;

export default class VSMLaunchPanel extends PDLPanel {

  public constructor( configurationProperty: Property<LauncherConfiguration>, projectileTypeProperty: Property<ProjectileType>, providedOptions: VSMLaunchPanelOptions ) {

    const content: Node[] = [];
    const launcherConfigurationSection = new LauncherConfigurationSection( configurationProperty, {
      tandem: providedOptions.tandem
    } );
    content.push( launcherConfigurationSection );

    const separator = new HSeparator( { stroke: Color.BLACK } );
    content.push( separator );

    const projectileTypeSection = new ProjectileTypeSection( projectileTypeProperty, {
      tandem: providedOptions.tandem
    } );
    content.push( projectileTypeSection );

    super( content );
  }
}
projectileDataLab.register( 'VSMLaunchPanel', VSMLaunchPanel );
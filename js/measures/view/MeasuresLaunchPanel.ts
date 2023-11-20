// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import Property from '../../../../axon/js/Property.js';
import VSMLaunchPanel, { VSMLaunchPanelOptions } from '../../common/view/panels/VSMLaunchPanel.js';
import { ProjectileType } from '../../common/model/ProjectileType.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type MeasuresLaunchPanelOptions = SelfOptions & VSMLaunchPanelOptions;

export default class MeasuresLaunchPanel extends VSMLaunchPanel {

  public constructor( launcherConfigurationProperty: Property<LauncherConfiguration>, projectileTypeProperty: Property<ProjectileType>, launcherTypeProperty: Property<number>, providedOptions: MeasuresLaunchPanelOptions ) {
    super( launcherConfigurationProperty, projectileTypeProperty, launcherTypeProperty, providedOptions );
  }
}
projectileDataLab.register( 'MeasuresLaunchPanel', MeasuresLaunchPanel );
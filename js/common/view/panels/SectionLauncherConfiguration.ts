// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../../projectileDataLab.js';
import { Text } from '../../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Property from '../../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../../model/LauncherConfiguration.js';
import PDLPanelSection, { PDLPanelSectionOptions } from './PDLPanelSection.js';
import ProjectileDataLabStrings from '../../../ProjectileDataLabStrings.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type LauncherConfigurationSectionOptions = SelfOptions & PDLPanelSectionOptions;

export default class SectionLauncherConfiguration extends PDLPanelSection {

  public constructor( launcherConfigurationProperty: Property<LauncherConfiguration>, providedOptions: LauncherConfigurationSectionOptions ) {
    const launcherConfigurationRadioButtonGroup = new RectangularRadioButtonGroup( launcherConfigurationProperty, [ {
      value: 'ANGLE_30' as const,
      tandemName: 'angleThirtyRadioButton',
      createNode: () => new Text( '30' )
    }, {
      value: 'ANGLE_45' as const,
      tandemName: 'angleFortyFiveRadioButton',
      createNode: () => new Text( '45' )
    }, {
      value: 'ANGLE_60' as const,
      tandemName: 'angleSixtyRadioButton',
      createNode: () => new Text( '60' )
    }, {
      value: 'ANGLE_0' as const,
      tandemName: 'angleZeroRadioButton',
      createNode: () => new Text( '0' )
    } ], {
      tandem: providedOptions.tandem.createTandem( 'launcherConfigurationRadioButtonGroup' ),
      orientation: 'horizontal'
    } );
    super( ProjectileDataLabStrings.configurationStringProperty, launcherConfigurationRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'SectionLauncherConfiguration', SectionLauncherConfiguration );
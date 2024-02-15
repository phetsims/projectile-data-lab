// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Image } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../model/LauncherConfiguration.js';
import PDLPanelSection, { PDLPanelSectionOptions } from './PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

//TODO: Update these images or use graphics drawing - see https://github.com/phetsims/projectile-data-lab/issues/53
import configurationButton1_svg from '../../../images/configurationButton1_svg.js';
import configurationButton2_svg from '../../../images/configurationButton2_svg.js';
import configurationButton3_svg from '../../../images/configurationButton3_svg.js';
import configurationButton4_svg from '../../../images/configurationButton4_svg.js';
import PDLRectangularRadioButtonGroup from './PDLRectangularRadioButtonGroup.js';
import multiSelectionSoundPlayerFactory from '../../../../tambo/js/multiSelectionSoundPlayerFactory.js';

/**
 * The SectionLauncherConfiguration shows the launcher configuration radio buttons.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionLauncherConfigurationOptions = SelfOptions & WithRequired<PDLPanelSectionOptions, 'tandem'>;

const IMAGE_MAX_WIDTH = 30;

export default class SectionLauncherConfiguration extends PDLPanelSection {

  public constructor( launcherConfigurationProperty: PhetioProperty<LauncherConfiguration>, providedOptions: SectionLauncherConfigurationOptions ) {
    const launcherConfigurationRadioButtonGroup = new PDLRectangularRadioButtonGroup( launcherConfigurationProperty, [ {
      value: 'angle30' as const,
      tandemName: 'angleThirtyRadioButton',
      createNode: () => new Image( configurationButton1_svg, {
        maxWidth: IMAGE_MAX_WIDTH
      } ),
      options: {
        soundPlayer: multiSelectionSoundPlayerFactory.getSelectionSoundPlayer( 5 )
      }
    }, {
      value: 'angle45' as const,
      tandemName: 'angleFortyFiveRadioButton',
      createNode: () => new Image( configurationButton2_svg, {
        maxWidth: IMAGE_MAX_WIDTH
      } ),
      options: {
        soundPlayer: multiSelectionSoundPlayerFactory.getSelectionSoundPlayer( 4 )
      }
    }, {
      value: 'angle60' as const,
      tandemName: 'angleSixtyRadioButton',
      createNode: () => new Image( configurationButton3_svg, {
        maxWidth: IMAGE_MAX_WIDTH
      } ),
      options: {
        soundPlayer: multiSelectionSoundPlayerFactory.getSelectionSoundPlayer( 3 )
      }
    }, {
      value: 'angle0Raised' as const,
      tandemName: 'angleZeroRadioButton',
      createNode: () => new Image( configurationButton4_svg, {
        maxWidth: IMAGE_MAX_WIDTH
      } ),
      options: {
        soundPlayer: multiSelectionSoundPlayerFactory.getSelectionSoundPlayer( 0 )
      }
    } ], {
      tandem: providedOptions.tandem.createTandem( 'launcherConfigurationRadioButtonGroup' ),
      phetioVisiblePropertyInstrumented: false // As the only UI control in the panel, the visibility is controlled by the parent panel
    } );
    super( ProjectileDataLabStrings.configurationStringProperty, launcherConfigurationRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'SectionLauncherConfiguration', SectionLauncherConfiguration );
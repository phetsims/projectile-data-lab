// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Image } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherOrientation } from '../model/LauncherOrientation.js';
import PDLPanelSection, { PDLPanelSectionOptions } from './PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

import orientationButton1_svg from '../../../images/orientationButton1_svg.js';
import orientationButton2_svg from '../../../images/orientationButton2_svg.js';
import orientationButton3_svg from '../../../images/orientationButton3_svg.js';
import orientationButton4_svg from '../../../images/orientationButton4_svg.js';
import PDLRectangularRadioButtonGroup from './PDLRectangularRadioButtonGroup.js';
import multiSelectionSoundPlayerFactory from '../../../../tambo/js/multiSelectionSoundPlayerFactory.js';

/**
 * The LauncherOrientationSection shows the launcher orientation radio buttons.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type LauncherOrientationSectionOptions = SelfOptions & WithRequired<PDLPanelSectionOptions, 'tandem'>;

const IMAGE_MAX_WIDTH = 30;

export default class LauncherOrientationSection extends PDLPanelSection {

  public constructor( launcherOrientationProperty: PhetioProperty<LauncherOrientation>, providedOptions: LauncherOrientationSectionOptions ) {
    const launcherOrientationRadioButtonGroup = new PDLRectangularRadioButtonGroup( launcherOrientationProperty, [ {
      value: 'angle30' as const,
      tandemName: 'angleThirtyRadioButton',
      createNode: () => new Image( orientationButton1_svg, {
        maxWidth: IMAGE_MAX_WIDTH
      } ),
      options: {
        soundPlayer: multiSelectionSoundPlayerFactory.getSelectionSoundPlayer( 5 )
      }
    }, {
      value: 'angle45' as const,
      tandemName: 'angleFortyFiveRadioButton',
      createNode: () => new Image( orientationButton2_svg, {
        maxWidth: IMAGE_MAX_WIDTH
      } ),
      options: {
        soundPlayer: multiSelectionSoundPlayerFactory.getSelectionSoundPlayer( 4 )
      }
    }, {
      value: 'angle60' as const,
      tandemName: 'angleSixtyRadioButton',
      createNode: () => new Image( orientationButton3_svg, {
        maxWidth: IMAGE_MAX_WIDTH
      } ),
      options: {
        soundPlayer: multiSelectionSoundPlayerFactory.getSelectionSoundPlayer( 3 )
      }
    }, {
      value: 'angle0Raised' as const,
      tandemName: 'angleZeroRadioButton',
      createNode: () => new Image( orientationButton4_svg, {
        maxWidth: IMAGE_MAX_WIDTH
      } ),
      options: {
        soundPlayer: multiSelectionSoundPlayerFactory.getSelectionSoundPlayer( 0 )
      }
    } ], {
      tandem: providedOptions.tandem.createTandem( 'launcherOrientationRadioButtonGroup' ),
      phetioVisiblePropertyInstrumented: false // As the only UI control in the panel, the visibility is controlled by the parent panel
    } );
    super( ProjectileDataLabStrings.orientationStringProperty, launcherOrientationRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'LauncherOrientationSection', LauncherOrientationSection );
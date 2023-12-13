// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Image } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { LauncherConfiguration } from '../model/LauncherConfiguration.js';
import PDLPanelSection, { PDLPanelSectionOptions } from './PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

//TODO: Update these images or use graphics drawing - see https://github.com/phetsims/projectile-data-lab/issues/7
import configurationButton1_png from '../../../images/configurationButton1_png.js';
import configurationButton2_png from '../../../images/configurationButton2_png.js';
import configurationButton3_png from '../../../images/configurationButton3_png.js';
import configurationButton4_png from '../../../images/configurationButton4_png.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionLauncherConfigurationOptions = SelfOptions & WithRequired<PDLPanelSectionOptions, 'tandem'>;

const IMAGE_MAX_WIDTH = 32;

export default class SectionLauncherConfiguration extends PDLPanelSection {

  public constructor( launcherConfigurationProperty: PhetioProperty<LauncherConfiguration>, providedOptions: SectionLauncherConfigurationOptions ) {
    const launcherConfigurationRadioButtonGroup = new RectangularRadioButtonGroup( launcherConfigurationProperty, [ {
      value: 'angle30' as const,
      tandemName: 'angleThirtyRadioButton',
      createNode: () => new Image( configurationButton1_png, {
        maxWidth: IMAGE_MAX_WIDTH
      } )
    }, {
      value: 'angle45' as const,
      tandemName: 'angleFortyFiveRadioButton',
      createNode: () => new Image( configurationButton2_png, {
        maxWidth: IMAGE_MAX_WIDTH
      } )
    }, {
      value: 'angle60' as const,
      tandemName: 'angleSixtyRadioButton',
      createNode: () => new Image( configurationButton3_png, {
        maxWidth: IMAGE_MAX_WIDTH
      } )
    }, {
      value: 'angle0Raised' as const,
      tandemName: 'angleZeroRadioButton',
      createNode: () => new Image( configurationButton4_png, {
        maxWidth: IMAGE_MAX_WIDTH
      } )
    } ], {
      tandem: providedOptions.tandem.createTandem( 'launcherConfigurationRadioButtonGroup' ),
      orientation: 'horizontal',
      spacing: 5,
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 2,
        yMargin: 2
      },
      layoutOptions: {
        align: 'center'
      }
    } );
    super( ProjectileDataLabStrings.configurationStringProperty, launcherConfigurationRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'SectionLauncherConfiguration', SectionLauncherConfiguration );
// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { VBox } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { CustomLauncherType } from '../model/CustomLauncherType.js';
import AngleStabilizerNumberControl from './AngleStabilizerNumberControl.js';
import CustomLauncherTypeRadioButtonGroup from './CustomLauncherTypeRadioButtonGroup.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionCustomLauncherOptions = SelfOptions & PDLPanelSectionOptions;

export default class SectionCustomLauncher extends PDLPanelSection {

  public constructor( customLauncherTypeProperty: PhetioProperty<CustomLauncherType>,
                      angleStabilizerProperty: PhetioProperty<number>, providedOptions: SectionCustomLauncherOptions ) {
    const customLauncherTypeRadioButtonGroup = new CustomLauncherTypeRadioButtonGroup( customLauncherTypeProperty, {
      tandem: providedOptions.tandem.createTandem( 'customLauncherTypeRadioButtonGroup' )
    } );

    const angleStabilizerNumberControl = new AngleStabilizerNumberControl( angleStabilizerProperty, {
      tandem: providedOptions.tandem.createTandem( 'angleStabilizerNumberControl' )
    } );

    const contentContainer = new VBox( { children: [ customLauncherTypeRadioButtonGroup, angleStabilizerNumberControl ], spacing: 5, stretch: true } );

    super( ProjectileDataLabStrings.launcherStringProperty, contentContainer, providedOptions );
  }
}

projectileDataLab.register( 'SectionCustomLauncher', SectionCustomLauncher );
// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { VBox } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { LauncherMechanism } from '../model/LauncherMechanism.js';
import AngleStabilizerNumberControl from './AngleStabilizerNumberControl.js';
import CustomLauncherTypeRadioButtonGroup from './CustomLauncherTypeRadioButtonGroup.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionCustomLauncherOptions = SelfOptions & WithRequired<PDLPanelSectionOptions, 'tandem'>;

export default class SectionCustomLauncher extends PDLPanelSection {

  public constructor( customLauncherTypeProperty: PhetioProperty<LauncherMechanism>,
                      angleStabilizerProperty: PhetioProperty<number>, providedOptions: SectionCustomLauncherOptions ) {
    const customLauncherTypeRadioButtonGroup = new CustomLauncherTypeRadioButtonGroup( customLauncherTypeProperty, {
      tandem: providedOptions.tandem.createTandem( 'customLauncherTypeRadioButtonGroup' )
    } );

    const angleStabilizerNumberControl = new AngleStabilizerNumberControl( angleStabilizerProperty, {
      tandem: providedOptions.tandem.createTandem( 'angleStabilizerNumberControl' )
    } );

    const contentContainer = new VBox( { children: [ customLauncherTypeRadioButtonGroup, angleStabilizerNumberControl ], spacing: 5, stretch: true } );

    super( ProjectileDataLabStrings.customLauncherStringProperty, contentContainer, providedOptions );
  }
}

projectileDataLab.register( 'SectionCustomLauncher', SectionCustomLauncher );
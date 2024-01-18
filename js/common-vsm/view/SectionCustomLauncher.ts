// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { VBox } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { LauncherMechanism } from '../model/LauncherMechanism.js';
import AngleStabilizerNumberControl from './AngleStabilizerNumberControl.js';
import CustomLauncherTypeRadioButtonGroup from './CustomLauncherTypeRadioButtonGroup.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

/**
 * This SectionCustomLauncher is a panel section allows the user to customize a launcher.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionCustomLauncherOptions = SelfOptions & WithRequired<PDLPanelSectionOptions, 'tandem'>;

export default class SectionCustomLauncher extends PDLPanelSection {

  public constructor( customLauncherMechanismProperty: PhetioProperty<LauncherMechanism>,
                      standardDeviationAngleProperty: PhetioProperty<number>, providedOptions: SectionCustomLauncherOptions ) {

    const options = optionize<SectionCustomLauncherOptions, SelfOptions, PDLPanelSectionOptions>()( {
      stretch: true
    }, providedOptions );

    const customLauncherTypeRadioButtonGroup = new CustomLauncherTypeRadioButtonGroup( customLauncherMechanismProperty, {
      tandem: providedOptions.tandem.createTandem( 'customLauncherTypeRadioButtonGroup' ),
      phetioFeatured: true
    } );

    const angleStabilizerNumberControl = new AngleStabilizerNumberControl( standardDeviationAngleProperty, {
      tandem: providedOptions.tandem.createTandem( 'angleStabilizerNumberControl' ),
      phetioFeatured: true
    } );

    const contentContainer = new VBox( {
      children: [ customLauncherTypeRadioButtonGroup, angleStabilizerNumberControl ],
      spacing: 5,
      stretch: true,
      xMargin: 10
    } );

    super( ProjectileDataLabStrings.customLauncherStringProperty, contentContainer, options );
  }
}

projectileDataLab.register( 'SectionCustomLauncher', SectionCustomLauncher );
// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { VBox } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import CustomLauncherTypeRadioButtonGroup from '../../common-sm/view/CustomLauncherTypeRadioButtonGroup.js';
import LauncherMechanism from '../../common-vsm/model/LauncherMechanism.js';
import AngleStabilizerSection from '../../common-vsm/view/AngleStabilizerSection.js';

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

    // Note that the Angle Stabilizer controls the standard deviation of the launch angle.
    const angleStabilizerSection = new AngleStabilizerSection( standardDeviationAngleProperty, {
      tandem: providedOptions.tandem.createTandem( 'angleStabilizerSection' )
    } );

    const contentContainer = new VBox( {
      children: [ customLauncherTypeRadioButtonGroup, angleStabilizerSection ],
      spacing: 5,
      stretch: true,

      // Tuned to make sure the panels have the same width on all screens
      xMargin: 5
    } );

    super( ProjectileDataLabStrings.customLauncherStringProperty, contentContainer, options );
  }
}

projectileDataLab.register( 'SectionCustomLauncher', SectionCustomLauncher );
// Copyright 2023-2024, University of Colorado Boulder

/**
 * This CustomLauncherSection is a panel section allows the user to customize a launcher.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { VBox } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import CustomLauncherTypeRadioButtonGroup from '../../common-vsm/view/CustomLauncherTypeRadioButtonGroup.js';
import LauncherMechanism from '../../common-vsm/model/LauncherMechanism.js';
import AngleStabilizerSection from '../../common-vsm/view/AngleStabilizerSection.js';

type SelfOptions = EmptySelfOptions;
type CustomLauncherSectionOptions = SelfOptions & WithRequired<PDLPanelSectionOptions, 'tandem'>;

export default class CustomLauncherSection extends PDLPanelSection {

  public constructor( customLauncherMechanismProperty: PhetioProperty<LauncherMechanism>,
                      angleStabilizerProperty: PhetioProperty<number>, providedOptions: CustomLauncherSectionOptions ) {

    const options = optionize<CustomLauncherSectionOptions, SelfOptions, PDLPanelSectionOptions>()( {
      stretch: true
    }, providedOptions );

    const customLauncherTypeRadioButtonGroup = new CustomLauncherTypeRadioButtonGroup( customLauncherMechanismProperty, {
      tandem: providedOptions.tandem.createTandem( 'customLauncherTypeRadioButtonGroup' ),
      phetioFeatured: true
    } );

    // Note that the Angle Stabilizer controls the standard deviation of the launch angle.
    const angleStabilizerSection = new AngleStabilizerSection( angleStabilizerProperty, {
      tandem: providedOptions.tandem.createTandem( 'angleStabilizerSection' )
    } );

    const contentContainer = new VBox( {
      children: [ customLauncherTypeRadioButtonGroup, angleStabilizerSection ]
    } );

    super( ProjectileDataLabStrings.customLauncherStringProperty, contentContainer, options );
  }
}

projectileDataLab.register( 'CustomLauncherSection', CustomLauncherSection );
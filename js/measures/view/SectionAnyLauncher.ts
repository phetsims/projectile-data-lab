// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Node, VBox } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import { LauncherMechanism } from '../../common-vsm/model/LauncherMechanism.js';
import CustomLauncherTypeRadioButtonGroup from '../../common-vsm/view/CustomLauncherTypeRadioButtonGroup.js';
import AngleStabilizerNumberControl from '../../common-vsm/view/AngleStabilizerNumberControl.js';
import PDLText from '../../common/view/PDLText.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import MysteryLauncherRadioButtonGroupWrapper from '../../common/view/MysteryLauncherRadioButtonGroupWrapper.js';

/**
 * The SectionAnyLauncher allows the user to select between the custom and mystery launchers.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionAnyLauncherOptions = SelfOptions & WithRequired<PDLPanelSectionOptions, 'tandem'>;

export default class SectionAnyLauncher extends PDLPanelSection {

  public constructor( isLauncherCustomProperty: PhetioProperty<boolean>, mysteryLauncherNumberProperty: PhetioProperty<number>,
                      customLauncherMechanismProperty: PhetioProperty<LauncherMechanism>, angleStabilizerProperty: PhetioProperty<number>,
                      providedOptions: SectionAnyLauncherOptions ) {

    const radioButtonItems: AquaRadioButtonGroupItem<boolean>[] = [ {
      createNode: () => new PDLText( ProjectileDataLabStrings.mysteryLauncherStringProperty, {
        fontSize: 12,
        maxWidth: 120
      } ),
      value: false,
      tandemName: 'standardLauncherRadioButton'
    }, {
      createNode: () => new PDLText( ProjectileDataLabStrings.customLauncherStringProperty, {
        fontSize: 12,
        maxWidth: 120
      } ),
      value: true,
      tandemName: 'customLauncherRadioButton'
    } ];

    // radio button group, vertically layout so that i18n text has enough space to grow to the right.
    const isLauncherCustomRadioButtonGroup = new VerticalAquaRadioButtonGroup( isLauncherCustomProperty, radioButtonItems, {
      radioButtonOptions: { radius: 8 },
      touchAreaYDilation: 15,
      spacing: 4,
      tandem: providedOptions.tandem.createTandem( 'isLauncherCustomRadioButtonGroup' ),
      phetioFeatured: true
    } );

    const mysteryLauncherRadioButtonGroupWrapper = new MysteryLauncherRadioButtonGroupWrapper( mysteryLauncherNumberProperty, {
      tandem: providedOptions.tandem.createTandem( 'mysteryLauncherRadioButtonGroupWrapper' ),
      phetioFeatured: true
    } );

    const customLauncherTypeRadioButtonGroup = new CustomLauncherTypeRadioButtonGroup( customLauncherMechanismProperty, {
      tandem: providedOptions.tandem.createTandem( 'customLauncherTypeRadioButtonGroup' ),
      phetioFeatured: true
    } );

    const angleStabilizerNumberControl = new AngleStabilizerNumberControl( angleStabilizerProperty, {
      tandem: providedOptions.tandem.createTandem( 'angleStabilizerNumberControl' ),
      phetioFeatured: true
    } );

    const customLauncherControls = new VBox( {
      children: [ customLauncherTypeRadioButtonGroup, angleStabilizerNumberControl ],
      spacing: 4, stretch: true, topMargin: 3
    } );

    const launcherControlsToggleNode = new ToggleNode<boolean, Node>( isLauncherCustomProperty, [ {
      value: false,
      createNode: () => mysteryLauncherRadioButtonGroupWrapper
    }, {
      value: true,
      createNode: () => customLauncherControls
    } ], {} );

    const contentContainer = new VBox( { children: [ isLauncherCustomRadioButtonGroup, launcherControlsToggleNode ], spacing: 5, stretch: true } );

    super( null, contentContainer, providedOptions );
  }
}

projectileDataLab.register( 'SectionAnyLauncher', SectionAnyLauncher );
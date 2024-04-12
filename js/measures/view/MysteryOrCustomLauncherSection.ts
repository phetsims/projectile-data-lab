// Copyright 2023-2024, University of Colorado Boulder

/**
 * The MysteryOrCustomLauncherSection allows the user to select between the mystery and custom launchers.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { AlignGroup, Node, VBox } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import LauncherMechanism from '../../common-vsm/model/LauncherMechanism.js';
import AngleStabilitySection from '../../common-vsm/view/AngleStabilitySection.js';
import PDLText from '../../common/view/PDLText.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import MysteryLauncherControl from '../../common/view/MysteryLauncherControl.js';
import { MysteryOrCustom } from '../../common/model/MysteryOrCustom.js';
import Launcher from '../../common/model/Launcher.js';
import CustomLauncherTypeRadioButtonGroup from '../../common-vsm/view/CustomLauncherTypeRadioButtonGroup.js';

type SelfOptions = EmptySelfOptions;
type MysteryOrCustomLauncherSectionOptions = SelfOptions & PDLPanelSectionOptions;

export default class MysteryOrCustomLauncherSection extends PDLPanelSection {

  public constructor( mysteryOrCustomProperty: PhetioProperty<MysteryOrCustom>, mysteryLauncherProperty: PhetioProperty<Launcher>,
                      customLauncherMechanismProperty: PhetioProperty<LauncherMechanism>, angleStabilityProperty: PhetioProperty<number>,
                      providedOptions: MysteryOrCustomLauncherSectionOptions ) {

    const radioButtonItems: AquaRadioButtonGroupItem<MysteryOrCustom>[] = [ {
      createNode: () => new PDLText( ProjectileDataLabStrings.mysteryLauncherStringProperty, {
        maxWidth: 120
      } ),
      value: 'mystery',
      tandemName: 'mysteryLauncherRadioButton'
    }, {
      createNode: () => new PDLText( ProjectileDataLabStrings.customLauncherStringProperty, {
        maxWidth: 120
      } ),
      value: 'custom',
      tandemName: 'customLauncherRadioButton'
    } ];

    // radio button group, vertically layout so that i18n text has enough space to grow to the right.
    const mysteryOrCustomRadioButtonGroup = new VerticalAquaRadioButtonGroup( mysteryOrCustomProperty, radioButtonItems, {
      radioButtonOptions: { radius: 8 },
      touchAreaYDilation: 15,
      spacing: 5,
      tandem: providedOptions.tandem.createTandem( 'mysteryOrCustomRadioButtonGroup' ),
      phetioFeatured: true,
      layoutOptions: {
        yMargin: 2
      }
    } );

    const mysteryLauncherRadioButtonGroupWrapper = new MysteryLauncherControl( mysteryLauncherProperty, {

      // Note there is a "Wrapper" level in order to handle the line break for the mystery radio buttons. Hence, the wrapper
      // creates the RadioButtonGroup. The correct tandem is specified at that point.
      tandem: providedOptions.tandem,
      phetioFeatured: true
    } );

    const customLauncherTypeRadioButtonGroup = new CustomLauncherTypeRadioButtonGroup( customLauncherMechanismProperty, {
      tandem: providedOptions.tandem.createTandem( 'customLauncherTypeRadioButtonGroup' ),
      phetioFeatured: true
    } );

    const angleStabilitySection = new AngleStabilitySection( angleStabilityProperty, {
        tandem: providedOptions.tandem.createTandem( 'angleStabilitySection' )
      }
    );

    const customLauncherControls = new VBox( {
      children: [ customLauncherTypeRadioButtonGroup, angleStabilitySection ],
      spacing: 4
    } );

    // To avoid the panel changing size between 'mystery' and 'custom', ensure that both content nodes have the same footprint.
    // This is because we use the 'excluded' strategy for unselected children in the ToggleNode.
    const alignGroup = new AlignGroup( {
      matchHorizontal: true,
      matchVertical: false
    } );

    const launcherControlsToggleNode = new ToggleNode<MysteryOrCustom, Node>( mysteryOrCustomProperty, [ {
      value: 'mystery',
      createNode: () => alignGroup.createBox( mysteryLauncherRadioButtonGroupWrapper )
    }, {
      value: 'custom',
      createNode: () => alignGroup.createBox( customLauncherControls )
    } ], {
      unselectedChildrenSceneGraphStrategy: 'excluded'
    } );

    const contentContainer = new VBox( {
      children: [ mysteryOrCustomRadioButtonGroup, launcherControlsToggleNode ],
      spacing: 5
    } );

    super( null, contentContainer, providedOptions );
  }
}

projectileDataLab.register( 'MysteryOrCustomLauncherSection', MysteryOrCustomLauncherSection );
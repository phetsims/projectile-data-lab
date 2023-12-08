// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import HorizontalAquaRadioButtonGroup from '../../../../sun/js/HorizontalAquaRadioButtonGroup.js';
import { CustomLauncherType } from '../../common-vsm/model/CustomLauncherType.js';
import CustomLauncherTypeRadioButtonGroup from '../../common-vsm/view/CustomLauncherTypeRadioButtonGroup.js';
import AngleStabilizerNumberControl from '../../common-vsm/view/AngleStabilizerNumberControl.js';
import PDLText from '../../common/view/PDLText.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionAnyLauncherOptions = SelfOptions & PDLPanelSectionOptions;

export default class SectionAnyLauncher extends PDLPanelSection {

  public constructor( isLauncherCustomProperty: PhetioProperty<boolean>, presetLauncherProperty: PhetioProperty<number>,
                      customLauncherTypeProperty: PhetioProperty<CustomLauncherType>, angleStabilizerProperty: PhetioProperty<number>,
                      providedOptions: SectionAnyLauncherOptions ) {

    // TODO: Use ABSwitch - see see https://github.com/phetsims/projectile-data-lab/issues/7
    const radioButtonItems: AquaRadioButtonGroupItem<boolean>[] = [ {
      createNode: () => new Text( ProjectileDataLabStrings.mysteryStringProperty ),
      value: false,
      tandemName: 'standardLauncherRadioButton'
    }, {
      createNode: () => new Text( ProjectileDataLabStrings.customStringProperty ),
      value: true,
      tandemName: 'customLauncherRadioButton'
    } ];

    // radio button group, horizontally layout
    const isLauncherCustomRadioButtonGroup = new HorizontalAquaRadioButtonGroup( isLauncherCustomProperty, radioButtonItems, {
      radioButtonOptions: { radius: 8 },
      touchAreaYDilation: 15,
      spacing: 30,
      left: 50,
      centerY: 0,
      maxWidth: 150,
      tandem: providedOptions.tandem.createTandem( 'isLauncherCustomRadioButtonGroup' )
    } );

    // TODO: Factor this out here and in SectionPresetLauncher - see https://github.com/phetsims/projectile-data-lab/issues/7
    const presetLauncherRadioButtonGroupItems: RectangularRadioButtonGroupItem<number>[] = [];

    // TODO: be explicit in passing the validValues through as a separate option, see https://github.com/phetsims/projectile-data-lab/issues/7
    _.range( 1, 7 ).forEach( presetLauncher => {
      presetLauncherRadioButtonGroupItems.push( {
        value: presetLauncher,
        tandemName: `presetLauncher${presetLauncher}RadioButton`,
        createNode: () => new PDLText( presetLauncher.toString() )
      } );
    } );

    const presetLauncherRadioButtonGroup = new RectangularRadioButtonGroup( presetLauncherProperty, presetLauncherRadioButtonGroupItems, {
      tandem: providedOptions.tandem.createTandem( 'presetLauncherRadioButtonGroup' ),
      orientation: 'horizontal'
    } );

    const customLauncherTypeRadioButtonGroup = new CustomLauncherTypeRadioButtonGroup( customLauncherTypeProperty, {
      tandem: providedOptions.tandem.createTandem( 'customLauncherTypeRadioButtonGroup' )
    } );

    const angleStabilizerNumberControl = new AngleStabilizerNumberControl( angleStabilizerProperty, {
      tandem: providedOptions.tandem.createTandem( 'angleStabilizerNumberControl' )
    } );

    const customLauncherControls = new VBox( {
      children: [ customLauncherTypeRadioButtonGroup, angleStabilizerNumberControl ],
      spacing: 5, stretch: true, topMargin: 8
    } );

    const launcherControlsToggleNode = new ToggleNode<boolean, Node>( isLauncherCustomProperty, [ {
      value: false,
      createNode: () => presetLauncherRadioButtonGroup
    }, {
      value: true,
      createNode: () => customLauncherControls
    } ], {} );

    const contentContainer = new VBox( { children: [ isLauncherCustomRadioButtonGroup, launcherControlsToggleNode ], spacing: 5, stretch: true } );

    super( ProjectileDataLabStrings.launcherStringProperty, contentContainer, providedOptions );
  }
}

projectileDataLab.register( 'SectionAnyLauncher', SectionAnyLauncher );
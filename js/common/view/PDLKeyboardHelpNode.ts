// Copyright 2023-2024, University of Colorado Boulder

/**
 * PDLKeyboardHelpNode is the keyboard help for all screens. The majority of elements are relevant to all screens.
 * Elements that are not relevant to all screens may be omitted via providedOptions.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent, { TwoColumnKeyboardHelpContentOptions } from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import projectileDataLab from '../../projectileDataLab.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import LetterKeyNode from '../../../../scenery-phet/js/keyboard/LetterKeyNode.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import NumberKeyNode from '../../../../scenery-phet/js/keyboard/NumberKeyNode.js';
import optionize from '../../../../phet-core/js/optionize.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';

type SelfOptions = {

  // Whether to include the keyboard shortcut labeled 'Select a field', which is not relevant in the 'Sampling' screen.
  hasShowField1Through6Shortcut?: boolean;
};

type PDLKeyboardHelpNodeOptions = SelfOptions;

export default class PDLKeyboardHelpNode extends TwoColumnKeyboardHelpContent {

  public constructor( showSliderHelp: boolean, additionalLeftColumnContent: KeyboardHelpSection[] = [], providedOptions?: PDLKeyboardHelpNodeOptions ) {

    const options = optionize<PDLKeyboardHelpNodeOptions, SelfOptions, TwoColumnKeyboardHelpContentOptions>()( {

      // SelfOptions
      hasShowField1Through6Shortcut: true
    }, providedOptions );

    const leftColumn = [
      new FromAnywhereInSimHelpSection( options.hasShowField1Through6Shortcut ),
      new MoveDraggableItemsKeyboardHelpSection(),
      ...additionalLeftColumnContent
    ];

    const rightColumn = [
      ...( showSliderHelp ? [ new SliderControlsKeyboardHelpSection() ] : [] ),
      new BasicActionsKeyboardHelpSection( { withCheckboxContent: true } )
    ];

    super( leftColumn, rightColumn );
  }
}

/**
 * The section labeled 'Keyboard Shortcuts'.
 */
class FromAnywhereInSimHelpSection extends KeyboardHelpSection {

  public constructor( hasShowField1Through6Shortcut: boolean ) {

    // Press the launch button: [Opt][L]
    const rows = [
      KeyboardHelpSectionRow.createKeysRow( [ TextKeyNode.altOrOption(), LetterKeyNode.l() ], ProjectileDataLabStrings.launchOrStopProjectilesStringProperty )
    ];

    // Go to field: [Opt][1]-[6]
    if ( hasShowField1Through6Shortcut ) {
      rows.push( KeyboardHelpSectionRow.createKeysRow( [ new TextKeyNode( 'J' ),
          KeyboardHelpIconFactory.iconToIcon( new NumberKeyNode( 1 ), new NumberKeyNode( 6 ) ) ],
        ProjectileDataLabStrings.goToFieldStringProperty ) );
    }

    super( ProjectileDataLabStrings.fromAnywhereInSimStringProperty, rows, {
      textMaxWidth: 250,
      isDisposable: false
    } );
  }
}

projectileDataLab.register( 'PDLKeyboardHelpNode', PDLKeyboardHelpNode );
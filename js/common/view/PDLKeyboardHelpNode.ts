// Copyright 2023-2024, University of Colorado Boulder

/**
 * PDLKeyboardHelpNode is the keyboard help for all screens.
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
import { optionize } from '../../../../phet-core/js/imports.js';

type SelfOptions = {

  // Whether to include the keyboard shortcut labeled 'Select a field', which is not relevant in the 'Sampling' screen.
  hasSelectAFieldShortcut?: boolean;
};

type PDLKeyboardHelpNodeOptions = SelfOptions;

export default class PDLKeyboardHelpNode extends TwoColumnKeyboardHelpContent {

  public constructor( providedOptions?: PDLKeyboardHelpNodeOptions ) {

    const options = optionize<PDLKeyboardHelpNodeOptions, SelfOptions, TwoColumnKeyboardHelpContentOptions>()( {

      // SelfOptions
      hasSelectAFieldShortcut: true
    }, providedOptions );

    const leftColumn = [
      new MoveDraggableItemsKeyboardHelpSection(),
      new KeyboardShortcutsHelpSection( options.hasSelectAFieldShortcut )
    ];

    const rightColumn = [
      new BasicActionsKeyboardHelpSection( { withCheckboxContent: true } )
    ];

    super( leftColumn, rightColumn );
  }
}

/**
 * The section labeled 'Keyboard Shortcuts'.
 */
class KeyboardShortcutsHelpSection extends KeyboardHelpSection {

  public constructor( hasSelectAFieldShortcut: boolean ) {

    // Press the launch button: [Opt][L]
    const rows = [
      KeyboardHelpSectionRow.createKeysRow( [ TextKeyNode.altOrOption(), LetterKeyNode.l() ], ProjectileDataLabStrings.pressTheLaunchButtonStringProperty )
    ];

    // Select a field: [Opt][1]-[6]
    if ( hasSelectAFieldShortcut ) {
      rows.push( KeyboardHelpSectionRow.createKeysRow( [ TextKeyNode.altOrOption(),
          KeyboardHelpIconFactory.iconToIcon( new NumberKeyNode( 1 ), new NumberKeyNode( 6 ) ) ],
        ProjectileDataLabStrings.selectAFieldStringProperty ) );
    }

    super( ProjectileDataLabStrings.keyboardShortcutsStringProperty, rows, {
      textMaxWidth: 250,
      isDisposable: false
    } );
  }
}

projectileDataLab.register( 'PDLKeyboardHelpNode', PDLKeyboardHelpNode );

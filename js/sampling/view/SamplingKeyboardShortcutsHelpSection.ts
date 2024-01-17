// Copyright 2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import LetterKeyNode from '../../../../scenery-phet/js/keyboard/LetterKeyNode.js';

/**
 * Hotkeys related to the sim. We discovered that in John Travoltage, they are referred to as "keyboard shortcuts"
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export default class SamplingKeyboardShortcutsHelpSection extends KeyboardHelpSection {

  public constructor() {

    const row = KeyboardHelpSectionRow.createKeysRow( [ TextKeyNode.altOrOption(), LetterKeyNode.l() ], ProjectileDataLabStrings.pressTheLaunchButtonStringProperty );

    super( ProjectileDataLabStrings.keyboardShortcutsStringProperty, [ row ], {
      textMaxWidth: 250,
      isDisposable: false
    } );
  }
}

projectileDataLab.register( 'SamplingKeyboardShortcutsHelpSection', SamplingKeyboardShortcutsHelpSection );
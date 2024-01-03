// Copyright 2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import NumberKeyNode from '../../../../scenery-phet/js/keyboard/NumberKeyNode.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';

/**
 * Hotkeys related to the sim. We discovered that it John Travoltage, they are referred to as "keyboard shortcuts"
 */
export default class KeyboardShortcutsHelpSection extends KeyboardHelpSection {

  public constructor() {

    const row = KeyboardHelpSectionRow.createKeysRow( [ TextKeyNode.altOrOption(), KeyboardHelpIconFactory.iconToIcon( new NumberKeyNode( 0 ), new NumberKeyNode( 8 ) ) ], ProjectileDataLabStrings.selectAFieldStringProperty );

    super( ProjectileDataLabStrings.keyboardShortcutsStringProperty, [ row ], {
      textMaxWidth: 250,
      isDisposable: false // See https://github.com/phetsims/fourier-making-waves/issues/236
    } );
  }
}

projectileDataLab.register( 'KeyboardShortcutsHelpSection', KeyboardShortcutsHelpSection );
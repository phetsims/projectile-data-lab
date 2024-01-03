// Copyright 2023, University of Colorado Boulder

/**
 * PDLKeyboardHelpNode offers the specific keyboard guidance for a Projectile Data Lab simulation screen.
 * It is a structured layout presenting basic actions and other keyboard interactions.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import projectileDataLab from '../../projectileDataLab.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';

export default class PDLKeyboardHelpNode extends TwoColumnKeyboardHelpContent {
  public constructor( ...additionalSections: KeyboardHelpSection[] ) {
    // KeyboardHelpSection.alignHelpSectionIcons( rightContent );
    super( [ new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } ) ], [
      new MoveDraggableItemsKeyboardHelpSection(),
      ...additionalSections
    ] );
  }
}

projectileDataLab.register( 'PDLKeyboardHelpNode', PDLKeyboardHelpNode );

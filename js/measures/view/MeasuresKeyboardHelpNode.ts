// Copyright 2023-2024, University of Colorado Boulder

/**
 * The MeasuresKeyboardHelpNode shows the keyboard shortcuts and keyboard help items for the Measures screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PDLKeyboardHelpNode from '../../common/view/PDLKeyboardHelpNode.js';
import projectileDataLab from '../../projectileDataLab.js';
import VSMKeyboardShortcutsHelpSection from '../../common-vsm/view/VSMKeyboardShortcutsHelpSection.js';

export default class MeasuresKeyboardHelpNode extends PDLKeyboardHelpNode {

  public constructor() {
    super( new VSMKeyboardShortcutsHelpSection() );
  }
}

projectileDataLab.register( 'MeasuresKeyboardHelpNode', MeasuresKeyboardHelpNode );

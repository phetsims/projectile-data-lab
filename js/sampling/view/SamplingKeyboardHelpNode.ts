// Copyright 2023-2024, University of Colorado Boulder

/**
 * The SamplingKeyboardHelpNode shows the keyboard shortcuts and other keyboard help items for the Sampling screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PDLKeyboardHelpNode from '../../common/view/PDLKeyboardHelpNode.js';
import projectileDataLab from '../../projectileDataLab.js';

export default class SamplingKeyboardHelpNode extends PDLKeyboardHelpNode {

  public constructor() {
    super();
  }
}

projectileDataLab.register( 'SamplingKeyboardHelpNode', SamplingKeyboardHelpNode );

// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node } from '../../../../scenery/js/imports.js';
import PDLAccordionBox, { PDLAccordionBoxOptions } from '../../common/view/PDLAccordionBox.js';
import projectileDataLab from '../../projectileDataLab.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

/**
 * The VSMAccordionBox is an accordion UI component for the Projectile Data Lab simulation.
 * It contains a histogram as well as associated controls.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;

export type VSMAccordionBoxOptions =
  SelfOptions & WithRequired<PDLAccordionBoxOptions, 'tandem' | 'expandedProperty' | 'fill'>;


export default class VSMAccordionBox extends PDLAccordionBox {

  public constructor( contentNode: Node, providedOptions: VSMAccordionBoxOptions ) {
    super( contentNode, providedOptions );
  }

}

projectileDataLab.register( 'VSMAccordionBox', VSMAccordionBox );
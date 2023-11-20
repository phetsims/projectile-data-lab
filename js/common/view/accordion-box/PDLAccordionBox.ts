// Copyright 2022-2023, University of Colorado Boulder

/**
 * The PDLAccordionBox is an accordion UI component for the Projectile Data Lab simulation.
 * It contains the histogram component as well as associated controls.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../../sun/js/AccordionBox.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import { Node, Path, TPaint } from '../../../../../scenery/js/imports.js';
import { Shape } from '../../../../../kite/js/imports.js';
import WithRequired from '../../../../../phet-core/js/types/WithRequired.js';
import projectileDataLab from '../../../projectileDataLab.js';

type SelfOptions = EmptySelfOptions;

export type PDLAccordionBoxOptions =
  SelfOptions
  & WithRequired<AccordionBoxOptions, 'tandem' | 'expandedProperty' | 'fill'>;

// constants
export const CONTENT_MARGIN = 12;
export const BUTTON_AND_TITLE_MARGIN = 10;
const BUTTON_SIDE_LENGTH = 20;

export default class PDLAccordionBox extends AccordionBox {
  public constructor( contentNode: Node, providedOptions: PDLAccordionBoxOptions ) {

    const options = optionize<PDLAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      titleAlignX: 'left',
      titleXSpacing: 8,
      cornerRadius: 6,
      titleYMargin: BUTTON_AND_TITLE_MARGIN,
      buttonXMargin: BUTTON_AND_TITLE_MARGIN,
      buttonYMargin: BUTTON_AND_TITLE_MARGIN,
      contentXMargin: CONTENT_MARGIN,

      // We want the content to go all the way to the top of the accordionBox.
      // The bottom margin is set in ACCORDION_BOX_CONTENTS_SHAPE values
      contentYMargin: 0,
      contentYSpacing: 0,
      contentAlign: 'left',
      allowContentToOverlapTitle: true,
      useExpandedBoundsWhenCollapsed: false,
      expandCollapseButtonOptions: {
        sideLength: BUTTON_SIDE_LENGTH
      },

      isDisposable: false
    }, providedOptions );

    super( contentNode, options );
  }

  public static createBackgroundNode( shape: Shape, fill: TPaint ): Node {
    return new Node( {

      // add clip area so dot stacks that are taller than the accordion box are clipped appropriately
      clipArea: shape,
      children: [

        // A sub-node so it can be non-pickable (so that click events can still reach the accordion box title bar)
        new Path( shape, {
          pickable: false,
          fill: fill
        } )
      ]
    } );
  }
}

projectileDataLab.register( 'PDLAccordionBox', PDLAccordionBox );
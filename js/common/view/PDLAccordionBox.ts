// Copyright 2023, University of Colorado Boulder

/**
 * The PDLAccordionBox is an accordion UI component for the Projectile Data Lab simulation.
 * It contains the histogram component as well as associated controls.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import projectileDataLab from '../../projectileDataLab.js';
import Property from '../../../../axon/js/Property.js';
import PDLColors from '../PDLColors.js';

type SelfOptions = EmptySelfOptions;

export type PDLAccordionBoxOptions =
  SelfOptions
  & WithRequired<AccordionBoxOptions, 'tandem'>;

export default class PDLAccordionBox extends AccordionBox {
  public constructor( comboBoxParent: Node,
                      content: Node,
                      selectedBinWidthProperty: Property<number>,
                      selectedTotalBinsProperty: Property<number>,
                      providedOptions: PDLAccordionBoxOptions ) {

    const margin = 8;

    const options = optionize<PDLAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      fill: PDLColors.panelColorProperty,
      stroke: PDLColors.panelStrokeColorProperty,
      titleAlignX: 'left',
      titleXSpacing: margin,
      buttonXMargin: margin,
      buttonYMargin: margin,
      contentYMargin: margin,
      contentYSpacing: 0
    }, providedOptions );
    const contentContainer = new Node( {
      children: [
        // binControlNode,
        content
      ]
    } );

    super( contentContainer, options );
  }
}

projectileDataLab.register( 'PDLAccordionBox', PDLAccordionBox );
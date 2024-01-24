// Copyright 2023-2024, University of Colorado Boulder

/**
 * The HistogramAccordionBox is an accordion UI component for the Projectile Data Lab simulation.
 * It contains the histogram component as well as associated controls.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLColors from '../PDLColors.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLConstants from '../PDLConstants.js';

type SelfOptions = EmptySelfOptions;

export type HistogramAccordionBoxOptions =
  SelfOptions
  & WithRequired<AccordionBoxOptions, 'tandem'>;

export const histogramAccordionBoxTandemName = 'histogramAccordionBox';

export default class HistogramAccordionBox extends AccordionBox {
  public constructor( content: Node,
                      providedOptions: HistogramAccordionBoxOptions ) {

    const margin = 8;

    const options = optionize<HistogramAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      fill: PDLColors.panelColorProperty,
      stroke: PDLColors.panelStrokeColorProperty,
      titleAlignX: 'left',
      titleXSpacing: margin,
      buttonXMargin: margin,
      buttonYMargin: margin,
      contentYMargin: margin,
      contentYSpacing: 0,
      cornerRadius: 5,
      titleNode: new Text( ProjectileDataLabStrings.histogramStringProperty, {
        font: PDLConstants.LAUNCH_CONTROL_FONT,
        maxWidth: 600
      } )
    }, providedOptions );

    super( content, options );
  }
}

projectileDataLab.register( 'HistogramAccordionBox', HistogramAccordionBox );
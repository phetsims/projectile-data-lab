// Copyright 2023, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import PDLAccordionBox, { PDLAccordionBoxOptions } from '../../common/view/PDLAccordionBox.js';
import projectileDataLab from '../../projectileDataLab.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PDLConstants from '../../common/PDLConstants.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';

/**
 * The SamplingAccordionBox is an accordion UI component for the Projectile Data Lab simulation.
 * It contains a sampling distribution histogram, preview thumbnails and associated controls.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;

export type SamplingAccordionBoxOptions =
  SelfOptions & WithRequired<PDLAccordionBoxOptions, 'tandem' | 'binWidthProperty'>;

export default class SamplingAccordionBox extends PDLAccordionBox {

  public constructor( contentNode: Node, providedOptions: SamplingAccordionBoxOptions ) {
    const options = optionize<SamplingAccordionBoxOptions, SelfOptions, PDLAccordionBoxOptions>()( {
      titleNode: new Text( ProjectileDataLabStrings.distributionStringProperty, {
        font: PDLConstants.PRIMARY_FONT
      } )
    }, providedOptions );

    super( contentNode, options );
  }
}

projectileDataLab.register( 'SamplingAccordionBox', SamplingAccordionBox );
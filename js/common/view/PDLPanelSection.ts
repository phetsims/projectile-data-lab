// Copyright 2023-2024, University of Colorado Boulder

/**
 * Shows a title and content in a VBox. For the first 3 screens, the content is rectangular radio buttons.
 * For the Sampling screen, there are other content types.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { Node, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PDLText from './PDLText.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PDLConstants from '../PDLConstants.js';

type SelfOptions = {
  titleFont?: PhetFont;
};
export type PDLPanelSectionOptions = SelfOptions & VBoxOptions;

export default class PDLPanelSection extends VBox {

  public constructor( titleString: TReadOnlyProperty<string> | null, content: Node, providedOptions?: PDLPanelSectionOptions ) {

    const children: Node[] = [];

    if ( titleString ) {
      children.push( new PDLText( titleString, {
        maxWidth: 160
      } ) );
    }

    children.push( content );

    const options = optionize<PDLPanelSectionOptions, SelfOptions, VBoxOptions>()( {
      children: children,
      align: 'left',
      spacing: 5,
      titleFont: PDLConstants.PRIMARY_FONT,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    super( options );
  }
}
projectileDataLab.register( 'PDLPanelSection', PDLPanelSection );
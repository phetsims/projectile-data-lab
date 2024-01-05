// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Node, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PDLText from './PDLText.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

/**
 * Shows a title and content in a VBox. For the first 3 screens, the content is rectangular radio buttons.
 * For the Sampling screen, there are other content types.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
type SelfOptions = {
  titleFont?: PhetFont;
};
export type PDLPanelSectionOptions = SelfOptions & VBoxOptions;

export default class PDLPanelSection extends VBox {

  public constructor( titleString: TReadOnlyProperty<string> | null, content: Node, providedOptions?: PDLPanelSectionOptions ) {

    const children: Node[] = [];

    const titleFont = providedOptions?.titleFont ?? new PhetFont( 12 );

    if ( titleString ) {
      children.push( new PDLText( titleString, {
        maxWidth: 160,
        font: titleFont
      } ) );
    }

    children.push( content );

    const options = optionize<PDLPanelSectionOptions, SelfOptions, VBoxOptions>()( {
      children: children,
      align: 'left',
      spacing: 5,
      titleFont: titleFont
    }, providedOptions );

    super( options );
  }
}
projectileDataLab.register( 'PDLPanelSection', PDLPanelSection );
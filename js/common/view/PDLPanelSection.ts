// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Node, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PDLText from './PDLText.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

/**
 * Shows a title and content in a VBox. For the first 3 screens, the content is rectangular radio buttons.
 * For the Sampling screen, there are other content types.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;

// NOTE that the PDLPanelSection is not phet-io instrumented, but subtypes use that tandem to create sub-tandems
export type PDLPanelSectionOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class PDLPanelSection extends VBox {

  public constructor( titleString: TReadOnlyProperty<string>, content: Node, providedOptions?: PDLPanelSectionOptions ) {
    const title = new PDLText( titleString, {
      maxWidth: 250
    } );

    const options = optionize<PDLPanelSectionOptions, SelfOptions, VBoxOptions>()( {
      children: [ title, content ], align: 'left', spacing: 8
    }, providedOptions );

    super( options );
  }
}
projectileDataLab.register( 'PDLPanelSection', PDLPanelSection );
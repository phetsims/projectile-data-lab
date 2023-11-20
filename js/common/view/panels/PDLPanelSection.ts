// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../../projectileDataLab.js';
import { Node, Text, VBox, VBoxOptions } from '../../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../../phet-core/js/types/WithRequired.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';

/**
 * Shows a title and content in a VBox. For the first 3 screens, the content is rectangular radio buttons.
 * For the Sampling screen, there are other content types.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type PDLPanelSectionOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class PDLPanelSection extends VBox {

  public constructor( titleString: TReadOnlyProperty<string>, content: Node, providedOptions: PDLPanelSectionOptions ) {
    const title = new Text( titleString, {
      maxWidth: 250
    } );

    super( { children: [ title, content ], align: 'left', spacing: 8 } );
  }
}
projectileDataLab.register( 'PDLPanelSection', PDLPanelSection );
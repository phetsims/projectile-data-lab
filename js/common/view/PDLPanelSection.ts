// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type PDLPanelSectionOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class PDLPanelSection extends VBox {

  public constructor( titleString: TReadOnlyProperty<string>, content: RectangularRadioButtonGroup<IntentionalAny>, providedOptions: PDLPanelSectionOptions ) {
    const title = new Text( titleString );

    super( { children: [ title, content ], align: 'left', spacing: 8 } );
  }
}
projectileDataLab.register( 'PDLPanelSection', PDLPanelSection );
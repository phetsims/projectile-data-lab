// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Text, TextOptions } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLConstants from '../PDLConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;
type PDLTextOptions = SelfOptions & TextOptions;

/**
 * PDLText is a Text with the default font for the Projectile Data Lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export default class PDLText extends Text {
  public constructor( text: TReadOnlyProperty<string> | string, providedOptions?: PDLTextOptions ) {
    const options = optionize<PDLTextOptions, SelfOptions, TextOptions>()( {
      font: PDLConstants.PRIMARY_FONT
    }, providedOptions );
    super( text, options );
  }
}

projectileDataLab.register( 'PDLText', PDLText );
// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Text, TextOptions } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLConstants from '../PDLConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;
type PDLTextOptions = SelfOptions & TextOptions;

export default class PDLText extends Text {
  public constructor( text: TReadOnlyProperty<string> | string, providedOptions?: PDLTextOptions ) {
    const options = optionize<PDLTextOptions, SelfOptions, TextOptions>()( {
      font: PDLConstants.PRIMARY_FONT
    }, providedOptions );
    super( text, options );
  }
}
projectileDataLab.register( 'PDLText', PDLText );
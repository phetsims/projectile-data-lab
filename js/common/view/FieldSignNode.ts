// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';

/**
 * The FieldSignNode contains the visual display of the field sign.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type FieldSignNodeOptions = SelfOptions & NodeOptions;

export default class FieldSignNode extends Node {
  public constructor( providedOptions: FieldSignNodeOptions ) {
    super( providedOptions );
  }
}
projectileDataLab.register( 'FieldSignNode', FieldSignNode );
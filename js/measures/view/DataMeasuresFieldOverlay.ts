// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';

/**
 * The DataMeasuresFieldOverlay shows the graphics for the visual representation of the average and standard deviation
 * of the landed projectiles.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type DataMeasuresFieldOverlayOptions = SelfOptions & NodeOptions;

export default class DataMeasuresFieldOverlay extends Node {
  public constructor( providedOptions: DataMeasuresFieldOverlayOptions ) {
    super( providedOptions );
  }
}

projectileDataLab.register( 'DataMeasuresFieldOverlay', DataMeasuresFieldOverlay );
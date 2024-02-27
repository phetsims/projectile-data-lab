// Copyright 2023, University of Colorado Boulder

/**
 * The MeanIndicatorNode shows the visual representation of the average distance of landed projectiles.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import { Shape } from '../../../../kite/js/imports.js';
import PDLColors from '../../common/PDLColors.js';

type SelfOptions = EmptySelfOptions;
type MeanIndicatorNodeOptions = SelfOptions & PathOptions;

export default class MeanIndicatorNode extends Path {
  public constructor( radius: number, providedOptions?: MeanIndicatorNodeOptions ) {

    const options = optionize<MeanIndicatorNodeOptions, SelfOptions, PathOptions>()( {
      fill: PDLColors.meanMarkerFillProperty,
      stroke: PDLColors.meanMarkerStrokeProperty,
      rotation: Math.PI / 2 // The triangle is pointing down
    }, providedOptions );

    super( Shape.regularPolygon( 3, radius ), options );
  }
}

projectileDataLab.register( 'MeanIndicatorNode', MeanIndicatorNode );
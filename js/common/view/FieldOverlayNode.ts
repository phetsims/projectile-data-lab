// Copyright 2023, University of Colorado Boulder

import { Node, NodeOptions, Path, Circle, Text } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLConstants from '../PDLConstants.js';
import PDLColors from '../PDLColors.js';
import { Shape } from '../../../../kite/js/imports.js';
import PDLUtils from '../PDLUtils.js';

/**
 * The FieldOverlayNode contains the portions of the field that are not drawn using a perspective transform.
 * It consists of the horizontal dashed line, origin circle and field distance labels.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type FieldOverlayNodeOptions = SelfOptions & NodeOptions;

export default class FieldOverlayNode extends Node {
  public constructor( x: number, y: number, providedOptions: FieldOverlayNodeOptions ) {

    const numTotalDashes = 40;

    // Subtract 1 to make the dashed part of the right edge line up with the right side of the field
    const dashLength = PDLConstants.FIELD_WIDTH / ( 2 * numTotalDashes - 1 );

    // The dashed line extends horizontally along the width of the field.
    const dashedLineShape = new Shape();
    dashedLineShape.moveTo( -0.5 * PDLConstants.FIELD_WIDTH, 0 );
    dashedLineShape.lineTo( 0.496 * PDLConstants.FIELD_WIDTH, 0 );

    const dashedLine = new Path( dashedLineShape, {
      stroke: PDLColors.fieldBorderStrokeColorProperty,
      lineWidth: PDLConstants.FIELD_CENTER_LINE_WIDTH,
      lineDash: [ dashLength, dashLength ]
    } );

    const originCircle = new Circle( PDLConstants.FIELD_CENTER_LINE_WIDTH, {
      x: -0.5 * PDLConstants.FIELD_WIDTH,
      fill: PDLColors.fieldBorderStrokeColorProperty
    } );

    // Create the numbered distance labels
    const distanceLabels: Text[] = [];
    const totalDistanceLabels = ( PDLConstants.MAX_FIELD_DISTANCE - PDLConstants.FIELD_LINE_NUMBER_INCREMENT )
                                / PDLConstants.FIELD_LINE_NUMBER_INCREMENT;
    const distanceLabelY = PDLConstants.FIELD_LABEL_TOP_MARGIN + 0.5 * PDLConstants.FIELD_HEIGHT;

    for ( let i = 0; i <= totalDistanceLabels; i++ ) {
      const distance = ( i + 1 ) * PDLConstants.FIELD_LINE_NUMBER_INCREMENT;
      const distanceLabelX = -0.5 * PDLConstants.FIELD_WIDTH + distance * PDLConstants.PIXELS_TO_DISTANCE;

      // Apply the perspective transform to the label offset so that it is positioned relative to the bottom of the field
      const distanceLabelPositionShape = new Shape().moveTo( distanceLabelX, 0 ).lineTo( distanceLabelX, distanceLabelY );
      const distancePositionTransformed = distanceLabelPositionShape.nonlinearTransformed( {
        pointMap: PDLUtils.FIELD_TRANSFORM
      } );

      const textLabel = new Text( distance, {
        centerX: distance >= 0.5 * PDLConstants.MAX_FIELD_DISTANCE ?
                 distancePositionTransformed.bounds.right :
                 distancePositionTransformed.bounds.left,
        top: distancePositionTransformed.bounds.bottom + PDLConstants.FIELD_LABEL_TOP_MARGIN,
        font: PDLConstants.PRIMARY_FONT,
        maxWidth: PDLConstants.FIELD_LINE_NUMBER_INCREMENT * PDLConstants.PIXELS_TO_DISTANCE * 0.9 // Add a horizontal margin
      } );
      distanceLabels.push( textLabel );
    }

    super( { x: x, y: y, children: [ dashedLine, originCircle, ...distanceLabels ] } );
  }
}
projectileDataLab.register( 'FieldOverlayNode', FieldOverlayNode );
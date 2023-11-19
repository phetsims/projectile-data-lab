// Copyright 2023, University of Colorado Boulder

import { Node, NodeOptions, Path, Circle, Text } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import ProjectileDataLabConstants from '../ProjectileDataLabConstants.js';
import ProjectileDataLabColors from '../ProjectileDataLabColors.js';
import { Shape } from '../../../../kite/js/imports.js';

/**
 * The FieldOverlayNode contains the portions of the field that are not drawn using a perspective transform.
 * It contains the horizontal dashed line, origin circle and distance labels.
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
    const dashLength = ProjectileDataLabConstants.FIELD_WIDTH / ( 2 * numTotalDashes - 1 );

    // The dashed line extends horizontally along the width of the field.
    const dashedLineShape = new Shape();
    dashedLineShape.moveTo( -0.5 * ProjectileDataLabConstants.FIELD_WIDTH, 0 );
    dashedLineShape.lineTo( 0.5 * ProjectileDataLabConstants.FIELD_WIDTH, 0 );

    const dashedLine = new Path( dashedLineShape, {
      stroke: ProjectileDataLabColors.fieldBorderStrokeColorProperty,
      lineWidth: ProjectileDataLabConstants.FIELD_CENTER_LINE_WIDTH,
      lineDash: [ dashLength, dashLength ]
    } );

    const originCircle = new Circle( ProjectileDataLabConstants.FIELD_CENTER_LINE_WIDTH, {
      x: -0.5 * ProjectileDataLabConstants.FIELD_WIDTH,
      fill: ProjectileDataLabColors.fieldBorderStrokeColorProperty
    } );

    // Create the numbered distance labels
    const distanceLabels: Text[] = [];
    const totalDistanceLabels = ( ProjectileDataLabConstants.MAX_FIELD_DISTANCE - ProjectileDataLabConstants.FIELD_LINE_NUMBER_INCREMENT )
                                / ProjectileDataLabConstants.FIELD_LINE_NUMBER_INCREMENT;
    const distanceLabelY = ProjectileDataLabConstants.FIELD_LABEL_TOP_MARGIN + 0.5 * ProjectileDataLabConstants.FIELD_HEIGHT;

    for ( let i = 0; i <= totalDistanceLabels; i++ ) {
      const distance = ( i + 1 ) * ProjectileDataLabConstants.FIELD_LINE_NUMBER_INCREMENT;
      const distanceLabelX = -0.5 * ProjectileDataLabConstants.FIELD_WIDTH + distance * ProjectileDataLabConstants.PIXELS_TO_DISTANCE;
      const textLabel = new Text( distance, {
        centerX: distanceLabelX,
        top: distanceLabelY,
        font: ProjectileDataLabConstants.FIELD_LABEL_FONT,
        maxWidth: ProjectileDataLabConstants.FIELD_LINE_NUMBER_INCREMENT * ProjectileDataLabConstants.PIXELS_TO_DISTANCE * 0.9 // Add a horizontal margin
      } );
      distanceLabels.push( textLabel );
    }

    super( { x: x, y: y, children: [ dashedLine, originCircle, ...distanceLabels ] } );
  }
}
projectileDataLab.register( 'FieldOverlayNode', FieldOverlayNode );
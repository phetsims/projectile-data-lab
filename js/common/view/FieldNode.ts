// Copyright 2023-2024, University of Colorado Boulder

import { Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLConstants from '../PDLConstants.js';
import PDLColors from '../PDLColors.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PDLUtils from '../PDLUtils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Field from '../model/Field.js';

/**
 * The FieldNode is the floating horizontal surface on which projectiles land. Its elements are drawn using a nonlinear
 * perspective transform to simulate depth. It contains a rectangular background and vertical field lines to show bins.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = {

  // Is this the bottom half of the field? If so, it will be clipped to the bottom half of the field.
  isBottomHalf?: boolean;
};
type FieldNodeOptions = SelfOptions & NodeOptions;

export default class FieldNode extends Node {

  // The field lines are vertical lines spaced evenly along the field, according to the bin width.
  private fieldLines: Node[];

  // The field
  private readonly fieldBorder: Node;

  public constructor( fields: Field[], fieldProperty: TReadOnlyProperty<Field>, binWidthProperty: TReadOnlyProperty<number>, providedOptions: FieldNodeOptions ) {

    const fieldBounds = new Bounds2(
      -0.5 * PDLConstants.FIELD_WIDTH,
      -0.5 * PDLConstants.FIELD_HEIGHT,
      0.5 * PDLConstants.FIELD_WIDTH,
      0.5 * PDLConstants.FIELD_HEIGHT
    );

    const transformedShape = Shape.bounds( fieldBounds ).nonlinearTransformed( {
      pointMap: PDLUtils.transformField
    } );

    const fieldBackground = new Path( transformedShape, {
      fill: PDLColors.fieldFill1ColorProperty
    } );

    const defaultOptions = { isBottomHalf: false, children: [ fieldBackground ] };
    const options = optionize<FieldNodeOptions, SelfOptions, NodeOptions>()( defaultOptions, providedOptions );
    super( options );

    this.fieldLines = [];

    const fieldBorderShape = new Shape();

    // Top border
    fieldBorderShape.rect(
      -0.5 * ( PDLConstants.FIELD_WIDTH + PDLConstants.FIELD_BORDER_LINE_WIDTH ),
      -0.5 * ( PDLConstants.FIELD_HEIGHT + PDLConstants.FIELD_BORDER_LINE_WIDTH ),
      PDLConstants.FIELD_WIDTH + PDLConstants.FIELD_BORDER_LINE_WIDTH,
      PDLConstants.FIELD_BORDER_LINE_WIDTH
    );

    // Bottom border
    fieldBorderShape.rect(
      -0.5 * ( PDLConstants.FIELD_WIDTH + PDLConstants.FIELD_BORDER_LINE_WIDTH ),
      0.5 * ( PDLConstants.FIELD_HEIGHT - PDLConstants.FIELD_BORDER_LINE_WIDTH ),
      PDLConstants.FIELD_WIDTH + PDLConstants.FIELD_BORDER_LINE_WIDTH,
      PDLConstants.FIELD_BORDER_LINE_WIDTH
    );

    // Left border
    fieldBorderShape.rect(
      -0.5 * ( PDLConstants.FIELD_WIDTH + PDLConstants.FIELD_BORDER_LINE_WIDTH ),
      -0.5 * ( PDLConstants.FIELD_HEIGHT + PDLConstants.FIELD_BORDER_LINE_WIDTH ),
      PDLConstants.FIELD_BORDER_LINE_WIDTH,
      PDLConstants.FIELD_HEIGHT + PDLConstants.FIELD_BORDER_LINE_WIDTH
    );

    // Right border
    fieldBorderShape.rect(
      0.5 * ( PDLConstants.FIELD_WIDTH - PDLConstants.FIELD_BORDER_LINE_WIDTH ),
      -0.5 * ( PDLConstants.FIELD_HEIGHT + PDLConstants.FIELD_BORDER_LINE_WIDTH ),
      PDLConstants.FIELD_BORDER_LINE_WIDTH,
      PDLConstants.FIELD_HEIGHT + PDLConstants.FIELD_BORDER_LINE_WIDTH
    );

    const transformedFieldBorderShape = fieldBorderShape.nonlinearTransformed( {
      pointMap: PDLUtils.transformField
    } );
    this.fieldBorder = new Path( transformedFieldBorderShape, {
      fill: PDLColors.fieldBorderColorProperty
    } );
    this.addChild( this.fieldBorder );

    // If the field changes, update the color of the fieldBackground.
    fieldProperty.link( field => {
      fieldBackground.fill = PDLUtils.colorForFieldIndex( fields.indexOf( field ) );
    } );

    // If the bin width changes, remove the old field lines and create new ones.
    binWidthProperty.link( binWidth => {
      this.fieldLines.forEach( fieldLine => {
        this.removeChild( fieldLine );
      } );
      this.fieldLines = [];
      this.fieldLinesForBinWidth( binWidth ).forEach( fieldLine => {
        this.fieldLines.push( fieldLine );
        this.addChild( fieldLine );
      } );
      this.fieldBorder.moveToFront();
    } );

    const ellipse = new Shape().ellipse( new Vector2( -0.5 * PDLConstants.FIELD_WIDTH, 0 ), 35, 8, 0 );

    const fieldBoundsWithStroke = fieldBounds.dilated( 0.5 * PDLConstants.FIELD_BORDER_LINE_WIDTH );
    const fieldBoundsBottomHalf = fieldBounds.dilatedY( -0.25 * PDLConstants.FIELD_HEIGHT )
      .shiftedY( 0.25 * PDLConstants.FIELD_HEIGHT );
    const fieldBoundsBottomHalfWithStroke = fieldBoundsBottomHalf.dilatedX( 0.5 * PDLConstants.FIELD_BORDER_LINE_WIDTH )
      .dilatedY( 0.25 * PDLConstants.FIELD_BORDER_LINE_WIDTH ).shiftedY( 0.25 * PDLConstants.FIELD_BORDER_LINE_WIDTH );

    const leftSideShowingFactor = 0.035;
    const insetXAmount = -PDLConstants.FIELD_WIDTH * ( 1 - leftSideShowingFactor ) / 2;
    const leftSide = fieldBoundsBottomHalfWithStroke.dilatedX( insetXAmount ).shiftedX( insetXAmount );

    const rectBounds = options.isBottomHalf ? leftSide : fieldBoundsWithStroke;
    const rectBoundsTransformed = Shape.bounds( rectBounds ).nonlinearTransformed( {
      pointMap: PDLUtils.transformField
    } );
    const maskShape = rectBoundsTransformed.shapeDifference( ellipse );
    this.setClipArea( maskShape );
  }

  private fieldLinesForBinWidth( binWidth: number ): Node[] {
    const totalFieldLines = PDLConstants.MAX_FIELD_DISTANCE / binWidth - 1;
    const deltaX = binWidth * PDLConstants.FIELD_WIDTH / PDLConstants.MAX_FIELD_DISTANCE;
    const lineHeight = PDLConstants.FIELD_HEIGHT;
    const fieldLines: Node[] = [];

    for ( let i = 0; i < totalFieldLines; i++ ) {
      const x = -0.5 * PDLConstants.FIELD_WIDTH + deltaX * ( i + 1 );
      const isNumberedLine = ( i + 1 ) * binWidth % PDLConstants.FIELD_LABEL_INCREMENT === 0;
      const strokeColorProperty =
        isNumberedLine ?
        PDLColors.fieldBorderColorProperty :
        PDLColors.fieldLineColorProperty;
      const strokeWidth = isNumberedLine ? PDLConstants.FIELD_LINE_NUMBERED_WIDTH : PDLConstants.FIELD_LINE_WIDTH;
      const lineShape = new Shape().rect( x - 0.5 * strokeWidth, -0.5 * lineHeight, strokeWidth, lineHeight );
      const transformedLineShape = lineShape.nonlinearTransformed( {
        pointMap: PDLUtils.transformField
      } );
      const fieldLine = new Path( transformedLineShape, {
        fill: strokeColorProperty
      } );
      fieldLines.push( fieldLine );
    }
    return fieldLines;
  }
}
projectileDataLab.register( 'FieldNode', FieldNode );
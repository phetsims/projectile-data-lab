// Copyright 2023, University of Colorado Boulder

import { Node, NodeOptions, Rectangle, Line } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLConstants from '../PDLConstants.js';
import PDLColors from '../PDLColors.js';
import Property from '../../../../axon/js/Property.js';

/**
 * The FieldNode is the floating horizontal surface on which projectiles land. It contains vertical field lines
 * to show bins, as well as background graphics. It is drawn using a perspective transform to simulate depth.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type FieldNodeOptions = SelfOptions & NodeOptions;

export default class FieldNode extends Node {

  // The field lines are vertical lines spaced evenly along the field, according to the bin width.
  private fieldLines: Node[];

  public constructor( x: number, y: number, binWidthProperty: Property<number>, providedOptions: FieldNodeOptions ) {

    const fieldRectangle = new Rectangle(
      -0.5 * PDLConstants.FIELD_WIDTH,
      -0.5 * PDLConstants.FIELD_HEIGHT,
      PDLConstants.FIELD_WIDTH,
      PDLConstants.FIELD_HEIGHT, {
        fill: PDLColors.fieldFillColorProperty,
        stroke: PDLColors.fieldBorderStrokeColorProperty,
        lineWidth: PDLConstants.FIELD_BORDER_LINE_WIDTH
      }
    );

    const defaultOptions = { x: x, y: y, children: [ fieldRectangle ] };
    const options = optionize<FieldNodeOptions, SelfOptions, NodeOptions>()( defaultOptions, providedOptions );
    super( options );

    this.fieldLines = [];

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
    } );
  }

  private fieldLinesForBinWidth( binWidth: number ): Node[] {
    const totalFieldLines = PDLConstants.MAX_FIELD_DISTANCE / binWidth - 1;
    const deltaX = binWidth * PDLConstants.FIELD_WIDTH / PDLConstants.MAX_FIELD_DISTANCE;
    const lineHeight = PDLConstants.FIELD_HEIGHT - PDLConstants.FIELD_BORDER_LINE_WIDTH;
    const fieldLines: Node[] = [];

    for ( let i = 0; i < totalFieldLines; i++ ) {
      const x = -0.5 * PDLConstants.FIELD_WIDTH + deltaX * ( i + 1 );
      const isNumberedLine = ( i + 1 ) * binWidth % PDLConstants.FIELD_LINE_NUMBER_INCREMENT === 0;
      const strokeColorProperty =
        isNumberedLine ?
        PDLColors.fieldBorderStrokeColorProperty :
        PDLColors.fieldLineStrokeColorProperty;
      const line = new Line( x, -0.5 * lineHeight, x, 0.5 * lineHeight, {
        stroke: strokeColorProperty,
        lineWidth: PDLConstants.FIELD_LINE_WIDTH
      } );
      fieldLines.push( line );
    }
    return fieldLines;
  }
}
projectileDataLab.register( 'FieldNode', FieldNode );
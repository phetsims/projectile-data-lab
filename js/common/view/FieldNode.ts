// Copyright 2023, University of Colorado Boulder

import { Node, NodeOptions, Rectangle, Line, Path, Circle } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import ProjectileDataLabConstants from '../ProjectileDataLabConstants.js';
import ProjectileDataLabColors from '../ProjectileDataLabColors.js';
import Property from '../../../../axon/js/Property.js';
import { Shape } from '../../../../kite/js/imports.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type FieldNodeOptions = SelfOptions & NodeOptions;

export default class FieldNode extends Node {

  // The field lines are vertical lines spaced evenly along the field, according to the bin width.
  private fieldLines: Node[];

  // The dashed line extends horizontally along the width of the field.
  private dashedLine: Path;

  public constructor( x: number, y: number, binWidthProperty: Property<number>, providedOptions: FieldNodeOptions ) {

    const fieldRectangle = new Rectangle(
      -0.5 * ProjectileDataLabConstants.FIELD_WIDTH,
      -0.5 * ProjectileDataLabConstants.FIELD_HEIGHT,
      ProjectileDataLabConstants.FIELD_WIDTH,
      ProjectileDataLabConstants.FIELD_HEIGHT, {
        fill: ProjectileDataLabColors.fieldFillColorProperty,
        stroke: ProjectileDataLabColors.fieldStrokeColorProperty,
        lineWidth: ProjectileDataLabConstants.FIELD_BORDER_LINE_WIDTH
      }
    );

    const defaultOptions = {
      x: x,
      y: y,
      children: [ fieldRectangle ]
    };
    const options = optionize<FieldNodeOptions, SelfOptions, NodeOptions>()( defaultOptions, providedOptions );
    super( options );

    this.fieldLines = this.fieldLinesForBinWidth( binWidthProperty.value );
    this.fieldLines.forEach( fieldLine => {
      this.addChild( fieldLine );
    } );

    const numTotalDashes = 40;

    // Subtract 1 to make the dashed part of the right edge line up with the right side of the field
    const dashLength = ProjectileDataLabConstants.FIELD_WIDTH / ( 2 * numTotalDashes - 1 );

    const dashedLineShape = new Shape();
    dashedLineShape.moveTo( -0.5 * ProjectileDataLabConstants.FIELD_WIDTH, 0 );
    dashedLineShape.lineTo( 0.5 * ProjectileDataLabConstants.FIELD_WIDTH, 0 );

    this.dashedLine = new Path( dashedLineShape, {
      stroke: ProjectileDataLabColors.fieldStrokeColorProperty,
      lineWidth: 3,
      lineDash: [ dashLength, dashLength ]
    } );
    this.addChild( this.dashedLine );

    const originCircle = new Circle( 3, {
      x: -0.5 * ProjectileDataLabConstants.FIELD_WIDTH,
      fill: ProjectileDataLabColors.fieldStrokeColorProperty
    } );
    this.addChild( originCircle );

    // If the bin width changes, remove the old field lines and create new ones.
    binWidthProperty.lazyLink( binWidth => {
      this.fieldLines.forEach( fieldLine => {
        this.removeChild( fieldLine );
      } );
      this.fieldLines = [];
      this.fieldLinesForBinWidth( binWidth ).forEach( fieldLine => {
        this.fieldLines.push( fieldLine );
        this.addChild( fieldLine );
      } );
      this.dashedLine.moveToFront();
    } );
  }

  private fieldLinesForBinWidth( binWidth: number ): Node[] {
    const totalFieldLines = ProjectileDataLabConstants.MAX_FIELD_DISTANCE / binWidth - 1;
    const deltaX = binWidth * ProjectileDataLabConstants.FIELD_WIDTH / ProjectileDataLabConstants.MAX_FIELD_DISTANCE;
    const lineHeight = ProjectileDataLabConstants.FIELD_HEIGHT - ProjectileDataLabConstants.FIELD_BORDER_LINE_WIDTH;
    const fieldLines: Node[] = [];

    for ( let i = 0; i < totalFieldLines; i++ ) {
      const x = -0.5 * ProjectileDataLabConstants.FIELD_WIDTH + deltaX * ( 1 + i );
      const line = new Line( x, -0.5 * lineHeight, x, 0.5 * lineHeight, {
        stroke: ProjectileDataLabColors.fieldLineStrokeColorProperty,
        lineWidth: 2
      } );
      fieldLines.push( line );
    }
    return fieldLines;
  }
}
projectileDataLab.register( 'FieldNode', FieldNode );
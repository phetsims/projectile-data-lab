// Copyright 2023, University of Colorado Boulder

import optionize from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, Path, Rectangle, Text } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import Property from '../../../../axon/js/Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import PDLColors from '../../common/PDLColors.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';

/**
 * The HeatMapToolNode is a base class for tool nodes that show a heat map representation of data. It consists of an
 * array of graphical elements that update opacity as the data changes, as well as background and foreground graphics.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = {
  sourceDataProperty: Property<number>;
  heatNodeShape: Shape;
  binWidth: number;
  minValue: number;
  maxValue: number;
  titleStringProperty: LocalizedStringProperty;
};
export type HeatMapToolNodeOptions = SelfOptions & NodeOptions;

export default class HeatMapToolNode extends Node {
  private readonly heatNodes: Path[] = [];

  public constructor( providedOptions: HeatMapToolNodeOptions ) {
    const options = optionize<HeatMapToolNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions );
    super( options );

    const heatNodeWidth = options.heatNodeShape.bounds.width;
    const heatNodeHeight = options.heatNodeShape.bounds.height;

    const headingLabel = new Text( options.titleStringProperty, {
      centerX: 0
    } );
    const headingOffsetY = 5;
    headingLabel.setY( -0.5 * headingLabel.height - headingOffsetY );
    this.addChild( headingLabel );

    const marginX = 5;
    const marginY = 3;
    const heatNodeTotalWidth = heatNodeWidth * ( 1 + options.maxValue - options.minValue ) / options.binWidth;
    const totalWidth = heatNodeTotalWidth + 2 * marginX;
    const totalHeight = heatNodeHeight + headingLabel.bounds.height + headingOffsetY + 2 * marginY;
    const topY = headingLabel.y - headingLabel.bounds.height;

    const backgroundNode = new Rectangle( -0.5 * totalWidth, topY, totalWidth, totalHeight, {
      fill: 'white',
      cornerRadius: 5
    } );
    this.addChild( backgroundNode );
    backgroundNode.moveToBack();

    for ( let i = options.minValue; i <= options.maxValue; i += options.binWidth ) {
      const heatNode = new Path( options.heatNodeShape, {
        fill: PDLColors.heatMapColorProperty,
        x: -0.5 * heatNodeTotalWidth + i * heatNodeWidth,
        y: -0.5 * heatNodeHeight,
        opacity: 1
      } );
      this.heatNodes.push( heatNode );
      this.addChild( heatNode );
    }
  }
}

projectileDataLab.register( 'HeatMapToolNode', HeatMapToolNode );
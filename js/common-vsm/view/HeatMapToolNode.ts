// Copyright 2023, University of Colorado Boulder

import optionize from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, Path, Text } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import Property from '../../../../axon/js/Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import PDLColors from '../../common/PDLColors.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import PDLConstants from '../../common/PDLConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';

/**
 * The HeatMapToolNode is a base class for tool nodes that show a heat map representation of data. It consists of an
 * array of graphical elements that update opacity as the data changes, as well as background and foreground graphics.
 *
 * NOTE: Due to simulation-specific design and the need to coordinate with the SpeedToolNode AngleToolNode,
 * this does not extend or compose GaugeNode.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = {
  sourceDataProperty: Property<number>;
  displayOffset: Vector2;
  needleShape: Shape;
  bodyShape: Shape;
  heatNodeShape: Shape;
  binWidth: number;
  minValue: number;
  maxValue: number;
  minLabeledValue: number;
  maxLabeledValue: number;
  labeledValueIncrement: number;
  labelDistanceFromCenter: number;
  labelMinAngle: number;
  labelMaxAngle: number;
  titleStringProperty: LocalizedStringProperty;
  unitsStringProperty: LocalizedStringProperty;
};
export type HeatMapToolNodeOptions = SelfOptions & NodeOptions;

export default class HeatMapToolNode extends Node {
  private minValue: number;
  private maxValue: number;
  private binWidth: number;
  private readonly heatNodes: Path[] = [];
  private readonly numValuesInBin: number[] = [];

  private readonly needleNode: Node;

  public constructor( providedOptions: HeatMapToolNodeOptions ) {
    const options = optionize<HeatMapToolNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions );
    super( options );

    const displayNode = new Node( { x: options.displayOffset.x, y: options.displayOffset.y } );
    this.addChild( displayNode );

    this.minValue = options.minValue;
    this.maxValue = options.maxValue;
    this.binWidth = options.binWidth;

    const heatNodeWidth = options.heatNodeShape.bounds.width;
    const heatNodeHeight = options.heatNodeShape.bounds.height;

    const heatNodeTotalWidth = heatNodeWidth * ( 1 + options.maxValue - options.minValue ) / options.binWidth;

    for ( let i = this.minValue; i <= this.maxValue; i += this.binWidth ) {
      const heatNode = new Path( options.heatNodeShape, {
        fill: PDLColors.heatMapColorProperty,
        x: -0.5 * heatNodeTotalWidth + i * heatNodeWidth,
        y: -0.5 * heatNodeHeight
      } );
      this.heatNodes.push( heatNode );
      displayNode.addChild( heatNode );

      // Initialize the number of values in each bin to 0
      this.numValuesInBin.push( 0 );
    }

    const labels = this.createLabels( options.minLabeledValue, options.maxLabeledValue, options.labeledValueIncrement,
      options.labelDistanceFromCenter, options.labelMinAngle, options.labelMaxAngle );

    const bodyNode = new Path( options.bodyShape, {
      fill: PDLColors.heatMapBodyFillColorProperty,
      stroke: PDLColors.heatMapBodyStrokeColorProperty, lineWidth: 1
    } );
    this.needleNode = this.createNeedleNode( options.needleShape );

    displayNode.addChild( bodyNode );
    labels.forEach( label => displayNode.addChild( label ) );
    displayNode.addChild( this.needleNode );

    options.sourceDataProperty.link( data => { this.updateHeatMapWithData( data ); } );
  }

  private createLabels( minLabeledValue: number, maxLabeledValue: number, labeledValueIncrement: number,
                        labelDistanceFromCenter: number, labelMinAngle: number, labelMaxAngle: number ): Text[] {
    const labels = [];

    for ( let i = minLabeledValue; i <= maxLabeledValue; i += labeledValueIncrement ) {
      const labelAngle = Utils.linear( minLabeledValue, maxLabeledValue, labelMinAngle, labelMaxAngle, i );
      const label = new Text( i.toString(), {
        centerX: labelDistanceFromCenter * Math.cos( Utils.toRadians( -labelAngle ) ),
        centerY: labelDistanceFromCenter * Math.sin( Utils.toRadians( -labelAngle ) ),
        font: PDLConstants.HEATMAP_TOOL_LABEL_FONT
      } );
      labels.push( label );
    }

    return labels;
  }

  private createNeedleNode( needleShape: Shape ): Node {
    const needleNode = new Path( needleShape, {
      fill: PDLColors.heatMapNeedleFillColorProperty,
      stroke: PDLColors.heatMapNeedleStrokeColorProperty,
      lineWidth: 1,
      x: 0,
      y: 0
    } );
    return needleNode;
  }

  // updateHeatMapWithData updates the opacity of each heat node based on the number of values in the bin
  private updateHeatMapWithData( data: number ): void {
    const minOpacity = 0.2;
    const index = Math.floor( ( data - this.minValue ) / this.binWidth );

    if ( this.numValuesInBin[ index ] !== null ) {
      this.numValuesInBin[ index ]++;
      const maxNumValuesInBin = Math.max( ...this.numValuesInBin );

      // If the bin is empty, set the opacity to 0
      // If the bin has values, set the opacity to minOpacity + (1-minOpacity) * (# values in bin) / (largest # values in any bin)
      for ( let i = 0; i < this.heatNodes.length; i++ ) {
        if ( this.heatNodes[ i ] !== null ) {
          const opacityToSet = this.numValuesInBin[ i ] === 0 ? 0 : minOpacity + ( 1 - minOpacity ) * this.numValuesInBin[ i ] / maxNumValuesInBin;
          this.heatNodes[ i ].opacity = Utils.clamp( opacityToSet, 0, 1 ); // to avoid floating point errors
        }
      }
    }
  }
}

projectileDataLab.register( 'HeatMapToolNode', HeatMapToolNode );
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
  binWidth: number;
  minValue: number;
  maxValue: number;
  innerHeatNodeRadius: number;
  outerHeatNodeRadius: number;
  minHeatNodeAngle: number;
  maxHeatNodeAngle: number;
  minLabeledValue: number;
  maxLabeledValue: number;
  labeledValueIncrement: number;
  labelDistanceFromCenter: number;
  labelMinAngle: number;
  labelMaxAngle: number;
  titleStringProperty: LocalizedStringProperty;
  unitsStringProperty: LocalizedStringProperty;
  clockwise?: boolean;
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
    const options = optionize<HeatMapToolNodeOptions, SelfOptions, NodeOptions>()( {
      clockwise: false
    }, providedOptions );
    super( options );

    this.minValue = options.minValue;
    this.maxValue = options.maxValue;
    this.binWidth = options.binWidth;

    const displayNode = new Node( { x: options.displayOffset.x, y: options.displayOffset.y } );
    this.addChild( displayNode );

    const totalDeltaAngle = Math.abs( options.minHeatNodeAngle - options.maxHeatNodeAngle );
    const totalBins = ( options.maxValue - options.minValue ) / options.binWidth;
    const heatNodeArcLength = totalDeltaAngle / totalBins;

    this.heatNodes = this.createHeatNodes( -options.minHeatNodeAngle, heatNodeArcLength, options.innerHeatNodeRadius,
      options.outerHeatNodeRadius, options.clockwise );

    const labels = this.createLabels( options.minLabeledValue, options.maxLabeledValue, options.labeledValueIncrement,
      options.labelDistanceFromCenter, options.labelMinAngle, options.labelMaxAngle );

    const bodyNodeBack = new Path( options.bodyShape, { fill: PDLColors.heatMapBodyFillColorProperty } );
    const bodyNodeFront = new Path( options.bodyShape, { stroke: PDLColors.heatMapBodyStrokeColorProperty, lineWidth: 1 } );
    this.needleNode = this.createNeedleNode( options.needleShape );

    displayNode.addChild( bodyNodeBack );
    this.heatNodes.forEach( heatNode => displayNode.addChild( heatNode ) );
    labels.forEach( label => displayNode.addChild( label ) );
    displayNode.addChild( bodyNodeFront );
    displayNode.addChild( this.needleNode );

    options.sourceDataProperty.link( data => {
      const needleAngle = -Utils.linear( this.minValue, this.maxValue, options.minHeatNodeAngle, options.maxHeatNodeAngle, data );
      this.needleNode.setRotation( Utils.toRadians( needleAngle ) );
      this.updateHeatMapWithData( data );
    } );
  }

  private createHeatNodes( minHeatNodeAngle: number, heatNodeArcLength: number, innerRadius: number, outerRadius: number, isClockwise: boolean ): Path[] {
    const heatNodes = [];

    const outerCircle = new Shape().arc( 0, 0, outerRadius, Utils.toRadians( -heatNodeArcLength / 2 ),
      Utils.toRadians( heatNodeArcLength / 2 ) ).lineTo( 0, 0 );
    const innerCircle = new Shape().arc( 0, 0, innerRadius, Utils.toRadians( -heatNodeArcLength / 2 ),
      Utils.toRadians( heatNodeArcLength / 2 ) ).lineTo( 0, 0 );
    const heatNodeShape = outerCircle.shapeDifference( innerCircle ).close();

    const numHeatNodes = Math.floor( ( this.maxValue - this.minValue ) / this.binWidth );

    for ( let i = 0; i < numHeatNodes; i++ ) {
      const heatNode = new Path( heatNodeShape, {
        fill: PDLColors.heatMapColorProperty
      } );

      const deltaAngle = ( 0.5 + i ) * heatNodeArcLength;
      const headNodeAngle = isClockwise ? minHeatNodeAngle + deltaAngle : minHeatNodeAngle - deltaAngle;

      heatNode.rotateAround( Vector2.ZERO, Utils.toRadians( headNodeAngle ) );
      heatNodes.push( heatNode );

      // Initialize the number of values in each bin to 0
      this.numValuesInBin.push( 0 );
    }

    return heatNodes;
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
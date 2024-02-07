// Copyright 2023-2024, University of Colorado Boulder

import optionize from '../../../../phet-core/js/optionize.js';
import { ManualConstraint, Node, NodeOptions, Path, Rectangle, Text } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import { Shape } from '../../../../kite/js/imports.js';
import PDLColors from '../../common/PDLColors.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import PDLConstants from '../../common/PDLConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

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
  readoutPatternStringProperty: LocalizedStringProperty;
  displayOffset: Vector2;
  needleShape: Shape;
  bodyShape: Shape;
  binWidth: number;
  minValue: number;
  maxValue: number;
  innerHeatNodeRadius: number;
  outerHeatNodeRadius: number;
  minAngle: number;
  maxAngle: number;
  minLabeledValue: number;
  maxLabeledValue: number;
  labeledValueIncrement: number;
  labelDistanceFromCenter: number;
  labelMinAngle: number;
  labelMaxAngle: number;
  valueReadoutY: number;
  majorTickMarkLength?: number;
  minorTickMarkIncrement?: number;
  minorTickMarkLength?: number;
  isWithMinorTickMarks?: boolean;
  isWithInnerTickMarks?: boolean;
  isClockwise?: boolean;
  isIcon?: boolean;
};
export type HeatMapToolNodeOptions = SelfOptions & NodeOptions;

export default class HeatMapToolNode extends Node {
  private readonly minValue: number;
  private readonly maxValue: number;
  private readonly binWidth: number;
  private readonly numValuesInBin: number[] = [];

  protected readonly heatNodes: Path[] = [];
  protected readonly tickMarks: Path[] = [];
  protected readonly labels: Text[] = [];

  // The display node contains all the graphical elements of the heat map tool, excluding any connector graphics
  protected displayNode: Node;

  protected bodyBackNode: Path;
  protected bodyFrontNode: Path;
  protected readonly needleNode: Node;

  protected readonly valueReadoutNode: Node;
  private readonly valueReadout: Text;

  private readonly minAngle: number;
  private readonly maxAngle: number;

  public constructor( private readonly latestValueProperty: TReadOnlyProperty<number>,
                      providedOptions: HeatMapToolNodeOptions ) {
    const options = optionize<HeatMapToolNodeOptions, SelfOptions, NodeOptions>()( {
      isWithMinorTickMarks: false,
      isWithInnerTickMarks: false,
      majorTickMarkLength: 0,
      minorTickMarkIncrement: 0,
      minorTickMarkLength: 0,
      isClockwise: false,
      isIcon: false
    }, providedOptions );
    super( options );

    this.minValue = options.minValue;
    this.maxValue = options.maxValue;
    this.binWidth = options.binWidth;

    this.displayNode = new Node( { x: options.displayOffset.x, y: options.displayOffset.y } );
    this.addChild( this.displayNode );

    const totalDeltaAngle = Math.abs( options.minAngle - options.maxAngle );
    const totalBins = ( options.maxValue - options.minValue ) / options.binWidth;
    const heatNodeArcLength = totalDeltaAngle / totalBins;

    this.heatNodes = options.isIcon ? [] : this.createHeatNodes( -options.minAngle, heatNodeArcLength, options.innerHeatNodeRadius,
      options.outerHeatNodeRadius, options.isClockwise );

    this.labels = this.createLabels( options.minLabeledValue, options.maxLabeledValue, options.labeledValueIncrement,
      options.labelDistanceFromCenter, options.labelMinAngle, options.labelMaxAngle );

    this.tickMarks = this.createMajorTickMarks( options.minLabeledValue, options.maxLabeledValue,
      options.labeledValueIncrement, options.labelMinAngle, options.labelMaxAngle, options.majorTickMarkLength,
      options.isWithInnerTickMarks, options.innerHeatNodeRadius, options.outerHeatNodeRadius );

    if ( options.isWithMinorTickMarks ) {
      const minorTickMarks = this.createMinorTickMarks( options.minValue, options.maxValue, options.minAngle,
        options.maxAngle, options.minorTickMarkIncrement, options.minorTickMarkLength, options.outerHeatNodeRadius );
      this.tickMarks.push( ...minorTickMarks );
    }

    this.bodyBackNode = new Path( options.bodyShape, { fill: PDLColors.heatMapBodyFillColorProperty } );
    this.bodyFrontNode = new Path( options.bodyShape, { stroke: PDLColors.heatMapBodyStrokeColorProperty, lineWidth: 1 } );

    this.needleNode = this.createNeedleNode( options.needleShape );

    const formattedValueProperty = new DerivedProperty( [ latestValueProperty ], latestValue => {
      return Utils.toFixed( latestValue, 1 );
    } );

    const valueUnitsPatternStringProperty = new PatternStringProperty( options.readoutPatternStringProperty, {
      value: formattedValueProperty
    } );

    this.valueReadoutNode = new Node( { x: 0, y: options.valueReadoutY } );
    this.valueReadout = new Text( valueUnitsPatternStringProperty, {
      centerX: 0,
      centerY: 0,
      font: PDLConstants.PRIMARY_FONT,
      maxWidth: 60
    } );

    // Create a background rectangle for the value readout
    const valueReadoutBounds = this.valueReadout.bounds.dilatedXY( 8, 2 );
    const valueReadoutBackground = new Rectangle( valueReadoutBounds, {
      fill: '#ECECEC',
      stroke: 'black',
      lineWidth: 1,
      cornerRadius: 10
    } );

    this.valueReadoutNode.addChild( valueReadoutBackground );
    this.valueReadoutNode.addChild( this.valueReadout );

    ManualConstraint.create( this.valueReadoutNode, [ this.valueReadout ], valueReadoutProxy => {
      valueReadoutProxy.x = -0.5 * valueReadoutProxy.width;
      valueReadoutProxy.centerY = 0;
      const rectWidth = valueReadoutProxy.width + 16;
      valueReadoutBackground.setRectWidth( rectWidth );
      valueReadoutBackground.setRectX( -0.5 * rectWidth );
    } );

    this.displayNode.addChild( this.bodyBackNode );
    this.heatNodes.forEach( heatNode => this.displayNode.addChild( heatNode ) );
    this.labels.forEach( label => this.displayNode.addChild( label ) );
    this.tickMarks.forEach( tickMark => this.displayNode.addChild( tickMark ) );
    this.displayNode.addChild( this.bodyFrontNode );
    this.displayNode.addChild( this.needleNode );

    if ( !options.isIcon ) {
      this.displayNode.addChild( this.valueReadoutNode );
    }

    this.minAngle = options.minAngle;
    this.maxAngle = options.maxAngle;

    latestValueProperty.link( latestValue => {
      this.setNeedleRotation( latestValue );
    } );
  }

  private setNeedleRotation( value: number ): void {
    const needleAngle = -Utils.linear( this.minValue, this.maxValue, this.minAngle, this.maxAngle, value );
    this.needleNode.setRotation( Utils.toRadians( needleAngle ) );
  }

  private createHeatNodes( minAngle: number, heatNodeArcLength: number, innerRadius: number, outerRadius: number, isClockwise: boolean ): Path[] {
    const heatNodes = [];

    const outerCircle = new Shape().arc( 0, 0, outerRadius, Utils.toRadians( -heatNodeArcLength / 2 ),
      Utils.toRadians( heatNodeArcLength / 2 ) ).lineTo( 0, 0 );
    const innerCircle = new Shape().arc( 0, 0, innerRadius, Utils.toRadians( -heatNodeArcLength / 2 ),
      Utils.toRadians( heatNodeArcLength / 2 ) ).lineTo( 0, 0 );
    const heatNodeShape = outerCircle.shapeDifference( innerCircle ).close();

    const numHeatNodes = Math.floor( ( this.maxValue - this.minValue ) / this.binWidth );

    for ( let i = 0; i < numHeatNodes; i++ ) {
      const heatNode = new Path( heatNodeShape, {
        opacity: 0,
        fill: PDLColors.heatMapColorProperty
      } );

      const deltaAngle = ( 0.5 + i ) * heatNodeArcLength;
      const heatNodeAngle = isClockwise ? minAngle + deltaAngle : minAngle - deltaAngle;

      heatNode.rotateAround( Vector2.ZERO, Utils.toRadians( heatNodeAngle ) );
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

  private createMajorTickMarks( minLabeledValue: number, maxLabeledValue: number, labeledValueIncrement: number,
                                labelMinAngle: number, labelMaxAngle: number, majorTickMarkLength: number,
                                isWithInnerTickMarks: boolean, innerRadius: number, outerRadius: number ): Path[] {
    const majorTickMarks: Path[] = [];

    for ( let i = minLabeledValue; i <= maxLabeledValue; i += labeledValueIncrement ) {
      const angle = Utils.linear( minLabeledValue, maxLabeledValue, labelMinAngle, labelMaxAngle, i );
      const tickMarkAngle = Utils.toRadians( -angle );
      const outerMajorTickMark = new Path( new Shape().moveTo( outerRadius - majorTickMarkLength, 0 ).lineTo( outerRadius, 0 ), {
        stroke: PDLColors.heatMapBodyStrokeColorProperty,
        lineWidth: 1
      } );
      outerMajorTickMark.rotateAround( Vector2.ZERO, tickMarkAngle );
      majorTickMarks.push( outerMajorTickMark );

      if ( isWithInnerTickMarks ) {
        const innerMajorTickMark = new Path( new Shape().moveTo( innerRadius, 0 ).lineTo( innerRadius + majorTickMarkLength, 0 ), {
          stroke: PDLColors.heatMapBodyStrokeColorProperty,
          lineWidth: 1
        } );
        innerMajorTickMark.rotateAround( Vector2.ZERO, tickMarkAngle );
        majorTickMarks.push( innerMajorTickMark );
      }
    }

    return majorTickMarks;
  }

  private createMinorTickMarks( minValue: number, maxValue: number, minAngle: number, maxAngle: number, minorTickMarkIncrement: number,
                                minorTickMarkLength: number, outerRadius: number ): Path[] {
    const minorTickMarks: Path[] = [];

    for ( let i = minValue; i <= maxValue; i += minorTickMarkIncrement ) {
      const angle = Utils.linear( minValue, maxValue, minAngle, maxAngle, i );
      const tickMarkAngle = Utils.toRadians( -angle );
      const minorTickMark = new Path( new Shape().moveTo( outerRadius - minorTickMarkLength, 0 ).lineTo( outerRadius, 0 ), {
        stroke: PDLColors.heatMapBodyStrokeColorProperty,
        lineWidth: 1
      } );
      minorTickMark.rotateAround( Vector2.ZERO, tickMarkAngle );
      minorTickMarks.push( minorTickMark );
    }

    return minorTickMarks;
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
  public updateHeatMapWithData( data: number ): void {
    const minOpacity = 0.2;
    const index = Math.floor( ( data - this.minValue ) / this.binWidth );

    let maxNumValuesInBin = 0;

    if ( this.numValuesInBin[ index ] !== undefined ) {
      this.numValuesInBin[ index ]++;
      maxNumValuesInBin = Math.max( ...this.numValuesInBin );

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

  public clear(): void {
    this.numValuesInBin.forEach( ( value, index ) => {
      this.numValuesInBin[ index ] = 0;
      this.heatNodes[ index ].opacity = 0;
    } );
  }
}

projectileDataLab.register( 'HeatMapToolNode', HeatMapToolNode );
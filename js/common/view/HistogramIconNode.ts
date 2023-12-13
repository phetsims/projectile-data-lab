// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import HistogramCanvasPainter from './HistogramCanvasPainter.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import { ColorProperty, Node } from '../../../../scenery/js/imports.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { HistogramRepresentation } from '../model/HistogramRepresentation.js';
import Property from '../../../../axon/js/Property.js';

export default class HistogramIconNode extends Node {
  public constructor( blockFillProperty: ColorProperty, blockStrokeProperty: ColorProperty, histogramRepresentation: HistogramRepresentation ) {
    super( {
      pickable: true
    } );

    const chartTransform = new ChartTransform( {
      viewWidth: 23,
      viewHeight: 23,
      modelXRange: new Range( 0, 3 ),
      modelYRange: new Range( 0, 3 )
    } );
    const histogramPainter = new HistogramCanvasPainter(
      chartTransform,
      new NumberProperty( 1 ),
      new Property<HistogramRepresentation>( histogramRepresentation ),
      blockFillProperty, blockStrokeProperty
    );
    const data = [ { x: 0 }, { x: 0 }, { x: 1 }, { x: 1 }, { x: 1 }, { x: 2 } ];
    histogramPainter.setHistogramData( data, data[ 1 ] );
    const chartCanvasNode = new ChartCanvasNode( chartTransform, [ histogramPainter ], {} );

    this.addChild( chartCanvasNode );

    const area = chartCanvasNode.localBounds.dilatedXY( 2, 10 );
    this.setTouchArea( area );
    this.setMouseArea( area );
  }
}

projectileDataLab.register( 'HistogramIconNode', HistogramIconNode );
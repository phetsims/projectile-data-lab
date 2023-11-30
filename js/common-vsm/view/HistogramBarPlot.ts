// Copyright 2023, University of Colorado Boulder

import Vector2 from '../../../../dot/js/Vector2.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import { Color, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import bamboo from '../../../../bamboo/js/bamboo.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

/**
 * Shows bars or blocks for histogram-related numerical data.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type BarPlotOptions = SelfOptions & NodeOptions;

export default class HistogramBarPlot extends Node {

  public dataSet: Vector2[] = [];
  public readonly rectangles: Rectangle[] = [];

  public constructor( public readonly chartTransform: ChartTransform, public readonly binWidthProperty: TReadOnlyProperty<number>, providedOptions?: BarPlotOptions ) {

    super( providedOptions );

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );
  }

  /**
   * Sets the dataSet and redraws the plot. If instead the dataSet array is mutated, it is the client's responsibility
   * to call `update` or make sure `update` is called elsewhere (say, if the chart scrolls in that frame).
   */
  public setDataSet( dataSet: Vector2[] ): void {
    this.dataSet = dataSet;
    this.update();
  }

  public update(): void {
    const barRed = new Color( 206, 46, 35 );

    // Add one rectangle per data point.
    while ( this.rectangles.length < this.dataSet.length ) {
      const rectangle = new Rectangle( 0, 0, 0, 0, {
        fill: barRed
      } );
      this.rectangles.push( rectangle );
      this.addChild( rectangle );
    }

    // If any data points were removed, remove any extra rectangles.
    while ( this.rectangles.length > this.dataSet.length ) {
      const rectangle = this.rectangles.pop()!;
      this.removeChild( rectangle );
    }

    for ( let i = 0; i < this.rectangles.length; i++ ) {
      const barHeight = Math.abs( this.chartTransform.modelToViewDeltaY( this.dataSet[ i ].y ) );
      this.rectangles[ i ].setRect(
        this.chartTransform.modelToViewX( this.dataSet[ i ].x ),
        this.chartTransform.modelToViewY( 0 ) - barHeight,
        this.chartTransform.modelToViewDeltaX( this.binWidthProperty.value ),
        barHeight
      );
    }
  }
}

bamboo.register( 'HistogramBarPlot', HistogramBarPlot );

// Copyright 2023, University of Colorado Boulder

import Vector2 from '../../../../dot/js/Vector2.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import { Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import bamboo from '../../../../bamboo/js/bamboo.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import PDLColors from '../../common/PDLColors.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

/**
 * Shows bars or blocks for histogram-related numerical data.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type BarPlotOptions = SelfOptions & NodeOptions;

export default class HistogramBarPlot extends Node {

  public dataSet: Vector2[] = [];
  public readonly bars: Rectangle[] = [];
  public readonly blocks: Rectangle[] = [];

  public constructor( public readonly chartTransform: ChartTransform, public readonly binWidthProperty: TReadOnlyProperty<number>,
                      private readonly zoomLevelProperty: NumberProperty, providedOptions?: BarPlotOptions ) {

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
    const lineWidth = this.lineWidthForZoomLevel( this.zoomLevelProperty.value );

    // Add one rectangle per histogram bin
    while ( this.bars.length < this.dataSet.length ) {
      const rectangle = new Rectangle( 0, 0, 0, 0, {
        fill: PDLColors.histogramBarFillColorProperty,
        stroke: PDLColors.histogramBarStrokeColorProperty,
        lineWidth: lineWidth
      } );
      this.bars.push( rectangle );
      this.addChild( rectangle );
    }

    // If any data points were removed, remove any extra bars.
    while ( this.bars.length > this.dataSet.length ) {
      const rectangle = this.bars.pop()!;
      this.removeChild( rectangle );
    }

    const totalYValues = this.dataSet.reduce( ( sum, vector ) => sum + vector.y, 0 );
    while ( this.blocks.length < totalYValues ) {
      const block = new Rectangle( 0, 0, 0, 0, {
        fill: PDLColors.histogramBarFillColorProperty,
        stroke: PDLColors.histogramBarStrokeColorProperty,
        lineWidth: lineWidth
      } );
      this.blocks.push( block );
      this.addChild( block );
    }

    // If totalYValues decreased, remove any extra interior lines.
    while ( this.blocks.length > totalYValues ) {
      const block = this.blocks.pop()!;
      this.removeChild( block );
    }

    for ( let i = 0; i < this.bars.length; i++ ) {
      const barHeight = Math.abs( this.chartTransform.modelToViewDeltaY( this.dataSet[ i ].y ) );
      this.bars[ i ].setRect(
        this.chartTransform.modelToViewX( this.dataSet[ i ].x ),
        this.chartTransform.modelToViewY( 0 ) - barHeight,
        this.chartTransform.modelToViewDeltaX( this.binWidthProperty.value ),
        barHeight
      );
    }
    let blockIndex = 0;
    for ( let i = 0; i < this.dataSet.length; i++ ) {
      const barX = this.chartTransform.modelToViewX( this.dataSet[ i ].x );
      const barWidth = this.chartTransform.modelToViewDeltaX( this.binWidthProperty.value );

      // Calculate the number of blocks needed for this bar
      const numberOfBlocks = Utils.roundSymmetric( this.dataSet[ i ].y );

      // Initial y position for the first block in this bar
      let blockY = this.chartTransform.modelToViewY( 0 );

      // Height of a block in view coordinates
      const blockHeight = Math.abs( this.chartTransform.modelToViewDeltaY( 1 ) );

      // Position and stack blocks for this bar
      for ( let j = 0; j < numberOfBlocks; j++ ) {
        if ( blockIndex >= this.blocks.length ) {
          // Add a new block if needed
          const block = new Rectangle( 0, 0, barWidth, blockHeight, {
            fill: PDLColors.histogramBarFillColorProperty,
            stroke: PDLColors.histogramBarStrokeColorProperty,
            lineWidth: lineWidth
          } );
          this.blocks.push( block );
          this.addChild( block );
        }

        // Position the block
        blockY -= blockHeight; // Move up for each new block
        this.blocks[ blockIndex ].setRect( barX, blockY, barWidth, blockHeight );

        blockIndex++;
      }
    }

    // Remove any extra blocks
    while ( this.blocks.length > blockIndex ) {
      const block = this.blocks.pop()!;
      this.removeChild( block );
    }
  }

  private lineWidthForZoomLevel( zoomLevel: number ): number {
    // TODO: Improve this pattern - see https://github.com/phetsims/projectile-data-lab/issues/7
    const lineWidths = [ 0, 0.1, 0.5, 1, 2 ];
    return lineWidths[ zoomLevel ];
  }
}

bamboo.register( 'HistogramBarPlot', HistogramBarPlot );

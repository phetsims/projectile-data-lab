// Copyright 2023, University of Colorado Boulder

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import { Color, NodeOptions } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CanvasPainter from '../../../../bamboo/js/CanvasPainter.js';
import projectileDataLab from '../../projectileDataLab.js';
import { HistogramRepresentation } from '../model/HistogramRepresentation.js';
import HistogramData from '../../common/model/HistogramData.js';

/**
 * Shows bars or blocks for histogram-related numerical data.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type BarPlotOptions = SelfOptions & NodeOptions;

export default class HistogramCanvasPainter extends CanvasPainter {

  private data: HistogramData[] = [];
  private selectedData: HistogramData | null = null;

  public constructor( private readonly chartTransform: ChartTransform,
                      private readonly binWidthProperty: TReadOnlyProperty<number>,
                      private readonly histogramRepresentationProperty: TReadOnlyProperty<HistogramRepresentation>,
                      private readonly blockFillProperty: TReadOnlyProperty<Color>,
                      private readonly blockStrokeProperty: TReadOnlyProperty<Color>,
                      providedOptions?: BarPlotOptions ) {
    super( providedOptions );
  }

  /**
   * Sets the dataSet and redraws the plot. If instead the dataSet array is mutated, it is the client's responsibility
   * to call `update` or make sure `update` is called elsewhere (say, if the chart scrolls in that frame).
   */
  public setHistogramData( data: HistogramData[], selectedData: HistogramData | null ): void {
    this.data = data;
    this.selectedData = selectedData;
  }

  public paintCanvas( context: CanvasRenderingContext2D ): void {

    const histogramRepresentation = this.histogramRepresentationProperty.value;
    context.save();

    context.fillStyle = this.blockFillProperty.value.toCSS();
    context.strokeStyle = this.blockStrokeProperty.value.toCSS();

    const lineWidth = Math.abs( this.chartTransform.modelToViewDeltaY( 0.15 ) );

    // Canvas cannot render a lineWidth < 1 (it rounds up to 1), so we scale the canvas to compensate
    const scaleFactor = 1 / lineWidth;
    context.scale( 1 / scaleFactor, 1 / scaleFactor );
    context.lineWidth = 1;

    const histogram = new Map<number, number>();
    const binWidth = this.binWidthProperty.value;

    const blockWidth = this.chartTransform.modelToViewDeltaX( this.binWidthProperty.value );
    const blockHeight = Math.abs( this.chartTransform.modelToViewDeltaY( 1 ) );

    let highlightDotX = null;
    let highlightDotY = null;

    for ( let i = 0; i < this.data.length; i++ ) {
      const projectile = this.data[ i ];
      const isHighlighted = this.selectedData === projectile;

      // Calculate the bin for this value
      // REVIEW: Is this how you want to calculate the bin?
      const bin = Math.floor( projectile.x / binWidth ) * binWidth;

      // Update the count for this bin
      const binCount = ( histogram.get( bin ) || 0 ) + 1;
      histogram.set( bin, binCount );

      const x = this.chartTransform.modelToViewX( bin );
      const y = this.chartTransform.modelToViewY( binCount );

      if ( histogramRepresentation === 'blocks' ) {
        context.fillRect( x * scaleFactor, y * scaleFactor, blockWidth * scaleFactor, blockHeight * scaleFactor );
        context.strokeRect( x * scaleFactor, y * scaleFactor, blockWidth * scaleFactor, blockHeight * scaleFactor );
      }

      if ( isHighlighted ) {
        highlightDotX = x;
        highlightDotY = y;
      }
    }

    if ( histogramRepresentation === 'bars' ) {
      for ( const [ bin, count ] of histogram ) {
        const x = this.chartTransform.modelToViewX( bin );
        const y = this.chartTransform.modelToViewY( 0 );
        const height = this.chartTransform.modelToViewDeltaY( count );

        const h = Math.abs( height ) * scaleFactor;
        context.fillRect( x * scaleFactor, y * scaleFactor - h, blockWidth * scaleFactor, h );
        context.strokeRect( x * scaleFactor, y * scaleFactor - h, blockWidth * scaleFactor, h );
      }
    }

    // draw a white dot in the middle of the highlighted block, on top of the all the data blocks
    // TODO: Clean up now that we know we don't want to show the highlight in the bars mode, see https://github.com/phetsims/projectile-data-lab/issues/7
    if ( histogramRepresentation === 'blocks' ) {
      if ( highlightDotX !== null && highlightDotY !== null ) {
        context.beginPath();
        context.arc( highlightDotX * scaleFactor + blockWidth * scaleFactor / 2, highlightDotY * scaleFactor + blockHeight * scaleFactor / 2, 3 * scaleFactor, 0, 2 * Math.PI );
        context.fillStyle = 'white';
        context.strokeStyle = this.blockFillProperty.value.toCSS();
        context.lineWidth = scaleFactor;
        context.fill();
        context.stroke();
      }
    }

    context.restore();
  }
}

projectileDataLab.register( 'HistogramCanvasPainter', HistogramCanvasPainter );
// Copyright 2023, University of Colorado Boulder

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PDLColors from '../../common/PDLColors.js';
import CanvasPainter from '../../../../bamboo/js/CanvasPainter.js';
import projectileDataLab from '../../projectileDataLab.js';
import Projectile from '../../common/model/Projectile.js';

/**
 * Shows bars or blocks for histogram-related numerical data.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type BarPlotOptions = SelfOptions & NodeOptions;

export default class HistogramCanvasPainter extends CanvasPainter {

  private projectiles: Projectile[] = [];
  private selectedProjectile: Projectile | null = null;

  public constructor(
    public readonly chartTransform: ChartTransform,
    public readonly binWidthProperty: TReadOnlyProperty<number>,
    providedOptions?: BarPlotOptions ) {

    super( providedOptions );
  }

  /**
   * Sets the dataSet and redraws the plot. If instead the dataSet array is mutated, it is the client's responsibility
   * to call `update` or make sure `update` is called elsewhere (say, if the chart scrolls in that frame).
   */
  public setProjectiles( projectiles: Projectile[], selectedProjectile: Projectile | null ): void {
    this.projectiles = projectiles;
    this.selectedProjectile = selectedProjectile;
  }

  public paintCanvas( context: CanvasRenderingContext2D ): void {

    const HIGHLIGHT_WITH_COLOR_INVERSION = true;
    const HIGHLIGHT_WITH_WHITE_DOT = false;

    context.save();

    const setColors = ( isHighlighted: boolean ) => {
      if ( isHighlighted ) {
        context.fillStyle = PDLColors.histogramBarStrokeColorProperty.value.toCSS();
        context.strokeStyle = PDLColors.histogramBarFillColorProperty.value.toCSS();
      }
      else {
        context.fillStyle = PDLColors.histogramBarFillColorProperty.value.toCSS();
        context.strokeStyle = PDLColors.histogramBarStrokeColorProperty.value.toCSS();
      }
    };
    setColors( false );

    const lineWidth = Math.abs( this.chartTransform.modelToViewDeltaY( 0.15 ) );

    // Canvas cannot render a lineWidth < 1 (it rounds up to 1), so we scale the canvas to compensate
    const scaleFactor = 1 / lineWidth;
    context.scale( 1 / scaleFactor, 1 / scaleFactor );
    context.lineWidth = 1;

    const histogram = new Map<number, number>();
    const binWidth = this.binWidthProperty.value;

    for ( let i = 0; i < this.projectiles.length; i++ ) {
      const projectile = this.projectiles[ i ];

      // Calculate the bin for this value
      // REVIEW: Is this how you want to calculate the bin?
      const bin = Math.floor( projectile.x / binWidth ) * binWidth;

      // Update the count for this bin
      const binCount = ( histogram.get( bin ) || 0 ) + 1;
      histogram.set( bin, binCount );

      const x = this.chartTransform.modelToViewX( bin );
      const y = this.chartTransform.modelToViewY( binCount );
      const width = this.chartTransform.modelToViewDeltaX( this.binWidthProperty.value );
      const height = Math.abs( this.chartTransform.modelToViewDeltaY( 1 ) );

      if ( this.selectedProjectile === projectile && HIGHLIGHT_WITH_COLOR_INVERSION ) { setColors( true ); }

      context.fillRect( x * scaleFactor, y * scaleFactor, width * scaleFactor, height * scaleFactor );
      context.strokeRect( x * scaleFactor, y * scaleFactor, width * scaleFactor, height * scaleFactor );

      if ( this.selectedProjectile === projectile && HIGHLIGHT_WITH_COLOR_INVERSION ) { setColors( false );}

      if ( this.selectedProjectile === projectile && HIGHLIGHT_WITH_WHITE_DOT ) {

        // draw a white dot in the middle of the rectangle
        context.save();
        context.beginPath();
        context.arc( x * scaleFactor + width * scaleFactor / 2, y * scaleFactor + height * scaleFactor / 2, 1.2, 0, 2 * Math.PI );
        context.fillStyle = 'white';
        context.fill();
        context.restore();
      }
    }

    context.restore();
  }
}

projectileDataLab.register( 'HistogramCanvasPainter', HistogramCanvasPainter );
// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Color, Node } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Field from '../../common/model/Field.js';
import { HistogramRepresentation } from '../../common/model/HistogramRepresentation.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import HistogramCanvasPainter from '../../common/view/HistogramCanvasPainter.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import VSMField from '../../common-vsm/model/VSMField.js';
import SamplingField from '../model/SamplingField.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PDLText from '../../common/view/PDLText.js';

// TODO: Duplicated with the top of HistogramNode, see https://github.com/phetsims/projectile-data-lab/issues/7
export default class SampleThumbnailNode extends Node {

  protected readonly chartNode: Node;
  protected readonly chartTransform: ChartTransform;
  protected readonly chartClipLayer: Node;

  public constructor( thumbnailSampleSize: number,
                      fieldProperty: TReadOnlyProperty<Field>,
                      fields: Field[],
                      binWidthProperty: TReadOnlyProperty<number>,
                      histogramRepresentationProperty: TReadOnlyProperty<HistogramRepresentation>,
                      blockFillProperty: TReadOnlyProperty<Color>,
                      blockStrokeProperty: TReadOnlyProperty<Color>,
                      zoomLevelProperty: NumberProperty ) {
    super();

    // TODO: Improve this pattern - see https://github.com/phetsims/projectile-data-lab/issues/7
    const maxCounts = [ 500, 200, 100, 50, 20 ];

    this.chartTransform = new ChartTransform( {
      viewWidth: 140,
      viewHeight: 60,
      modelXRange: new Range( 0, 100 ),
      modelYRange: new Range( 0, 10 )
    } );

    const chartBackground = new ChartRectangle( this.chartTransform, {
      fill: 'white',
      stroke: 'black'
    } );

    // Show the frame in front, so it overlaps the bottom of the bars
    const chartFrame = new ChartRectangle( this.chartTransform, {
      fill: null,
      stroke: 'black'
    } );

    const histogramPainter = new HistogramCanvasPainter( this.chartTransform, binWidthProperty, histogramRepresentationProperty,
      blockFillProperty, blockStrokeProperty );

    // Changes based on the zoom level
    const horizontalGridLines = new GridLineSet( this.chartTransform, Orientation.VERTICAL, 5, {
      stroke: 'lightGray',
      lineWidth: 0.8
    } );

    // Changes based on the bin width
    const verticalGridLines = new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, 1, {
      stroke: 'lightGray',
      lineWidth: 0.8
    } );

    this.chartClipLayer = new Node();
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [ histogramPainter ] );
    const chartClip = new Node( {
      clipArea: chartBackground.getShape(),
      children: [

        // Minor grid lines
        horizontalGridLines,
        verticalGridLines,

        this.chartClipLayer,

        // Some data
        chartCanvasNode
      ]
    } );

    this.chartNode = new Node( {
      children: [

        // Background
        chartBackground,

        // Background
        chartFrame,

        // Clipped contents
        chartClip
      ]
    } );

    binWidthProperty.link( binWidth => {
      verticalGridLines.setSpacing( binWidth );
      chartCanvasNode.update();
    } );

    this.chartTransform.changedEmitter.addListener( () => chartCanvasNode.update() );
    histogramRepresentationProperty.link( () => chartCanvasNode.update() );

    const labelText = new PDLText( 'n=' + thumbnailSampleSize );
    this.children = [ this.chartNode, labelText ];
    labelText.leftTop = this.chartNode.leftTop.plusXY( 4, 1 );

    // Recompute and draw the entire histogram from scratch (not incrementally)
    const updateHistogram = () => {

      // Avoid an inconsistent intermediate state while the phet-io state is being set
      if ( !isSettingPhetioStateProperty.value ) {

        // field may have changed. Let's update everything.
        fields.forEach( field => {
          if ( field instanceof SamplingField ) {
            if ( field.sampleSize === thumbnailSampleSize && field.launcher === ( fieldProperty.value as SamplingField ).launcher ) {
              histogramPainter.setHistogramData( field.getHistogramData(), null );
            }
          }
          else {
            assert && assert( false, 'unhandled field type' );
          }
        } );

        chartCanvasNode.update();
      }
    };

    isSettingPhetioStateProperty.addListener( updateHistogram );

    // Similar to code in VSMScreenView that updates the angle tool node and speed tool node when the data changes.
    fields.forEach( field => {

      field.projectilesClearedEmitter.addListener( () => updateHistogram() );

      // For VSM, redraw when the selected projectile changes
      if ( field instanceof VSMField ) {
        field.selectedProjectileProperty.link( () => updateHistogram() );
        field.projectileLandedEmitter.addListener( () => updateHistogram() );
      }
      else if ( field instanceof SamplingField ) {
        field.selectedSampleProperty.link( () => updateHistogram() );
        field.numberOfSamplesWithMeansShowingProperty.link( () => updateHistogram() );
      }
    } );

    Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => {
      updateHistogram();
    } );

    // When the field or bin width changes, redraw the histogram
    fieldProperty.link( () => updateHistogram() );
    binWidthProperty.link( () => updateHistogram() );
    zoomLevelProperty.link( () => {
      const maxCount = maxCounts[ zoomLevelProperty.value ];
      this.chartTransform.setModelYRange( new Range( 0, maxCount ) );
      updateHistogram();
    } );
  }
}

projectileDataLab.register( 'SampleThumbnailNode', SampleThumbnailNode );
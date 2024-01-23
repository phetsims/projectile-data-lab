// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Color, Node } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
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
import SamplingField from '../model/SamplingField.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PDLText from '../../common/view/PDLText.js';
import { ZOOM_LEVELS } from '../../common/view/HistogramNode.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';

/**
 * SampleThumbnailNode shows a smaller, zoomed-in depiction of the histogram. These are shown to the right of the large
 * histogram, and are designed to make it easy to compare the widths of sample means for different n=? sample sizes.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export default class SampleThumbnailNode extends Node {

  protected readonly chartNode: Node;
  protected readonly chartTransform: ChartTransform;
  protected readonly chartClipLayer: Node;

  public constructor( thumbnailSampleSize: number,
                      fieldProperty: TReadOnlyProperty<SamplingField>,
                      fields: SamplingField[],
                      binWidthProperty: TReadOnlyProperty<number>,
                      histogramRepresentationProperty: TReadOnlyProperty<HistogramRepresentation>,
                      blockFillProperty: TReadOnlyProperty<Color>,
                      blockStrokeProperty: TReadOnlyProperty<Color>,
                      zoomLevelProperty: NumberProperty ) {
    super();

    this.chartTransform = new ChartTransform( {
      viewWidth: 160,
      viewHeight: 52,
      modelXRange: new Range( 0, 100 ),
      modelYRange: new Range( 0, 10 )
    } );

    // Horizontally zoom in on the thumbnails, centering on the average output for the mystery launcher
    // Each launcher has a different average output, so we need to adjust the range for the thumbnail histogram based on the mystery launcher
    fieldProperty.link( field => {

      const index = field.launcherProperty.value.launcherNumber;

      const range = index === 1 ? new Range( 55, 70 ) :
                    index === 2 ? new Range( 45, 70 ) :
                    index === 3 ? new Range( 50, 80 ) :
                    index === 4 ? new Range( 55, 75 ) :
                    index === 5 ? new Range( 55, 75 ) :
                    index === 6 ? new Range( 45, 80 ) :
                    Range.EVERYTHING;

      this.chartTransform.setModelXRange( range );
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
    const verticalGridLines = new GridLineSet( this.chartTransform, Orientation.VERTICAL, 10, {
      stroke: 'lightGray',
      lineWidth: 0.8
    } );

    // Changes based on the bin width
    const horizontalGridLines = new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, 1, {
      stroke: 'lightGray',
      lineWidth: 0.8
    } );

    this.chartClipLayer = new Node();
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [ histogramPainter ] );
    const chartClip = new Node( {
      clipArea: chartBackground.getShape(),
      children: [

        // Minor grid lines
        verticalGridLines,
        horizontalGridLines,

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

      // In the thumbnail, show Half as many grid lines as in the main histogram, so multiply the bin width by 2
      horizontalGridLines.setSpacing( binWidth * 2 );
      chartCanvasNode.update();
    } );

    this.chartTransform.changedEmitter.addListener( () => chartCanvasNode.update() );
    histogramRepresentationProperty.link( () => chartCanvasNode.update() );

    const labelText = new PDLText( new PatternStringProperty( ProjectileDataLabStrings.nEqualsSampleSizePatternStringProperty, {
      sampleSize: thumbnailSampleSize
    } ), {
      maxWidth: 80
    } );
    this.children = [ this.chartNode, labelText ];
    labelText.leftTop = this.chartNode.leftTop.plusXY( 4, 1 );

    // Recompute and draw the entire histogram from scratch (not incrementally)
    const updateHistogram = () => {

      // Avoid an inconsistent intermediate state while the phet-io state is being set
      if ( !isSettingPhetioStateProperty.value ) {

        // field may have changed. Let's update everything.
        const histogramData = fields.find( field =>
          field.sampleSize === thumbnailSampleSize &&
          field.launcherProperty.value === fieldProperty.value.launcherProperty.value
        )!.getHistogramData();
        histogramPainter.setHistogramData( histogramData, null );

        chartCanvasNode.update();
      }
    };

    isSettingPhetioStateProperty.addListener( updateHistogram );

    // Similar to code in VSMScreenView that updates the angle tool node and speed tool node when the data changes.
    fields.forEach( field => {

      field.projectilesClearedEmitter.addListener( () => updateHistogram() );
      field.selectedSampleIndexProperty.link( () => updateHistogram() );
      field.numberOfCompletedSamplesProperty.link( () => updateHistogram() );
      field.phaseProperty.link( () => updateHistogram() );
    } );

    Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => {
      updateHistogram();
    } );

    // When the field or bin width changes, redraw the histogram
    fieldProperty.link( () => updateHistogram() );
    binWidthProperty.link( () => updateHistogram() );
    zoomLevelProperty.link( () => {
      const maxCount = ZOOM_LEVELS[ zoomLevelProperty.value ].maxCount;
      this.chartTransform.setModelYRange( new Range( 0, maxCount ) );
      const thumbnailSpacing = ZOOM_LEVELS[ zoomLevelProperty.value ].maxCount / ZOOM_LEVELS[ zoomLevelProperty.value ].numberOfThumbnailGridLines;

      if ( thumbnailSpacing !== null ) {

        // In the thumbnail, show Half as many grid lines as in the main histogram, so multiply the tick spacing by 2
        verticalGridLines.setSpacing( thumbnailSpacing );
      }
      verticalGridLines.visible = thumbnailSpacing !== null;

      updateHistogram();
    } );
  }
}

projectileDataLab.register( 'SampleThumbnailNode', SampleThumbnailNode );
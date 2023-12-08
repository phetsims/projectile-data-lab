// Copyright 2023, University of Colorado Boulder

import { Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import Utils from '../../../../dot/js/Utils.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import bamboo from '../../../../bamboo/js/bamboo.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Field from '../../common/model/Field.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PDLConstants from '../../common/PDLConstants.js';
import HistogramCanvasPainter from './HistogramCanvasPainter.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import SamplingField from '../../sampling/model/SamplingField.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VSMField from '../../common-vsm/model/VSMField.js';
import { HistogramRepresentation } from '../model/HistogramRepresentation.js';

/**
 * Shows the Histogram in the Projectile Data Lab simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type HistogramNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class HistogramNode extends Node {

  public constructor( fieldProperty: TReadOnlyProperty<Field>,
                      fields: Field[],
                      binWidthProperty: TReadOnlyProperty<number>,
                      histogramRepresentationProperty: TReadOnlyProperty<HistogramRepresentation>,
                      options: HistogramNodeOptions ) {
    super();

    // TODO: Improve this pattern - see https://github.com/phetsims/projectile-data-lab/issues/7
    const maxCounts = [ 500, 200, 100, 50, 20 ];
    const maxZoomLevel = maxCounts.length - 1;
    const tickSpacings = [ 50, 20, 10, 10, 5 ];

    const zoomLevelProperty = new NumberProperty( maxZoomLevel, { range: new Range( 0, maxZoomLevel ) } );

    const chartTransform = new ChartTransform( {
      viewWidth: 620,
      viewHeight: 165,
      modelXRange: new Range( 0, PDLConstants.MAX_FIELD_DISTANCE ),
      modelYRange: new Range( 0, 25 )
    } );

    const chartBackground = new ChartRectangle( chartTransform, {
      fill: 'white',
      stroke: 'black'
    } );

    // Show the frame in front, so it overlaps the bottom of the bars
    const chartFrame = new ChartRectangle( chartTransform, {
      fill: null,
      stroke: 'black'
    } );

    const histogramPainter = new HistogramCanvasPainter( chartTransform, binWidthProperty, histogramRepresentationProperty );

    // Changes based on the zoom level
    const horizontalGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, 5, {
      stroke: 'lightGray',
      lineWidth: 0.8
    } );

    // Changes based on the bin width
    const verticalGridLines = new GridLineSet( chartTransform, Orientation.HORIZONTAL, 1, {
      stroke: 'lightGray',
      lineWidth: 0.8
    } );

    const chartCanvasNode = new ChartCanvasNode( chartTransform, [ histogramPainter ] );
    const chartClip = new Node( {
      clipArea: chartBackground.getShape(),
      children: [

        // Minor grid lines
        horizontalGridLines,
        verticalGridLines,

        // Some data
        chartCanvasNode
      ]
    } );

    const verticalTickMarkSet = new TickMarkSet( chartTransform, Orientation.VERTICAL, 5, { edge: 'min', extent: 8 } );
    const verticalTickLabelSet = new TickLabelSet( chartTransform, Orientation.VERTICAL, 5, {
      edge: 'min',
      createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), { fontSize: 12 } )
    } );
    const chartNode = new Node( {
      children: [

        // Background
        chartBackground,

        // Major ticks on the y-axis
        verticalTickMarkSet,
        verticalTickLabelSet,

        new TickMarkSet( chartTransform, Orientation.HORIZONTAL, PDLConstants.FIELD_LABEL_INCREMENT, { edge: 'min', extent: 8 } ),
        new TickLabelSet( chartTransform, Orientation.HORIZONTAL, PDLConstants.FIELD_LABEL_INCREMENT, {
          edge: 'min',
          createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), { fontSize: 12 } )
        } ),

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

    chartTransform.changedEmitter.addListener( () => {
      chartCanvasNode.update();
    } );

    histogramRepresentationProperty.link( () => {
      chartCanvasNode.update();
    } );

    const zoomButtonGroup = new PlusMinusZoomButtonGroup( zoomLevelProperty, {
      tandem: options.tandem.createTandem( 'zoomButtonGroup' ),
      orientation: 'vertical',
      bottom: chartTransform.viewHeight,
      spacing: 5,
      iconOptions: {
        scale: 1.6
      },
      buttonOptions: {
        stroke: 'black',
        lineWidth: 1,
        cornerRadius: 3
      }
    } );

    this.children = [
      zoomButtonGroup,
      chartNode.mutate( { left: zoomButtonGroup.right + 13 } )
    ];
    this.mutate( options );

    // Recompute and draw the entire histogram from scratch (not incrementally)
    const updateHistogram = () => {

      // TODO: When reusing this code for the sampling screen, consider how to handle selectedProjectileProperty, see https://github.com/phetsims/projectile-data-lab/issues/7
      const field = fieldProperty.value;
      if ( field instanceof VSMField ) {
        histogramPainter.setProjectiles( fieldProperty.value.landedProjectiles, field.selectedProjectileProperty.value );
      }
      else if ( field instanceof SamplingField ) {
        const samples = field.getSamples();
        const selectedOne = field.selectedSampleProperty.value;
        histogramPainter.setProjectiles( samples, samples[ selectedOne - 1 ] );
      }
      else {
        assert && assert( false, 'unhandled field type' );
      }
      chartCanvasNode.update();
    };

    // Similar to code in VSMScreenView that updates the angle tool node and speed tool node when the data changes.
    fields.forEach( field => {

      // When one projectile lands or is cleared, update the histogram
      field.projectileLandedEmitter.addListener( () => updateHistogram() );
      field.projectilesClearedEmitter.addListener( () => updateHistogram() );

      // For VSM, redraw when the selected projectile changes
      if ( field instanceof VSMField ) {
        field.selectedProjectileProperty.link( () => updateHistogram() );
      }
      else if ( field instanceof SamplingField ) {
        field.selectedSampleProperty.link( () => updateHistogram() );
        field.numberOfCompletedSamplesProperty.link( () => updateHistogram() );
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

      chartTransform.setModelYRange( new Range( 0, maxCount ) );

      const tickSpacing = tickSpacings[ zoomLevelProperty.value ];
      verticalTickMarkSet.setSpacing( tickSpacing );
      verticalTickLabelSet.setSpacing( tickSpacing );
      // horizontalGridLines.setSpacing( tickSpacing );
      updateHistogram();
    } );
  }
}

bamboo.register( 'HistogramNode', HistogramNode );
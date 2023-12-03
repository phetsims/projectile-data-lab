// Copyright 2023, University of Colorado Boulder

import { Node, NodeOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
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
import HistogramBarPlot from './HistogramBarPlot.js';
import Field from '../../common/model/Field.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PDLConstants from '../../common/PDLConstants.js';

/**
 * Shows the Histogram in the Projectile Data Lab simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type HistogramNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class HistogramNode extends Node {

  public constructor( fieldProperty: TReadOnlyProperty<Field>, fields: Field[], binWidthProperty: TReadOnlyProperty<number>, options: HistogramNodeOptions ) {
    super();

    const chartTransform = new ChartTransform( {
      viewWidth: 520,
      viewHeight: 210,
      modelXRange: new Range( 0, PDLConstants.MAX_FIELD_DISTANCE ),
      modelYRange: new Range( 0, 25 )
    } );

    const chartBackground = new ChartRectangle( chartTransform, {
      fill: 'white',
      stroke: 'black',
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    // Show the frame in front, so it overlaps the bottom of the bars
    const chartFrame = new ChartRectangle( chartTransform, {
      fill: null,
      stroke: 'black',
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    const histogramBarPlot = new HistogramBarPlot( chartTransform, binWidthProperty );

    // Changes based on the bin width
    const binWidthGridLines = new GridLineSet( chartTransform, Orientation.HORIZONTAL, 1, { stroke: 'lightGray' } );

    const chartClip = new Node( {
      clipArea: chartBackground.getShape(),
      children: [

        // Minor grid lines
        new GridLineSet( chartTransform, Orientation.VERTICAL, 5, { stroke: 'lightGray' } ),
        new GridLineSet( chartTransform, Orientation.HORIZONTAL, 10, { stroke: 'lightGray' } ),
        binWidthGridLines,

        // Some data
        histogramBarPlot
      ]
    } );

    const verticalTickMarkSet = new TickMarkSet( chartTransform, Orientation.VERTICAL, 5, { edge: 'min' } );
    const verticalTickLabelSet = new TickLabelSet( chartTransform, Orientation.VERTICAL, 5, {
      edge: 'min',
      createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), { fontSize: 12 } )
    } );
    const chartNode = new Node( {
      children: [

        // Background
        chartBackground,

        // Clipped contents
        chartClip,

        // Major ticks on the y-axis
        verticalTickMarkSet,
        verticalTickLabelSet,

        new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 10, { edge: 'min' } ),
        new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 10, {
          edge: 'min',
          createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), { fontSize: 12 } )
        } ),

        // Background
        chartFrame
      ]
    } );

    binWidthProperty.link( binWidth => {
      binWidthGridLines.setSpacing( binWidth );
      histogramBarPlot.update();
    } );

    const zoomLevelProperty = new NumberProperty( 0, {
      range: new Range( -2, 2 )
    } );
    const zoomButtonGroup = new PlusMinusZoomButtonGroup( zoomLevelProperty, {
      tandem: options.tandem.createTandem( 'zoomButtonGroup' ),
      orientation: 'vertical',
      bottom: chartTransform.viewHeight,
      spacing: 4,
      buttonOptions: {
        stroke: 'black',
        lineWidth: 1,
        cornerRadius: 2
      }
    } );

    this.children = [
      zoomButtonGroup,
      // TODO: No vbox needed, right? or maybe labels, see https://github.com/phetsims/projectile-data-lab/issues/7
      new VBox( {
        align: 'left',
        resize: false,
        spacing: 20,
        children: [ chartNode ],
        left: zoomButtonGroup.right + 5
      } )
    ];
    this.mutate( options );

    // Recompute and draw the entire histogram from scratch (not incrementally)
    const updateHistogram = () => {
      const xValues = fieldProperty.value.projectiles
        .filter( projectile => projectile.phase === 'LANDED' || projectile.phase === 'AIRBORNE_BELOW_FIELD' || projectile.phase === 'LANDED_BELOW_FIELD' )
        .map( projectile => projectile.x );
      const histogramData = createHistogram( xValues, binWidthProperty.value );
      histogramBarPlot.setDataSet( histogramData );
    };

    // Similar to code in VSMScreenView that updates the angle tool node and speed tool node when the data changes.
    fields.forEach( field => {

      // When one projectile lands, update the histogram
      field.projectileLandedEmitter.addListener( () => {
        if ( fieldProperty.value === field ) {

          // TODO: Do we want to add an incremental render, to do the minimal amount of work? https://github.com/phetsims/projectile-data-lab/issues/7
          // How much complexity would that add? How bad is the performance now? Should we be rendering this with canvas anyways?
          updateHistogram();
        }
      } );

      field.projectilesClearedEmitter.addListener( () => updateHistogram() );
    } );

    function createHistogram( xValues: number[], binWidth: number ): Vector2[] {
      const histogram = new Map<number, number>();

      for ( const x of xValues ) {

        // Calculate the bin for this value
        // REVIEW: Is this how you want to calculate the bin?
        const bin = Math.floor( x / binWidth ) * binWidth;

        // Update the count for this bin
        histogram.set( bin, ( histogram.get( bin ) || 0 ) + 1 );
      }

      // Convert the map to an array of Vector2
      const histogramArray: Vector2[] = [];

      for ( const [ bin, count ] of histogram ) {
        histogramArray.push( new Vector2( bin, count ) );
      }

      return histogramArray;
    }

    // When the field or bin width changes, redraw the histogram
    fieldProperty.link( () => updateHistogram() );
    binWidthProperty.link( () => updateHistogram() );
    zoomLevelProperty.link( () => {

      const zoomLevel = zoomLevelProperty.value;

      const scale =
        zoomLevel === -2 ? 4 :
        zoomLevel === -1 ? 2 :
        zoomLevel === 0 ? 1 :
        zoomLevel === 1 ? 1 / 2 :
        zoomLevel === 2 ? 1 / 4 :
        1;

      chartTransform.modelYRange = new Range( 0, 25 * scale );

      chartTransform.changedEmitter.emit();

      verticalTickMarkSet.setSpacing(
        scale === 1 / 4 ? 1 :
        scale === 4 ? 10 :
        5 );
      verticalTickLabelSet.setSpacing( scale === 1 / 4 ? 1 :
                                       scale === 4 ? 10 :
                                       5 );
      updateHistogram();
    } );
  }
}

bamboo.register( 'HistogramNode', HistogramNode );
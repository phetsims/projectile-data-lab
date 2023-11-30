// Copyright 2020-2022, University of Colorado Boulder

import { Node, NodeOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import Utils from '../../../../dot/js/Utils.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import bamboo from '../../../../bamboo/js/bamboo.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import HistogramBarPlot from './HistogramBarPlot.js';

/**
 * Shows the Histogram in the Projectile Data Lab simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type HistogramNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class HistogramNode extends Node {

  public constructor( binWidthProperty: TReadOnlyProperty<number>, options: HistogramNodeOptions ) {
    super();

    // Synthetic data set for testing
    const createDataSet = () => {
      const dataSet = [];
      for ( let x = 0; x < 100; x += binWidthProperty.value ) {
        const y = dotRandom.nextDouble() * x / 4;
        dataSet.push( new Vector2( x, y ) );
      }
      return dataSet;
    };

    const chartTransform = new ChartTransform( {
      viewWidth: 520,
      viewHeight: 210,
      modelXRange: new Range( 0, 100 ),
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

    const chartNode = new Node( {
      children: [

        // Background
        chartBackground,

        // Clipped contents
        chartClip,

        // Major ticks on the y-axis
        new TickMarkSet( chartTransform, Orientation.VERTICAL, 5, { edge: 'min' } ),
        new TickLabelSet( chartTransform, Orientation.VERTICAL, 5, {
          edge: 'min',
          createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), { fontSize: 12 } )
        } ),

        new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 10, { edge: 'min' } ),
        new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 10, {
          edge: 'min',
          createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), { fontSize: 12 } )
        } ),

        // Background
        chartFrame
      ]
    } );

    const randomDataSetButton = new TextPushButton( 'Random Data Set', {
      listener: () => {
        histogramBarPlot.setDataSet( createDataSet() );
      },
      tandem: options.tandem.createTandem( 'randomDataSetButton' )
    } );

    binWidthProperty.link( binWidth => {
      binWidthGridLines.setSpacing( binWidth );
      histogramBarPlot.setDataSet( createDataSet() );
    } );

    this.children = [
      new VBox( {
        align: 'left',
        resize: false,
        spacing: 20,
        children: [ chartNode, randomDataSetButton ]
      } )
    ];
    this.mutate( options );
  }
}

bamboo.register( 'HistogramNode', HistogramNode );
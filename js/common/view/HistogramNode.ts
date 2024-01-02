// Copyright 2023-2024, University of Colorado Boulder

import { ColorProperty, ManualConstraint, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import Utils from '../../../../dot/js/Utils.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
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
import PDLText from './PDLText.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import projectileDataLab from '../../projectileDataLab.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import ABSwitch from '../../../../sun/js/ABSwitch.js';
import HistogramIconNode from './HistogramIconNode.js';
import Property from '../../../../axon/js/Property.js';
import BinControlNode from './BinControlNode.js';

/**
 * Shows the Histogram in the Projectile Data Lab simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type HistogramNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class HistogramNode extends Node {

  protected readonly chartNode: Node;
  protected readonly chartTransform: ChartTransform;
  protected readonly chartClipLayer: Node;
  public readonly zoomLevelProperty: NumberProperty;

  public constructor( fieldProperty: TReadOnlyProperty<Field>,
                      fields: Field[],
                      binWidthProperty: TReadOnlyProperty<number>,
                      histogramRepresentationProperty: Property<HistogramRepresentation>,
                      horizontalAxisLabelText: TReadOnlyProperty<string>,
                      blockFillProperty: ColorProperty,
                      blockStrokeProperty: ColorProperty,
                      selectedBinWidthProperty: Property<number>,
                      selectedTotalBinsProperty: Property<number>,
                      comboBoxParent: Node,
                      options: HistogramNodeOptions ) {
    super();

    // TODO: Improve this pattern - see https://github.com/phetsims/projectile-data-lab/issues/7
    const maxCounts = [ 500, 200, 100, 50, 25 ];
    const maxZoomLevel = maxCounts.length - 1;
    const tickSpacings = [ 50, 20, 10, 10, 5 ];

    this.zoomLevelProperty = new NumberProperty( maxZoomLevel, { range: new Range( 0, maxZoomLevel ) } );

    this.chartTransform = new ChartTransform( {
      viewWidth: 620,
      viewHeight: 165,
      modelXRange: new Range( 0, PDLConstants.MAX_FIELD_DISTANCE ),
      modelYRange: new Range( 0, 25 )
    } );

    const chartBackground = new ChartRectangle( this.chartTransform, {
      fill: 'white',
      stroke: 'black',
      cornerRadius: 5
    } );

    // Show the frame in front, so it overlaps the bottom of the bars
    const chartFrame = new ChartRectangle( this.chartTransform, {
      fill: null,
      stroke: 'black',
      cornerRadius: 5
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

    const verticalTickMarkSet = new TickMarkSet( this.chartTransform, Orientation.VERTICAL, 5, { edge: 'min', extent: 8 } );
    const verticalTickLabelSet = new TickLabelSet( this.chartTransform, Orientation.VERTICAL, 5, {
      edge: 'min',
      createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), { fontSize: 12 } )
    } );
    this.chartNode = new Node( {
      children: [

        // Background
        chartBackground,

        // Background
        chartFrame,

        // Clipped contents
        chartClip,

        // Major ticks on the y-axis
        verticalTickMarkSet,
        verticalTickLabelSet,

        new TickMarkSet( this.chartTransform, Orientation.HORIZONTAL, PDLConstants.FIELD_LABEL_INCREMENT, { edge: 'min', extent: 8 } ),
        new TickLabelSet( this.chartTransform, Orientation.HORIZONTAL, PDLConstants.FIELD_LABEL_INCREMENT, {
          edge: 'min',
          createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), { fontSize: 12 } )
        } )
      ]
    } );

    binWidthProperty.link( binWidth => {
      verticalGridLines.setSpacing( binWidth );
      chartCanvasNode.update();
    } );

    this.chartTransform.changedEmitter.addListener( () => {
      chartCanvasNode.update();
    } );

    histogramRepresentationProperty.link( () => {
      chartCanvasNode.update();
    } );

    const zoomButtonGroup = new PlusMinusZoomButtonGroup( this.zoomLevelProperty, {
      tandem: options.tandem.createTandem( 'zoomButtonGroup' ),
      orientation: 'vertical',
      bottom: this.chartTransform.viewHeight,
      spacing: 5,
      iconOptions: {
        scale: 1.5
      },
      buttonOptions: {
        stroke: 'black',
        lineWidth: 1,
        cornerRadius: 3
      }
    } );

    const verticalAxisLabel = new PDLText( ProjectileDataLabStrings.countStringProperty, {
      rotation: -Math.PI / 2,
      fontSize: 16,
      maxWidth: 86
    } );
    const horizontalAxisLabel = new PDLText( horizontalAxisLabelText, {
      fontSize: 16,
      maxWidth: 100
    } );

    this.children = [
      zoomButtonGroup,

      // Translate the chart node to the right far enough that it won't overlap with the zoom buttons even at the furthest zoomed out level
      this.chartNode.mutate( { left: zoomButtonGroup.right + 14 } ),
      verticalAxisLabel,
      horizontalAxisLabel
    ];
    this.mutate( options );

    ManualConstraint.create( this, [ this.chartNode, verticalAxisLabel, zoomButtonGroup ], ( chartNodeProxy, verticalAxisLabel, zoomButtonGroup ) => {
      verticalAxisLabel.centerX = zoomButtonGroup.centerX;
      verticalAxisLabel.centerY = ( zoomButtonGroup.top + chartNodeProxy.top ) / 2;
    } );

    ManualConstraint.create( this, [ this.chartNode, horizontalAxisLabel ], ( chartNodeProxy, horizontalAxisLabel ) => {
      horizontalAxisLabel.centerX = chartNodeProxy.centerX;
      horizontalAxisLabel.top = chartNodeProxy.bottom;
    } );

    // Recompute and draw the entire histogram from scratch (not incrementally)
    const updateHistogram = () => {

      // Avoid an inconsistent intermediate state while the phet-io state is being set
      if ( !isSettingPhetioStateProperty.value ) {

        const field = fieldProperty.value;
        if ( field instanceof VSMField ) {
          histogramPainter.setHistogramData( fieldProperty.value.landedProjectiles, field.selectedProjectileProperty.value );
        }
        else if ( field instanceof SamplingField ) {
          const samples = field.getHistogramData();
          const selectedOne = field.selectedSampleProperty.value;
          histogramPainter.setHistogramData( samples, samples[ selectedOne - 1 ] );
        }
        else {
          assert && assert( false, 'unhandled field type' );
        }
        chartCanvasNode.update();
      }
    };

    // Incorrect sample is depicted with a dot, see https://github.com/phetsims/projectile-data-lab/issues/17

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

        // Show a different selected brick
        field.selectedSampleProperty.link( () => updateHistogram() );

        // When we get a new mean, redraw the histogram
        field.numberOfSamplesWithMeansShowingProperty.link( () => updateHistogram() );
      }
    } );

    Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => {
      updateHistogram();
    } );

    // When the field or bin width changes, redraw the histogram
    fieldProperty.link( () => updateHistogram() );
    binWidthProperty.link( () => updateHistogram() );
    this.zoomLevelProperty.link( () => {

      const maxCount = maxCounts[ this.zoomLevelProperty.value ];

      this.chartTransform.setModelYRange( new Range( 0, maxCount ) );

      const tickSpacing = tickSpacings[ this.zoomLevelProperty.value ];
      verticalTickMarkSet.setSpacing( tickSpacing );
      verticalTickLabelSet.setSpacing( tickSpacing );
      // horizontalGridLines.setSpacing( tickSpacing );
      updateHistogram();
    } );

    const binControlNode = new BinControlNode( comboBoxParent, selectedBinWidthProperty, selectedTotalBinsProperty, {
      tandem: options.tandem.createTandem( 'binControlNode' ),
      leftTop: this.chartNode.leftBottom.plusXY( 8, 10 )
    } );
    this.addChild( binControlNode );

    const barBlockSwitch = new ABSwitch(
      histogramRepresentationProperty,
      'blocks', new HistogramIconNode( blockFillProperty, blockStrokeProperty, 'blocks' ),
      'bars', new HistogramIconNode( blockFillProperty, blockStrokeProperty, 'bars' ), {
        tandem: options.tandem.createTandem( 'barBlockSwitch' ),
        spacing: 8,
        toggleSwitchOptions: {
          maxWidth: 32
        },
        rightTop: this.chartNode.rightBottom.plusXY( -8, 10 )
      } );
    this.addChild( barBlockSwitch );
  }
}

projectileDataLab.register( 'HistogramNode', HistogramNode );
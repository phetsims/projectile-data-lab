// Copyright 2023-2024, University of Colorado Boulder

import { ColorProperty, ManualConstraint, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import Utils from '../../../../dot/js/Utils.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
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
import HistogramRepresentationIconNode from './HistogramRepresentationIconNode.js';
import Property from '../../../../axon/js/Property.js';
import BinControlNode from './BinControlNode.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';

/**
 * Shows the Histogram in the Projectile Data Lab simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type HistogramNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export const ZOOM_LEVELS = [ {
  maxCount: 500,
  minorSpacing: 10,

  numberOfThumbnailGridLines: 15
}, {
  maxCount: 200,
  minorSpacing: 8,

  numberOfThumbnailGridLines: 13
}, {
  maxCount: 100,
  minorSpacing: 5,

  numberOfThumbnailGridLines: 11
}, {
  maxCount: 75,
  minorSpacing: 5,

  numberOfThumbnailGridLines: 9
}, {
  maxCount: 50,
  minorSpacing: 5,

  numberOfThumbnailGridLines: 7
}, {
  maxCount: 25,
  minorSpacing: null,

  numberOfThumbnailGridLines: 5
} ];

export default class HistogramNode extends Node {

  protected readonly chartNode: Node;
  protected readonly chartTransform: ChartTransform;
  protected readonly chartClipLayer: Node;
  public readonly zoomLevelProperty: NumberProperty;
  protected readonly chartBackground: ChartRectangle;

  public constructor( fieldProperty: TReadOnlyProperty<Field>,
                      fields: Field[],
                      binWidthProperty: TReadOnlyProperty<number>,
                      histogramRepresentationProperty: Property<HistogramRepresentation>,
                      horizontalAxisLabelText: TReadOnlyProperty<string>,
                      selectedBinWidthProperty: Property<number>,
                      selectedTotalBinsProperty: Property<number>,
                      comboBoxParent: Node,
                      blockFillProperty: ColorProperty,
                      blockStrokeProperty: ColorProperty,
                      providedOptions: HistogramNodeOptions ) {
    super();

    const options = optionize<HistogramNodeOptions, SelfOptions, NodeOptions>()( {
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    const maxZoomLevel = ZOOM_LEVELS.length - 1;

    this.zoomLevelProperty = new NumberProperty( maxZoomLevel, { range: new Range( 0, maxZoomLevel ) } );

    this.chartTransform = new ChartTransform( {

      // Tuned to make the spacing between the right panel and the histogram match that of the left
      viewWidth: 561,
      viewHeight: 165,
      modelXRange: new Range( 0, PDLConstants.MAX_FIELD_DISTANCE ),
      modelYRange: new Range( 0, 25 )
    } );

    this.chartBackground = new ChartRectangle( this.chartTransform, {
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

    // Grid lines along the y-axis (the lines themselves are horizontal). Changes based on the zoom level
    const verticalAxisGridLines = new GridLineSet( this.chartTransform, Orientation.VERTICAL, 5, {
      stroke: 'lightGray',
      lineWidth: 0.5
    } );

    const majorVerticalAxisGridLines = new GridLineSet( this.chartTransform, Orientation.VERTICAL, 10, {
      stroke: 'lightGray',
      lineWidth: 1.0
    } );

    // Grid lines along the x-axis (the lines themselves are vertical). Changes based on the bin width
    const horizontalAxisGridLines = new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, 1, {
      stroke: 'lightGray',
      lineWidth: 0.5
    } );
    const majorHorizontalAxisGridLines = new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, 10, {
      stroke: 'lightGray',
      lineWidth: 1.0
    } );

    this.chartClipLayer = new Node();
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [ histogramPainter ] );
    const chartClip = new Node( {
      clipArea: this.chartBackground.getShape(),
      children: [

        // grid lines
        verticalAxisGridLines,
        horizontalAxisGridLines,

        majorVerticalAxisGridLines,
        majorHorizontalAxisGridLines,

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
        this.chartBackground,

        // Clipped contents
        chartClip,

        // Draw the chart frame in front, so it occludes edge grid lines
        chartFrame,

        // Major ticks on the y-axis
        verticalTickLabelSet,

        verticalTickMarkSet,

        new TickMarkSet( this.chartTransform, Orientation.HORIZONTAL, PDLConstants.FIELD_LABEL_INCREMENT, { edge: 'min', extent: 8 } ),
        new TickLabelSet( this.chartTransform, Orientation.HORIZONTAL, PDLConstants.FIELD_LABEL_INCREMENT, {
          edge: 'min',
          createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), { fontSize: 12 } )
        } )
      ]
    } );

    binWidthProperty.link( binWidth => {
      horizontalAxisGridLines.setSpacing( binWidth );
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
      spacing: 0,
      iconOptions: {
        scale: 1.2
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
      verticalAxisLabel.bottom = zoomButtonGroup.top - 17;
    } );

    ManualConstraint.create( this, [ this.chartNode, horizontalAxisLabel, this.chartBackground ], ( chartNodeProxy, horizontalAxisLabelProxy, chartBackgroundProxy ) => {
      horizontalAxisLabelProxy.centerX = chartBackgroundProxy.centerX;
      horizontalAxisLabelProxy.top = chartNodeProxy.bottom;
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
          const selectedSampleNumber = field.selectedSampleNumberProperty.value;
          histogramPainter.setHistogramData( samples, samples[ selectedSampleNumber - 1 ] );
        }
        else {
          assert && assert( false, 'unhandled field type' );
        }
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

        // Show a different selected brick
        field.selectedSampleNumberProperty.link( () => updateHistogram() );

        // When we get a new mean, redraw the histogram
        field.numberOfCompletedSamplesProperty.link( () => updateHistogram() );
        field.phaseProperty.link( () => updateHistogram() );
        field.numberOfStartedSamplesProperty.link( () => updateHistogram() );
        field.sampleMeanProperty.link( () => updateHistogram() );

        field.projectilesChangedEmitter.addListener( () => updateHistogram() );
      }
    } );

    Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => {
      updateHistogram();
    } );

    // When the field or bin width changes, redraw the histogram
    fieldProperty.link( () => updateHistogram() );
    binWidthProperty.link( () => updateHistogram() );
    this.zoomLevelProperty.link( () => {

      const maxCount = ZOOM_LEVELS[ this.zoomLevelProperty.value ].maxCount;

      this.chartTransform.setModelYRange( new Range( 0, maxCount ) );

      const tickSpacing = ZOOM_LEVELS[ this.zoomLevelProperty.value ].maxCount / 5;

      verticalTickLabelSet.setSpacing( tickSpacing );
      verticalTickMarkSet.setSpacing( tickSpacing );
      majorVerticalAxisGridLines.setSpacing( tickSpacing );
      const spacing = ZOOM_LEVELS[ this.zoomLevelProperty.value ].minorSpacing;
      if ( spacing !== null ) {
        verticalAxisGridLines.setSpacing( spacing );
      }
      verticalAxisGridLines.visible = spacing !== null;

      updateHistogram();
    } );

    const binControlNode = new BinControlNode( comboBoxParent, selectedBinWidthProperty, selectedTotalBinsProperty, {
      tandem: options.tandem.createTandem( 'binControlNode' ),
      leftTop: this.chartNode.leftBottom.plusXY( 8, 10 )
    } );
    this.addChild( binControlNode );

    const barBlockSwitch = new ABSwitch(
      histogramRepresentationProperty,
      'blocks', new HistogramRepresentationIconNode( blockFillProperty, blockStrokeProperty, 'blocks' ),
      'bars', new HistogramRepresentationIconNode( blockFillProperty, blockStrokeProperty, 'bars' ), {
        tandem: options.tandem.createTandem( 'barBlockSwitch' ),
        spacing: 8,
        toggleSwitchOptions: {
          maxWidth: 32
        },
        rightTop: this.chartNode.rightBottom.plusXY( -8, 10 )
      } );
    this.addChild( barBlockSwitch );

    this.pdomOrder = [
      zoomButtonGroup,
      binControlNode,
      barBlockSwitch,
      this.chartNode
    ];
  }
}

projectileDataLab.register( 'HistogramNode', HistogramNode );
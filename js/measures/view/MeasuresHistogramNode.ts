// Copyright 2023-2024, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { HistogramNodeOptions } from '../../common/view/HistogramNode.js';
import Field from '../../common/model/Field.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { HistogramRepresentation } from '../../common/model/HistogramRepresentation.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import projectileDataLab from '../../projectileDataLab.js';
import DataMeasuresOverlay from './DataMeasuresOverlay.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { HBox, ManualConstraint, Node, Rectangle, VBox } from '../../../../scenery/js/imports.js';
import IntervalTool from '../model/IntervalTool.js';
import PDLColors from '../../common/PDLColors.js';
import Property from '../../../../axon/js/Property.js';
import VSMHistogramNode from '../../common-vsm/view/VSMHistogramNode.js';
import MeasuresField from '../model/MeasuresField.js';
import PDLText from '../../common/view/PDLText.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { PDLPanel } from '../../common/view/PDLPanel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import PDLConstants from '../../common/PDLConstants.js';

/**
 * The measures histogram node is a histogram node that also shows the mean and standard deviation of the data.
 * It is used in the Measures screen in the Projectile Data Lab simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type MeasuresHistogramNodeOptions = SelfOptions & WithRequired<HistogramNodeOptions, 'tandem'>;

export default class MeasuresHistogramNode extends VSMHistogramNode {

  public constructor( fieldProperty: TReadOnlyProperty<MeasuresField>,
                      fields: Field[],
                      binWidthProperty: TReadOnlyProperty<number>,
                      histogramRepresentationProperty: Property<HistogramRepresentation>,
                      horizontalAxisLabelText: TReadOnlyProperty<string>,
                      isMeanVisibleProperty: BooleanProperty,
                      isStandardDeviationVisibleProperty: BooleanProperty,
                      isValuesVisibleProperty: BooleanProperty,
                      meanProperty: PhetioProperty<number | null>,
                      standardDeviationProperty: PhetioProperty<number | null>,
                      standardErrorProperty: PhetioProperty<number | null>,
                      intervalTool: IntervalTool,
                      intervalToolVisibleProperty: TReadOnlyProperty<boolean>,
                      selectedBinWidthProperty: Property<number>,
                      selectedTotalBinsProperty: Property<number>,
                      comboBoxParent: Node,
                      options: MeasuresHistogramNodeOptions ) {
    super(
      fieldProperty,
      fields,
      binWidthProperty,
      histogramRepresentationProperty,
      horizontalAxisLabelText,
      selectedBinWidthProperty,
      selectedTotalBinsProperty,
      comboBoxParent,
      options );

    const noDataLabel = new PDLText( ProjectileDataLabStrings.noDataStringProperty, {} );

    const roundedStringProperty = ( nullableNumberProperty: PhetioProperty<number | null> ) =>
      new DerivedProperty( [ nullableNumberProperty ], nullableNumber => {
        return nullableNumber === null ? '' : Utils.toFixed( nullableNumber, 2 );
      } );

    const dataLabels = [
      new PDLText( new PatternStringProperty( ProjectileDataLabStrings.meanEqualsValueMPatternStringProperty,
        { value: roundedStringProperty( meanProperty ) } ), {
        font: PDLConstants.HISTOGRAM_PANEL_FONT
      } ),
      new PDLText( new PatternStringProperty( ProjectileDataLabStrings.standardDeviationEqualsValueMPatternStringProperty,
        { value: roundedStringProperty( standardDeviationProperty ) } ), {
        font: PDLConstants.HISTOGRAM_PANEL_FONT
      } ),
      new PDLText( new PatternStringProperty( ProjectileDataLabStrings.standardErrorEqualsValueMPatternStringProperty,
        { value: roundedStringProperty( standardErrorProperty ) } ), {
        font: PDLConstants.HISTOGRAM_PANEL_FONT
      } )
    ];

    const textVBox = new VBox( {

      // Prevent from overlapping with the majority of the data in ?stringTest=long
      maxWidth: 250,
      align: 'left',

      // Children are specified in a link() below
      children: []
    } );

    const textPanel = new PDLPanel( new HBox( {
      spacing: 5,
      children: [ textVBox ]
    } ), {
      visibleProperty: isValuesVisibleProperty,
      fill: 'white',
      cornerRadius: 0
    } );
    this.chartNode.addChild( textPanel );

    const dataMeasuresChartOverlay = new DataMeasuresOverlay(
      this.chartTransform,
      meanProperty,
      standardDeviationProperty,
      isMeanVisibleProperty,
      isStandardDeviationVisibleProperty,

      // The numbers on the data measures overlay are not shown in the histogram
      new BooleanProperty( false ),
      this.chartTransform.viewHeight, {
        context: 'histogram',
        tandem: options.tandem.createTandem( 'dataMeasuresChartOverlay' )
      } );

    this.chartNode.addChild( dataMeasuresChartOverlay );

    const intervalToolHighlight = new Rectangle( 0, 0, 0, 0, {
      fill: PDLColors.histogramIntervalToolFillColorProperty,
      visibleProperty: intervalToolVisibleProperty
    } );
    this.chartClipLayer.addChild( intervalToolHighlight );
    intervalToolHighlight.moveToBack();
    const updateIntervalToolHighlight = () => {
      const x1 = this.chartTransform.modelToViewX( intervalTool.edge1 );
      const x2 = this.chartTransform.modelToViewX( intervalTool.edge2 );
      const min = Math.min( x1, x2 );
      const max = Math.max( x1, x2 );
      intervalToolHighlight.setRect( min, 0, max - min, this.chartTransform.viewHeight );
    };
    updateIntervalToolHighlight();
    intervalTool.changedEmitter.addListener( updateIntervalToolHighlight );

    meanProperty.link( mean => {
      textVBox.setChildren( mean === null ? [ noDataLabel ] : dataLabels );
    } );

    ManualConstraint.create( this, [ textPanel, this.chartBackground ], ( textPanelProxy, chartBackgroundProxy ) => {
      textPanelProxy.left = chartBackgroundProxy.left + PDLConstants.HISTOGRAM_PANEL_MARGIN;
      textPanelProxy.top = chartBackgroundProxy.top + PDLConstants.HISTOGRAM_PANEL_MARGIN;
    } );
  }
}

projectileDataLab.register( 'MeasuresHistogramNode', MeasuresHistogramNode );
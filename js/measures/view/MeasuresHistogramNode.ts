// Copyright 2023-2024, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import HistogramNode, { HistogramNodeOptions } from '../../common/view/HistogramNode.js';
import Field from '../../common/model/Field.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { HistogramRepresentation } from '../../common/model/HistogramRepresentation.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import projectileDataLab from '../../projectileDataLab.js';
import DataMeasuresOverlay from './DataMeasuresOverlay.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { Node, Rectangle } from '../../../../scenery/js/imports.js';
import IntervalTool from '../model/IntervalTool.js';
import PDLColors from '../../common/PDLColors.js';
import Property from '../../../../axon/js/Property.js';

/**
 * The measures histogram node is a histogram node that also shows the mean and standard deviation of the data.
 * It is used in the Measures screen in the Projectile Data Lab simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type MeasuresHistogramNodeOptions = SelfOptions & WithRequired<HistogramNodeOptions, 'tandem'>;

export default class MeasuresHistogramNode extends HistogramNode {

  public constructor( fieldProperty: TReadOnlyProperty<Field>,
                      fields: Field[],
                      binWidthProperty: TReadOnlyProperty<number>,
                      histogramRepresentationProperty: Property<HistogramRepresentation>,
                      horizontalAxisLabelText: TReadOnlyProperty<string>,
                      isDataMeasuresVisibleProperty: BooleanProperty,
                      meanProperty: PhetioProperty<number | null>,
                      standardDeviationProperty: PhetioProperty<number | null>,
                      intervalTool: IntervalTool,
                      intervalToolVisibleProperty: TReadOnlyProperty<boolean>,
                      selectedBinWidthProperty: Property<number>,
                      selectedTotalBinsProperty: Property<number>,
                      comboBoxParent: Node,
                      options: MeasuresHistogramNodeOptions ) {
    super( fieldProperty, fields, binWidthProperty, histogramRepresentationProperty, horizontalAxisLabelText,
      PDLColors.histogramDataFillColorProperty, PDLColors.histogramDataStrokeColorProperty, selectedBinWidthProperty, selectedTotalBinsProperty, comboBoxParent,
      options );

    const dataMeasuresChartOverlay = new DataMeasuresOverlay( this.chartTransform, meanProperty, standardDeviationProperty,
      this.chartTransform.viewHeight, isDataMeasuresVisibleProperty, {
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
  }
}

projectileDataLab.register( 'MeasuresHistogramNode', MeasuresHistogramNode );
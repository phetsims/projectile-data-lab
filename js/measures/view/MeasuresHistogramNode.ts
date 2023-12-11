// Copyright 2023, University of Colorado Boulder

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
                      histogramRepresentationProperty: TReadOnlyProperty<HistogramRepresentation>,
                      horizontalAxisLabelText: TReadOnlyProperty<string>,
                      isDataMeasuresVisibleProperty: BooleanProperty,
                      meanProperty: PhetioProperty<number | null>,
                      standardDeviationProperty: PhetioProperty<number | null>,
                      options: MeasuresHistogramNodeOptions ) {
    super( fieldProperty, fields, binWidthProperty, histogramRepresentationProperty, horizontalAxisLabelText, options );

    const dataMeasuresChartOverlay = new DataMeasuresOverlay( this.chartTransform, meanProperty, standardDeviationProperty,
      this.chartTransform.viewHeight, isDataMeasuresVisibleProperty, {
        tandem: options.tandem.createTandem( 'dataMeasuresChartOverlay' )
      } );

    this.chartNode.addChild( dataMeasuresChartOverlay );
  }
}

projectileDataLab.register( 'MeasuresHistogramNode', MeasuresHistogramNode );
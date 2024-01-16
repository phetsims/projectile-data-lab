// Copyright 2024, University of Colorado Boulder

import HistogramNode, { HistogramNodeOptions } from '../../common/view/HistogramNode.js';
import projectileDataLab from '../../projectileDataLab.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Field from '../../common/model/Field.js';
import Property from '../../../../axon/js/Property.js';
import { HistogramRepresentation } from '../../common/model/HistogramRepresentation.js';
import { Node } from '../../../../scenery/js/imports.js';
import PDLColors from '../../common/PDLColors.js';
import VSMField from '../model/VSMField.js';

/**
 * The VSMHistogramNode shows the histogram for a VSM field, extending the standard HistogramNode and adding
 * VSM-screen-specific elements.
 *
 * TODO: Eliminate this file and just use new HistogramNode() see https://github.com/phetsims/projectile-data-lab/issues/26
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
export default class VSMHistogramNode extends HistogramNode {
  public constructor( fieldProperty: TReadOnlyProperty<VSMField>,
                      fields: Field[],
                      binWidthProperty: TReadOnlyProperty<number>,
                      histogramRepresentationProperty: Property<HistogramRepresentation>,
                      horizontalAxisLabelText: TReadOnlyProperty<string>,
                      selectedBinWidthProperty: Property<number>,
                      selectedTotalBinsProperty: Property<number>,
                      comboBoxParent: Node,
                      options: HistogramNodeOptions ) {
    super(
      fieldProperty,
      fields,
      binWidthProperty,
      histogramRepresentationProperty,
      horizontalAxisLabelText,
      selectedBinWidthProperty,
      selectedTotalBinsProperty,
      comboBoxParent,
      PDLColors.histogramDataFillColorProperty,
      PDLColors.histogramDataStrokeColorProperty,
      options
    );
  }
}

projectileDataLab.register( 'VSMHistogramNode', VSMHistogramNode );
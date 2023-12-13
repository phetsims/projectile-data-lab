// Copyright 2023, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import PDLAccordionBox, { PDLAccordionBoxOptions } from '../../common/view/PDLAccordionBox.js';
import projectileDataLab from '../../projectileDataLab.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PDLConstants from '../../common/PDLConstants.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import VSMField from '../model/VSMField.js';
import Property from '../../../../axon/js/Property.js';
import { HistogramRepresentation } from '../../common/model/HistogramRepresentation.js';
import HistogramNode from '../../common/view/HistogramNode.js';
import PDLColors from '../../common/PDLColors.js';

/**
 * The VSMAccordionBox is an accordion UI component for the Projectile Data Lab simulation.
 * It contains a histogram as well as associated controls.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;

export type VSMAccordionBoxOptions =
  SelfOptions & WithRequired<PDLAccordionBoxOptions, 'tandem'>;

export default class VSMAccordionBox extends PDLAccordionBox {

  public constructor(
    fieldProperty: TReadOnlyProperty<VSMField>,
    fields: VSMField[],
    selectedBinWidthProperty: Property<number>,
    selectedTotalBinsProperty: Property<number>,
    binWidthProperty: TReadOnlyProperty<number>,
    histogramNode: HistogramNode,
    comboBoxParent: Node,
    histogramRepresentationProperty: Property<HistogramRepresentation>,
    providedOptions: VSMAccordionBoxOptions ) {

    const options = optionize<VSMAccordionBoxOptions, SelfOptions, PDLAccordionBoxOptions>()( {
      titleNode: new Text( ProjectileDataLabStrings.histogramStringProperty, {
        font: PDLConstants.LAUNCH_CONTROL_FONT
      } )
    }, providedOptions );

    super( comboBoxParent, histogramNode, selectedBinWidthProperty, selectedTotalBinsProperty, histogramRepresentationProperty,
      PDLColors.histogramDataFillColorProperty, PDLColors.histogramDataStrokeColorProperty,
      options );
  }
}

projectileDataLab.register( 'VSMAccordionBox', VSMAccordionBox );
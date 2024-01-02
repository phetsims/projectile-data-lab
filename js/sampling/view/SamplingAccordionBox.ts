// Copyright 2023-2024, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import PDLAccordionBox, { PDLAccordionBoxOptions } from '../../common/view/PDLAccordionBox.js';
import projectileDataLab from '../../projectileDataLab.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PDLConstants from '../../common/PDLConstants.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import { HistogramRepresentation } from '../../common/model/HistogramRepresentation.js';
import SamplingField from '../model/SamplingField.js';
import PDLColors from '../../common/PDLColors.js';
import SampleThumbnailNode from './SampleThumbnailNode.js';
import SamplingHistogramNode from './SamplingHistogramNode.js';

/**
 * The SamplingAccordionBox is an accordion UI component for the Projectile Data Lab simulation.
 * It contains a histogram as well as associated controls.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;

export type VSMAccordionBoxOptions =
  SelfOptions & WithRequired<PDLAccordionBoxOptions, 'tandem'>;

export default class SamplingAccordionBox extends PDLAccordionBox {

  public constructor(
    launcherProperty: TReadOnlyProperty<number>,
    sampleSizeProperty: TReadOnlyProperty<number>,
    numberOfSamplesProperty: TReadOnlyProperty<number>,
    fieldProperty: TReadOnlyProperty<SamplingField>,
    fields: SamplingField[],
    selectedBinWidthProperty: Property<number>,
    selectedTotalBinsProperty: Property<number>,
    binWidthProperty: TReadOnlyProperty<number>,
    comboBoxParent: Node,
    histogramRepresentationProperty: Property<HistogramRepresentation>,
    providedOptions: VSMAccordionBoxOptions ) {

    const histogramNode = new SamplingHistogramNode(
      launcherProperty,
      sampleSizeProperty,
      numberOfSamplesProperty,

      fieldProperty, fields, binWidthProperty, histogramRepresentationProperty, ProjectileDataLabStrings.meanDistanceStringProperty,
      PDLColors.meanMarkerFillProperty, PDLColors.meanMarkerStrokeProperty,
      selectedBinWidthProperty,
      selectedTotalBinsProperty,
      comboBoxParent, {
        tandem: providedOptions.tandem.createTandem( 'histogramNode' )
      } );

    const options = optionize<VSMAccordionBoxOptions, SelfOptions, PDLAccordionBoxOptions>()( {
      titleNode: new Text( ProjectileDataLabStrings.histogramStringProperty, {
        font: PDLConstants.LAUNCH_CONTROL_FONT,
        maxWidth: 600
      } ),
      maxWidth: 500
    }, providedOptions );

    const zoomLevelProperty = histogramNode.zoomLevelProperty;

    super( comboBoxParent, new HBox( {
      spacing: 4,
      children: [
        histogramNode,
        new VBox( {
          spacing: 4,
          children: [
            new SampleThumbnailNode( 2, fieldProperty, fields, binWidthProperty, histogramRepresentationProperty,
              PDLColors.meanMarkerFillProperty, PDLColors.meanMarkerStrokeProperty, zoomLevelProperty ),
            new SampleThumbnailNode( 5, fieldProperty, fields, binWidthProperty, histogramRepresentationProperty,
              PDLColors.meanMarkerFillProperty, PDLColors.meanMarkerStrokeProperty, zoomLevelProperty ),
            new SampleThumbnailNode( 15, fieldProperty, fields, binWidthProperty, histogramRepresentationProperty,
              PDLColors.meanMarkerFillProperty, PDLColors.meanMarkerStrokeProperty, zoomLevelProperty ),
            new SampleThumbnailNode( 40, fieldProperty, fields, binWidthProperty, histogramRepresentationProperty,
              PDLColors.meanMarkerFillProperty, PDLColors.meanMarkerStrokeProperty, zoomLevelProperty )
          ]
        } )
      ]
    } ), selectedBinWidthProperty, selectedTotalBinsProperty, options );
  }
}

projectileDataLab.register( 'SamplingAccordionBox', SamplingAccordionBox );
// Copyright 2023-2024, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { HBox, Node, VBox } from '../../../../scenery/js/imports.js';
import PDLAccordionBox, { PDLAccordionBoxOptions } from '../../common/view/PDLAccordionBox.js';
import projectileDataLab from '../../projectileDataLab.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import { HistogramRepresentation } from '../../common/model/HistogramRepresentation.js';
import SamplingField from '../model/SamplingField.js';
import PDLColors from '../../common/PDLColors.js';
import SampleThumbnailNode from './SampleThumbnailNode.js';
import SamplingHistogramNode from './SamplingHistogramNode.js';
import Launcher from '../../common/model/Launcher.js';

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
  public readonly bottomThumbnailNode: SampleThumbnailNode;

  public constructor(
    launcherProperty: TReadOnlyProperty<Launcher>,
    sampleSizeProperty: TReadOnlyProperty<number>,
    numberOfSamplesProperty: TReadOnlyProperty<number>,
    fieldProperty: TReadOnlyProperty<SamplingField>,
    fields: SamplingField[],
    selectedBinWidthProperty: Property<number>,
    selectedTotalBinsProperty: Property<number>,
    binWidthProperty: TReadOnlyProperty<number>,
    comboBoxParent: Node,
    histogramRepresentationProperty: Property<HistogramRepresentation>,
    clearCurrentField: () => void,
    providedOptions: VSMAccordionBoxOptions ) {

    const histogramNode = new SamplingHistogramNode(
      launcherProperty,
      sampleSizeProperty,
      numberOfSamplesProperty,
      fieldProperty,
      fields,
      binWidthProperty,
      histogramRepresentationProperty,
      ProjectileDataLabStrings.meanDistanceStringProperty,
      selectedBinWidthProperty,
      selectedTotalBinsProperty,
      comboBoxParent,
      clearCurrentField, {
        tandem: providedOptions.tandem.createTandem( 'histogramNode' )
      } );

    const zoomLevelProperty = histogramNode.zoomLevelProperty;

    const bottomThumbnailNode = new SampleThumbnailNode( 40, fieldProperty, fields, binWidthProperty, histogramRepresentationProperty,
      PDLColors.meanMarkerFillProperty, PDLColors.meanMarkerStrokeProperty, zoomLevelProperty );
    super( new HBox( {

      // TODO: https://github.com/phetsims/projectile-data-lab/issues/50 Would be nice to top align with the top border of the chart
      spacing: 7,
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
            bottomThumbnailNode
          ]
        } )
      ]
    } ), providedOptions );

    this.bottomThumbnailNode = bottomThumbnailNode;
  }
}

projectileDataLab.register( 'SamplingAccordionBox', SamplingAccordionBox );
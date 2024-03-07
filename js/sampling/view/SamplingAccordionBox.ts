// Copyright 2023-2024, University of Colorado Boulder

/**
 * The SamplingAccordionBox is an accordion UI component for the Projectile Data Lab simulation.
 * It contains a histogram as well as associated controls.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { HBox, Node, VBox } from '../../../../scenery/js/imports.js';
import HistogramAccordionBox, { HistogramAccordionBoxOptions } from '../../common/view/HistogramAccordionBox.js';
import projectileDataLab from '../../projectileDataLab.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import { HistogramRepresentation } from '../../common/model/HistogramRepresentation.js';
import SamplingField from '../model/SamplingField.js';
import PDLColors from '../../common/PDLColors.js';
import SampleSizeThumbnailNode from './SampleSizeThumbnailNode.js';
import SamplingHistogramNode from './SamplingHistogramNode.js';
import Launcher from '../../common/model/Launcher.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Histogram from '../../common/model/Histogram.js';

type SelfOptions = EmptySelfOptions;

export type VSMAccordionBoxOptions =
  SelfOptions & WithRequired<HistogramAccordionBoxOptions, 'tandem'>;

export default class SamplingAccordionBox extends HistogramAccordionBox {

  public constructor(
    histogram: Histogram,
    launcherProperty: TReadOnlyProperty<Launcher>,
    sampleSizeProperty: TReadOnlyProperty<number>,
    numberOfSamplesProperty: TReadOnlyProperty<number>,
    fieldProperty: TReadOnlyProperty<SamplingField>,
    fields: SamplingField[],
    zoomProperty: NumberProperty,
    binWidthProperty: TReadOnlyProperty<number>,
    comboBoxParent: Node,
    histogramRepresentationProperty: Property<HistogramRepresentation>,
    histogramSoundEnabledProperty: TReadOnlyProperty<boolean>,
    providedOptions: VSMAccordionBoxOptions ) {

    const histogramNode = new SamplingHistogramNode(
      launcherProperty,
      sampleSizeProperty,
      numberOfSamplesProperty,
      fieldProperty,
      fields,
      histogram,
      histogramSoundEnabledProperty,
      ProjectileDataLabStrings.meanDistanceStringProperty,
      comboBoxParent, {
        tandem: providedOptions.tandem.createTandem( 'histogramNode' )
      } );

    const thumbnailContainerTandem = providedOptions.tandem.createTandem( 'thumbnailContainer' );

    const thumbnailContainer = new VBox( {

      // Top align with the top border of the chart. This margin compensates for the amount the vertical axis label
      // exceeds the top of the chart
      topMargin: 7,

      spacing: -2,
      tandem: thumbnailContainerTandem,
      visiblePropertyOptions: { phetioFeatured: true },
      children: [
        new SampleSizeThumbnailNode( 2, fieldProperty, fields, binWidthProperty, histogramRepresentationProperty,
          PDLColors.meanMarkerFillProperty, PDLColors.meanMarkerStrokeProperty, zoomProperty, {
            tandem: thumbnailContainerTandem.createTandem( 'sampleSize2ThumbnailNode' ),
            visiblePropertyOptions: { phetioFeatured: true }
          } ),
        new SampleSizeThumbnailNode( 5, fieldProperty, fields, binWidthProperty, histogramRepresentationProperty,
          PDLColors.meanMarkerFillProperty, PDLColors.meanMarkerStrokeProperty, zoomProperty, {
            tandem: thumbnailContainerTandem.createTandem( 'sampleSize5ThumbnailNode' ),
            visiblePropertyOptions: { phetioFeatured: true }
          } ),
        new SampleSizeThumbnailNode( 15, fieldProperty, fields, binWidthProperty, histogramRepresentationProperty,
          PDLColors.meanMarkerFillProperty, PDLColors.meanMarkerStrokeProperty, zoomProperty, {
            tandem: thumbnailContainerTandem.createTandem( 'sampleSize15ThumbnailNode' ),
            visiblePropertyOptions: { phetioFeatured: true }
          } ),
        new SampleSizeThumbnailNode( 40, fieldProperty, fields, binWidthProperty, histogramRepresentationProperty,
          PDLColors.meanMarkerFillProperty, PDLColors.meanMarkerStrokeProperty, zoomProperty, {
            tandem: thumbnailContainerTandem.createTandem( 'sample40ThumbnailNode' ),
            visiblePropertyOptions: { phetioFeatured: true }
          } )
      ]
    } );
    super( new HBox( {
      spacing: 12,
      align: 'top',
      children: [
        histogramNode,
        thumbnailContainer
      ]
    } ), providedOptions );
  }
}

projectileDataLab.register( 'SamplingAccordionBox', SamplingAccordionBox );
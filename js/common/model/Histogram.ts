// Copyright 2024, University of Colorado Boulder

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { HistogramRepresentation, HistogramRepresentationValues } from './HistogramRepresentation.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { BIN_STRATEGY_PROPERTY } from '../PDLQueryParameters.js';
import PDLConstants from '../PDLConstants.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

/**
 * The Histogram class is used to represent the histogram in the Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

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

type SelfOptions = EmptySelfOptions;

type HistogramOptions = SelfOptions;

export default class Histogram {

// Bin width represents the distance between adjacent field lines. It also affects how data is grouped for the histogram.
// The prefix 'selected' means it is the value selected by the user, and may differ from the displayed bin width
// depending on the BIN_STRATEGY_PROPERTY.
  public readonly selectedBinWidthProperty: Property<number>;

// Total bins represents the number of bins in the histogram.
// The prefix 'selected' means it is the value selected by the user, and may differ from the displayed bin width
// depending on the BIN_STRATEGY_PROPERTY.
  public readonly selectedTotalBinsProperty: Property<number>;

// The zoom level of the histogram
  public readonly zoomProperty: NumberProperty;

// Current bin width, selecting from the two strategies: binWidth or totalBins (see above)
  public readonly binWidthProperty: TReadOnlyProperty<number>;

  public readonly representationProperty: Property<HistogramRepresentation>;

  public constructor( tandem: Tandem, providedOptions: HistogramOptions ) {
    this.selectedBinWidthProperty = new Property<number>( 1, {
      validValues: [ 0.5, 1, 2, 5, 10 ],
      tandem: tandem.createTandem( 'selectedBinWidthProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property configures the bin width of the field and histogram. It is used when the bin strategy is "bin width".',
      phetioValueType: NumberIO
    } );

    this.selectedTotalBinsProperty = new Property<number>( 10, {
      validValues: [ 10, 20, 50, 100, 200 ],
      tandem: tandem.createTandem( 'selectedTotalBinsProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property configures the total number of bins in the histogram. It is used when the bin strategy is "total bins".',
      phetioValueType: NumberIO
    } );

    const maxZoomLevel = ZOOM_LEVELS.length - 1;

    this.zoomProperty = new NumberProperty( maxZoomLevel, {
      range: new Range( 0, maxZoomLevel ),
      tandem: tandem.createTandem( 'zoomProperty' ),
      phetioFeatured: true,
      numberType: 'Integer'
    } );

    this.binWidthProperty = new DerivedProperty( [ BIN_STRATEGY_PROPERTY, this.selectedBinWidthProperty, this.selectedTotalBinsProperty ],
      ( binStrategy, selectedBinWidth, totalBins ) => {
        return binStrategy === 'binWidth' ? selectedBinWidth : PDLConstants.MAX_FIELD_DISTANCE / totalBins;
      } );

    this.representationProperty = new StringUnionProperty<HistogramRepresentation>( 'blocks', {
      validValues: HistogramRepresentationValues,
      tandem: tandem.createTandem( 'representationProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property indicates whether the histogram is showing bars (one per bin) or blocks (one per projectile).'
    } );
  }

  public reset(): void {
    this.selectedBinWidthProperty.reset();
    this.selectedTotalBinsProperty.reset();
  }

}

projectileDataLab.register( 'Histogram', Histogram );
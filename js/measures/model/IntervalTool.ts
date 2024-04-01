// Copyright 2023-2024, University of Colorado Boulder

/**
 * IntervalTool is a tool that allows the user to select an interval in the data set. The IntervalTool treats its left and
 * right values atomically rather than independently to prevent things from going out of bounds or errors due to re-entrant
 * problems. Compare to center-and-variability/IntervalToolModel which uses the Property-based approach, which yielded
 * numerous problems and was difficult to maintain.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matt Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PDLConstants from '../../common/PDLConstants.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = EmptySelfOptions;
type IntervalToolOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export const DEFAULT_EDGE_1 = 40;
export const DEFAULT_EDGE_2 = 60;

export default class IntervalTool extends PhetioObject {

  // The fraction of data within the interval tool
  public readonly dataFractionProperty: Property<number>;

  // The x-position of the edges of the interval tool. These are maintained internally for atomicity, but we allow
  // them to be set via the Property interface.
  public readonly edge1Property: Property<number>;
  public readonly edge2Property: Property<number>;

  // This Property can be used to read and write the center of the interval tool. It is necessary for wiring up to the
  // DragListener that translates the entire IntervalTool. This value may go out of the bounds of the field while dragging.
  // This is preferable to updating and maintaining an allowed range that changes based on the width of the tool.
  public readonly centerProperty: Property<number>;

  public constructor( providedOptions: IntervalToolOptions ) {

    const options = optionize<IntervalToolOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioDocumentation: 'The interval tool indicates the percent of data within a selected horizontal range.',
      phetioFeatured: true,
      phetioState: false
    }, providedOptions );

    super( options );

    this.edge1Property = new NumberProperty( DEFAULT_EDGE_1, {
      range: new Range( 0, PDLConstants.MAX_FIELD_DISTANCE ),
      tandem: providedOptions.tandem.createTandem( 'edge1Property' ),
      units: 'm',
      rangePropertyOptions: {
        tandem: Tandem.OPT_OUT
      }
    } );

    this.edge2Property = new NumberProperty( DEFAULT_EDGE_2, {
      range: new Range( 0, PDLConstants.MAX_FIELD_DISTANCE ),
      tandem: providedOptions.tandem.createTandem( 'edge2Property' ),
      units: 'm',
      rangePropertyOptions: {
        tandem: Tandem.OPT_OUT
      }
    } );

    // This one is not PhET-iO instrumented, to avoid bounds and circularity issues. Clients should use edge1Property and edge2Property.
    // This is a transient Property used to get drag events when dragging the center. It just passes through to the
    // edges. The view is centered by averaging the edges.
    // This Property is for input only, for use in the drag listener. Do not try to read the value, instead average the edges.
    // This works because DragListener only sets value and does not read values for this property (do not use _useParentOffset
    // in the node that drags based on this Property.)
    this.centerProperty = new NumberProperty( ( DEFAULT_EDGE_1 + DEFAULT_EDGE_2 ) / 2 );

    this.centerProperty.lazyLink( ( center, oldCenter ) => {

      const delta = center - oldCenter;

      let edge1 = this.edge1Property.value;
      let edge2 = this.edge2Property.value;
      const separation = edge2 - edge1;
      edge1 += delta;
      edge2 += delta;

      const min = 0;
      const max = PDLConstants.MAX_FIELD_DISTANCE;

      if ( edge1 > max ) {
        edge1 = max;
        edge2 = max + separation;
      }

      if ( edge2 > max ) {
        edge2 = max;
        edge1 = max - separation;
      }

      if ( edge1 < min ) {
        edge1 = min;
        edge2 = min + separation;
      }

      if ( edge2 < min ) {
        edge2 = min;
        edge1 = min - separation;
      }

      this.edge1Property.value = edge1;
      this.edge2Property.value = edge2;
    } );

    this.dataFractionProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'dataFractionProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The fraction of data within the interval tool',
      phetioReadOnly: true
    } );
  }

  public reset(): void {
    this.edge1Property.reset();
    this.edge2Property.reset();
    this.centerProperty.reset();
  }
}

projectileDataLab.register( 'IntervalTool', IntervalTool );
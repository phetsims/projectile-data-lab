// Copyright 2023-2024, University of Colorado Boulder

/**
 * IntervalTool is a tool that allows the user to select an interval in the data set. The IntervalTool treats its left and
 * right values atomically rather than independently to prevent things from going out of bounds or errors due to re-entrant
 * problems. Compare to center-and-variability/IntervalToolModel which uses the Property-based approach, which yielded
 * numerous problems and was difficult to maintain.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Utils from '../../../../dot/js/Utils.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

//REVIEW Vague names, constants should be uppercase, group all constants together.
const max = 100;
const min = 0;

type SelfOptions = EmptySelfOptions;
type IntervalToolOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

const DEFAULT_EDGE_1 = 40;
const DEFAULT_EDGE_2 = 60;

export default class IntervalTool extends PhetioObject {

  // Edge 1 and edge 2 are the positions of the left and right edges of the interval tool, in no particular order.
  private _edge1: number;
  private _edge2: number;

  // Emits when the interval tool changes
  public readonly changedEmitter = new Emitter();

  // The fraction of data within the interval tool
  public readonly dataFractionProperty: Property<number>;

  // The x-position of the edges of the interval tool. These are maintained internally for atomicity, but we allow
  // them to be set via the Property interface.
  public readonly edge1XProperty: Property<number>;
  public readonly edge2XProperty: Property<number>;

  // This value may go out of the bounds of the field while dragging. This is preferable to updating and maintaining
  // an allowed range that changes based on the width of the tool.
  public readonly centerXProperty: Property<number>;

  public constructor( providedOptions: IntervalToolOptions ) {

    const options = optionize<IntervalToolOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: IntervalTool.IntervalToolIO,
      phetioDocumentation: 'The interval tool indicates the percent of data within a selected horizontal range. To find ' +
                           'the position of each edge, please query the state of this PhET-iO Element.',
      phetioFeatured: true
    }, providedOptions );

    super( options );
    this._edge1 = DEFAULT_EDGE_1;
    this._edge2 = DEFAULT_EDGE_2;

    // TODO: Can these be PhET-IO instrumented? - see https://github.com/phetsims/projectile-data-lab/issues/208
    this.edge1XProperty = new NumberProperty( this._edge1 );
    this.edge2XProperty = new NumberProperty( this._edge2 );
    this.centerXProperty = new NumberProperty( this.center, { reentrant: true } );

    this.edge1XProperty.link( edge1 => {
      this.edge1 = edge1;
    } );

    this.edge2XProperty.link( edge2X => {
      this.edge2 = edge2X;
    } );

    this.centerXProperty.link( centerX => {
      this.center = centerX;
    } );

    this.dataFractionProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'dataFractionProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The fraction of data within the interval tool',
      phetioReadOnly: true
    } );

    this.changedEmitter = new Emitter();
  }

  public reset(): void {
    this._edge1 = DEFAULT_EDGE_1;
    this._edge2 = DEFAULT_EDGE_2;

    this.notifyChanged();
  }

  public set edge1( value: number ) {
    const clamped = Utils.clamp( value, min, max );
    if ( clamped !== this.edge1 ) {
      this._edge1 = clamped;
      this.notifyChanged();
    }
  }

  public get edge1(): number {
    return this._edge1;
  }

  public set edge2( value: number ) {
    const clamped = Utils.clamp( value, min, max );
    if ( clamped !== this._edge2 ) {
      this._edge2 = clamped;
      this.notifyChanged();
    }
  }

  public get edge2(): number {
    return this._edge2;
  }

  public get center(): number {
    return ( this._edge1 + this._edge2 ) / 2;
  }

  public set center( value: number ) {
    if ( value !== this.center ) {
      const delta = value - this.center;
      const separation = this._edge2 - this._edge1;
      this._edge1 += delta;
      this._edge2 += delta;

      if ( this.edge1 > max ) {
        this._edge1 = max;
        this._edge2 = max + separation;
      }

      if ( this._edge2 > max ) {
        this._edge2 = max;
        this._edge1 = max - separation;
      }

      if ( this.edge1 < min ) {
        this._edge1 = min;
        this._edge2 = min + separation;
      }

      if ( this._edge2 < min ) {
        this._edge2 = min;
        this._edge1 = min - separation;
      }

      this.notifyChanged();
    }
  }

  // When the edges or center of the interval tool change, notify the listeners
  private notifyChanged(): void {

    // Update the downstream Properties which are only used for sonification.
    // Only update the Property values once everything is fully in-sync.
    this.edge1XProperty.value = this._edge1;
    this.edge2XProperty.value = this._edge2;
    this.centerXProperty.value = this.center;

    this.changedEmitter.emit();
  }

  private static IntervalToolIO = new IOType<IntervalTool>( 'IntervalToolIO', {
    valueType: IntervalTool,
    stateSchema: {
      edge1: NumberIO,
      edge2: NumberIO
    },
    applyState: ( intervalTool: IntervalTool, stateObject: IntervalToolStateObject ) => {
      intervalTool.edge1 = stateObject.edge1;
      intervalTool.edge2 = stateObject.edge2;
    }
  } );
}

type IntervalToolStateObject = {
  edge1: number;
  edge2: number;
};
projectileDataLab.register( 'IntervalTool', IntervalTool );
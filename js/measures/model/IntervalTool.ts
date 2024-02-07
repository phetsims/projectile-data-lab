// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Utils from '../../../../dot/js/Utils.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Property from '../../../../axon/js/Property.js';

const max = 100;
const min = 0;

type SelfOptions = EmptySelfOptions;
type IntervalToolOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

const DEFAULT_EDGE_1 = 40;
const DEFAULT_EDGE_2 = 60;

/**
 * IntervalTool is a tool that allows the user to select an interval in the data set.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
export default class IntervalTool extends PhetioObject {

  private _edge1: number;
  private _edge2: number;
  public readonly changedEmitter = new Emitter();
  public readonly dataFractionProperty: Property<number>;

  public constructor( providedOptions: IntervalToolOptions ) {

    const options = optionize<IntervalToolOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: IntervalTool.IntervalToolIO,
      phetioDocumentation: 'The interval tool indicates the percent of data within a selected horizontal range. To find ' +
                           'the location of each edge, please query the state of this PhET-iO Element.',
      phetioFeatured: true
    }, providedOptions );

    super( options );
    this._edge1 = DEFAULT_EDGE_1;
    this._edge2 = DEFAULT_EDGE_2;

    this.dataFractionProperty = new Property<number>( 0, {
      tandem: options.tandem.createTandem( 'dataFractionProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The fraction of data within the interval tool',
      phetioValueType: NumberIO,
      phetioReadOnly: true
    } );

    this.changedEmitter = new Emitter();
  }

  public reset(): void {
    this._edge1 = DEFAULT_EDGE_1;
    this._edge2 = DEFAULT_EDGE_2;

    this.changedEmitter.emit();
  }

  public set edge1( value: number ) {
    const clamped = Utils.clamp( value, min, max );
    if ( clamped !== this.edge1 ) {
      this._edge1 = clamped;
      this.changedEmitter.emit();
    }
  }

  public get edge1(): number {
    return this._edge1;
  }

  public set edge2( value: number ) {
    const clamped = Utils.clamp( value, min, max );
    if ( clamped !== this._edge2 ) {
      this._edge2 = clamped;
      this.changedEmitter.emit();
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

      this.changedEmitter.emit();
    }
  }

  private static IntervalToolIO = new IOType( 'IntervalToolIO', {
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
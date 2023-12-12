// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Utils from '../../../../dot/js/Utils.js';

const max = 100;
const min = 0;

export default class IntervalTool {

  private _edge1: number;
  private _edge2: number;
  public readonly changedEmitter = new Emitter();

  public constructor() {
    this._edge1 = 10;
    this._edge2 = 30;

    this.changedEmitter = new Emitter();
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
}
projectileDataLab.register( 'IntervalTool', IntervalTool );
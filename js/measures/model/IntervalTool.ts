// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Utils from '../../../../dot/js/Utils.js';

const max = 100;
const min = 0;

export default class IntervalTool {


  public edge1: number;
  public edge2: number;
  public readonly changedEmitter = new Emitter();

  public constructor() {
    this.edge1 = 10;
    this.edge2 = 30;

    this.changedEmitter = new Emitter();
  }

  public setEdge1( value: number ): void {
    const clamped = Utils.clamp( value, min, max );
    if ( clamped !== this.edge1 ) {
      this.edge1 = clamped;
      this.changedEmitter.emit();
    }
  }

  public setEdge2( value: number ): void {
    const clamped = Utils.clamp( value, min, max );
    if ( clamped !== this.edge2 ) {
      this.edge2 = clamped;
      this.changedEmitter.emit();
    }
  }

  public get center(): number {
    return ( this.edge1 + this.edge2 ) / 2;
  }

  public set center( value: number ) {
    if ( value !== this.center ) {
      const delta = value - this.center;
      const separation = this.edge2 - this.edge1;
      this.edge1 += delta;
      this.edge2 += delta;

      if ( this.edge1 > max ) {
        this.edge1 = max;
        this.edge2 = max + separation;
      }

      if ( this.edge2 > max ) {
        this.edge2 = max;
        this.edge1 = max - separation;
      }

      if ( this.edge1 < min ) {
        this.edge1 = min;
        this.edge2 = min + separation;
      }

      if ( this.edge2 < min ) {
        this.edge2 = min;
        this.edge1 = min - separation;
      }

      this.changedEmitter.emit();
    }
  }
}
projectileDataLab.register( 'IntervalTool', IntervalTool );
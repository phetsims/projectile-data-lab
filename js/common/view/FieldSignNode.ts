// Copyright 2023-2024, University of Colorado Boulder

import optionize from '../../../../phet-core/js/optionize.js';
import { ManualConstraint, Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLColors from '../PDLColors.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';

/**
 * The FieldSignNode contains the field sign, which displays text about the field number and landed projectiles.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = {
  signPostOffsetX?: number;
};
export type FieldSignNodeOptions = SelfOptions & NodeOptions;

export default class FieldSignNode extends Node {
  public constructor( private readonly textNode: Node, providedOptions: FieldSignNodeOptions ) {
    const options = optionize<FieldSignNodeOptions, SelfOptions, NodeOptions>()( {
      signPostOffsetX: 28
    }, providedOptions );

    super( options );

    textNode.centerX = 0;
    textNode.centerY = 0;

    this.drawSign( options.signPostOffsetX );

    ManualConstraint.create( this, [ textNode ], textNodeProxy => {
      textNodeProxy.centerX = 0;
      textNodeProxy.centerY = 0;
    } );
  }

  private drawSign( signPostOffsetX: number ): void {
    const signMarginX = 10;
    const signMarginY = 6;
    const signOffsetY = 44;
    const signPostWidth = 7;
    const signPostBaseRadiusY = 1;

    const signRect = this.textNode.bounds.dilatedXY( signMarginX, signMarginY );
    const sign = new Rectangle( signRect, {
      fill: PDLColors.fieldSignFillColorProperty,
      stroke: PDLColors.fieldSignStrokeColorProperty,
      lineWidth: 1.5,
      cornerRadius: 4
    } );

    const signPostRect = ( x: number ) => new Rectangle(
      x, -0.5 * signRect.height, signPostWidth, signOffsetY + 0.5 * signRect.height, {
        fill: PDLColors.fieldSignStrokeColorProperty
      } );

    const signPostRectLeft = signPostRect( -signPostOffsetX - 0.5 * signPostWidth );
    const signPostRectRight = signPostRect( signPostOffsetX - 0.5 * signPostWidth );

    const signPostBase = ( x: number ) => new Path( new Shape().ellipse( new Vector2( x, signOffsetY ),
      0.5 * signPostWidth, signPostBaseRadiusY, 0 ), {
      fill: PDLColors.fieldSignStrokeColorProperty
    } );

    const signPostBaseLeft = signPostBase( -signPostOffsetX );
    const signPostBaseRight = signPostBase( signPostOffsetX );

    this.addChild( signPostRectLeft );
    this.addChild( signPostRectRight );
    this.addChild( signPostBaseLeft );
    this.addChild( signPostBaseRight );
    this.addChild( sign );
    this.addChild( this.textNode );
  }
}
projectileDataLab.register( 'FieldSignNode', FieldSignNode );
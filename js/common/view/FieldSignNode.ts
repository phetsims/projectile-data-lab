// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLColors from '../PDLColors.js';

/**
 * The FieldSignNode contains the field sign, which displays text about the field number and landed projectiles.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type FieldSignNodeOptions = SelfOptions & NodeOptions;

export default class FieldSignNode extends Node {
  public constructor( private readonly textNode: Node, providedOptions: FieldSignNodeOptions ) {
    super( providedOptions );

    this.drawSign();
  }

  private drawSign( ): void {
    const signMarginX = 7;
    const signMarginY = 5;
    const signOffsetY = 35;
    const signPostTopExtension = 5;
    const signPostWidth = 6;

    this.textNode.centerX = 0;
    this.textNode.centerY = 0;

    const signRect = this.textNode.bounds.dilatedXY( signMarginX, signMarginY );
    const sign = new Rectangle( signRect, { fill: PDLColors.fieldSignColorProperty, cornerRadius: 1 } );
    const signPost = new Rectangle( -0.5 * signPostWidth, -0.5 * signRect.height - signPostTopExtension,
      signPostWidth, signOffsetY + 0.5 * signRect.height + signPostTopExtension, {
        fill: PDLColors.fieldSignColorProperty.value.darkerColor( 0.9 )
      } );

    this.addChild( signPost );
    this.addChild( sign );
    this.addChild( this.textNode );
  }
}
projectileDataLab.register( 'FieldSignNode', FieldSignNode );
// Copyright 2023-2024, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { ManualConstraint, Node, Path, Rectangle, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLColors from '../PDLColors.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SelectorNode from './SelectorNode.js';

/**
 * The FieldSignNode contains the field sign, which displays text about the field number and landed projectiles.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type FieldSignNodeOptions = SelfOptions & VBoxOptions;

export default class FieldSignNode extends VBox {
  public constructor( private readonly textNode: Node, selectorNode: SelectorNode, providedOptions?: FieldSignNodeOptions ) {

    super( providedOptions );

    const headingContainer = new Path( Shape.rect( 0, 0, 1, 1 ), {
      fill: 'green'
    } );
    textNode.centerX = headingContainer.width / 2;
    textNode.centerY = headingContainer.height / 2;
    headingContainer.addChild( textNode );

    const selectorContainer = new Path( Shape.rect( 0, 0, 1, 1 ), {
      fill: 'white'
    } );

    selectorContainer.addChild( selectorNode );
    selectorContainer.center = headingContainer.center;

    ManualConstraint.create( this, [ selectorContainer, textNode ], selectorContainerProxy => {
      headingContainer.shape = Shape.roundedRectangleWithRadii( 0, 0, selectorContainerProxy.width, textNode.height + 20, {
        bottomLeft: 0,
        bottomRight: 0,
        topRight: 5,
        topLeft: 5
      } );

      textNode.centerX = headingContainer.width / 2;
      textNode.centerY = headingContainer.height / 2;
    } );

    ManualConstraint.create( this, [ selectorNode ], selectorNodeProxy => {
      selectorContainer.shape = Shape.roundedRectangleWithRadii( 0, 0, selectorNodeProxy.width, selectorNodeProxy.height + 20, {
        bottomLeft: 5,
        bottomRight: 5,
        topRight: 0,
        topLeft: 0
      } );

      selectorNode.centerX = selectorContainer.width / 2;
      selectorNode.centerY = selectorContainer.height / 2;
    } );

    this.addChild( headingContainer );
    this.addChild( selectorContainer );

    // this.drawSign( options.signPostOffsetX );
  }

  private drawSign( signPostOffsetX: number ): void {
    const signMarginX = 10;
    const signMarginY = 6;
    const signOffsetY = 44;
    const signPostWidth = 7;
    const signPostBaseRadiusY = 1;

    const signRect = this.bounds.dilatedXY( signMarginX, signMarginY );
    const sign = new Rectangle( signRect, {
      fill: PDLColors.fieldSignFillColorProperty,
      stroke: PDLColors.fieldSignStrokeColorProperty,
      lineWidth: 1.5,
      cornerRadius: 4
    } );

    const signPostRect = ( x: number ) => new Rectangle(
      x, -0.5 * signRect.height, signPostWidth, signOffsetY + 0.5 * signRect.height, {
        fill: '#444444'
      } );

    const signPostRectLeft = signPostRect( -signPostOffsetX - 0.5 * signPostWidth );
    const signPostRectRight = signPostRect( signPostOffsetX - 0.5 * signPostWidth );

    const signPostBase = ( x: number ) => new Path( new Shape().ellipse( new Vector2( x, signOffsetY ),
      0.5 * signPostWidth, signPostBaseRadiusY, 0 ), {
      fill: '#444444'
    } );

    const signPostBaseLeft = signPostBase( -signPostOffsetX );
    const signPostBaseRight = signPostBase( signPostOffsetX );

    const signGraphicsContainer = new Node( {
      children: [ sign, signPostRectLeft, signPostRectRight, signPostBaseLeft, signPostBaseRight ]
    } );

    this.addChild( signGraphicsContainer );
    signGraphicsContainer.moveToBack();
  }
}
projectileDataLab.register( 'FieldSignNode', FieldSignNode );
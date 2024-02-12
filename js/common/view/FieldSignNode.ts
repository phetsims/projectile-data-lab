// Copyright 2023-2024, University of Colorado Boulder

import { Color, HBox, ManualConstraint, Node, Path, Rectangle, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SelectorNode from './SelectorNode.js';
import Field from '../model/Field.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { optionize } from '../../../../phet-core/js/imports.js';

/**
 * The FieldSignNode contains the field sign, which displays text about the field number and landed projectiles.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = {
  getFieldColor: ( fields: Field[], field: Field ) => Color;
};
export type FieldSignNodeOptions = SelfOptions & VBoxOptions;

export default class FieldSignNode extends VBox {
  public constructor( fields: Field[],
                      fieldProperty: TReadOnlyProperty<Field>,
                      private readonly headingText: Node,
                      selectorNode: SelectorNode,
                      providedOptions: FieldSignNodeOptions ) {

    const options = optionize<FieldSignNodeOptions, SelfOptions, VBoxOptions>()( {
      stretch: true
    }, providedOptions );

    super( options );

    const headingContainer = new Path( Shape.rect( 0, 0, 1, 1 ) );
    headingContainer.addChild( headingText );

    fieldProperty.link( field => {
      headingContainer.fill = providedOptions.getFieldColor( fields, field );
    } );

    const selectorContainer = new Path( Shape.rect( 0, 0, 1, 1 ), {
      fill: 'white'
    } );

    selectorContainer.addChild( selectorNode );
    selectorContainer.center = headingContainer.center;

    // The minimum height of the text node
    const MIN_HEADING_AREA_HEIGHT = 29;

    // The vertical margin around the text in the heading container
    const HEADING_MARGIN_Y = 6;

    // The margins around the selector node
    const SIGN_MARGIN_X = 6;
    const SELECTOR_MARGIN_Y = 5;

    ManualConstraint.create( this, [ headingText, selectorNode ], ( headingTextProxy, selectorNodeProxy ) => {

      const signWidth = Math.max( headingTextProxy.width + 2 * SIGN_MARGIN_X, selectorNodeProxy.width + 2 * SIGN_MARGIN_X );
      const headingTextHeight = Math.max( headingTextProxy.height + 2 * HEADING_MARGIN_Y, MIN_HEADING_AREA_HEIGHT );

      headingContainer.shape = Shape.roundedRectangleWithRadii( 0, 0, signWidth, headingTextHeight, {
        bottomLeft: 0,
        bottomRight: 0,
        topRight: 5,
        topLeft: 5
      } );

      selectorContainer.shape = Shape.roundedRectangleWithRadii( 0, 0, signWidth, selectorNodeProxy.height + 2 * SELECTOR_MARGIN_Y, {
        bottomLeft: 5,
        bottomRight: 5,
        topRight: 0,
        topLeft: 0
      } );

      headingText.centerX = headingContainer.width / 2;
      headingText.centerY = headingContainer.height / 2;

      selectorNode.centerX = selectorContainer.width / 2;
      selectorNode.centerY = selectorContainer.height / 2;
    } );

    const createSignPost = () => {
      const signPostWidth = 5;
      const signPostRectHeight = 16;
      const signPostEllipseHeight = 3;

      const signPostRect = new Rectangle( 0, -0, signPostWidth, signPostRectHeight, {
        fill: '#6d7c54'
      } );

      const signPostBase = new Path( new Shape().ellipse( new Vector2( 0.5 * signPostWidth, signPostRectHeight ),
        0.5 * signPostWidth, 0.5 * signPostEllipseHeight, 0 ), {
        fill: '#6d7c54'
      } );

      return new Node( {
        children: [ signPostRect, signPostBase ]
      } );
    };

    const leftPost = createSignPost();
    const rightPost = createSignPost();

    const signPostContainer = new HBox( {
      xMargin: 20,
      children: [ leftPost, rightPost ]
    } );

    this.addChild( headingContainer );
    this.addChild( selectorContainer );
    this.addChild( signPostContainer );
  }
}
projectileDataLab.register( 'FieldSignNode', FieldSignNode );
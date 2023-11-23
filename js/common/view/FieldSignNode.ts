// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import Property from '../../../../axon/js/Property.js';
import Field from '../model/Field.js';
import PDLText from './PDLText.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
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
  public constructor( fieldProperty: Property<Field>, providedOptions: FieldSignNodeOptions ) {
    super( providedOptions );

    fieldProperty.link( field => {
      const fieldNumber = field.fieldNumber;
      this.drawSignForFieldNumber( fieldNumber );
    } );
  }

  private drawSignForFieldNumber( fieldNumber: number ): void {
    this.removeAllChildren();

    const signMarginX = 7;
    const signMarginY = 5;
    const signOffsetY = 35;
    const signPostTopExtension = 5;
    const signPostWidth = 6;

    const fieldNumberString = ProjectileDataLabStrings.fieldStringProperty.value + ' ' + fieldNumber.toString();
    const fieldNumberText = new PDLText( fieldNumberString, { centerX: 0, centerY: 0 } );

    const signRect = fieldNumberText.bounds.dilatedXY( signMarginX, signMarginY );
    const sign = new Rectangle( signRect, { fill: PDLColors.fieldSignColorProperty, cornerRadius: 1 } );
    const signPost = new Rectangle( -0.5 * signPostWidth, -0.5 * signRect.height - signPostTopExtension,
      signPostWidth, signOffsetY + 0.5 * signRect.height + signPostTopExtension, {
        fill: PDLColors.fieldSignColorProperty.value.darkerColor( 0.9 )
      } );

    this.addChild( signPost );
    this.addChild( sign );
    this.addChild( fieldNumberText );
  }
}
projectileDataLab.register( 'FieldSignNode', FieldSignNode );
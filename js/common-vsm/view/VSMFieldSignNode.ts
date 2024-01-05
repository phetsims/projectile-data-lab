// Copyright 2023, University of Colorado Boulder

/**
 * The VSMFieldSignNode shows the field number and the number of projectiles that have landed in that field.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import FieldSignNode, { FieldSignNodeOptions } from '../../common/view/FieldSignNode.js';
import projectileDataLab from '../../projectileDataLab.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import PDLConstants from '../../common/PDLConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Field from '../../common/model/Field.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLColors from '../../common/PDLColors.js';
import Panel from '../../../../sun/js/Panel.js';

type SelfOptions = EmptySelfOptions;
type VSMFieldSignNodeOptions = SelfOptions & FieldSignNodeOptions;

export default class VSMFieldSignNode extends FieldSignNode {
  public constructor( fieldProperty: TReadOnlyProperty<Field>,
                      landedProjectileCountProperty: TReadOnlyProperty<number>,
                      fields: Field[],
                      modelViewTransform: ModelViewTransform2,
                      providedOptions?: VSMFieldSignNodeOptions ) {

    // Create the field sign
    const fieldSignPosition = modelViewTransform.modelToViewPosition( new Vector2( PDLConstants.FIELD_SIGN_X, 0 ) );

    const options = optionize<VSMFieldSignNodeOptions, SelfOptions, FieldSignNodeOptions>()( {
      x: fieldSignPosition.x, y: PDLConstants.FIELD_SIGN_CENTER_Y
    }, providedOptions );

    const fieldSignStringProperty = new PatternStringProperty( ProjectileDataLabStrings.fieldValuePatternStringProperty, {
      value: new DerivedProperty( [ fieldProperty ], field => {
        return fields.indexOf( field ) + 1;
      } )
    } );

    const patternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.nEqualsProjectileCountPatternStringProperty, {
      projectileCount: landedProjectileCountProperty
    } );

    const fieldNumberText = new Text( fieldSignStringProperty, {
      fill: PDLColors.fieldSignTextColorProperty,
      font: PDLConstants.FIELD_SIGN_FONT
    } );

    const projectileCountText = new Text( patternStringProperty, {
      fill: PDLColors.fieldSignTextColorProperty,
      font: PDLConstants.FIELD_SIGN_COUNT_FONT
    } );

    const projectileCount = new Panel( projectileCountText, {
      minWidth: 65,
      align: 'center',
      xMargin: 4,
      yMargin: 2,
      fill: PDLColors.fieldSignStrokeColorProperty.value.darkerColor( 0.8 ),
      stroke: null,
      cornerRadius: 3
    } );

    const fieldSignTextNodes = [ fieldNumberText, projectileCount ];

    const fieldSignTextContainer = new VBox( {
      children: [ ...fieldSignTextNodes ],
      align: 'center',
      spacing: 4,
      maxWidth: 80
    } );

    super( fieldSignTextContainer, options );
  }
}

projectileDataLab.register( 'VSMFieldSignNode', VSMFieldSignNode );
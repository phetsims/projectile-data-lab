// Copyright 2023-2024, University of Colorado Boulder

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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Field from '../../common/model/Field.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLColors from '../../common/PDLColors.js';
import ProjectileSelectorNode from './ProjectileSelectorNode.js';
import { optionize } from '../../../../phet-core/js/imports.js';

type SelfOptions = EmptySelfOptions;
type VSMFieldSignNodeOptions = SelfOptions & FieldSignNodeOptions;

export default class VSMFieldSignNode extends FieldSignNode {
  public constructor( fields: Field[],
                      fieldProperty: TReadOnlyProperty<Field>,
                      projectileSelectorNode: ProjectileSelectorNode,
                      providedOptions?: VSMFieldSignNodeOptions ) {

    const options = optionize<VSMFieldSignNodeOptions, SelfOptions, FieldSignNodeOptions>()( {}, providedOptions );

    const fieldSignStringProperty = new PatternStringProperty( ProjectileDataLabStrings.fieldValuePatternStringProperty, {
      value: new DerivedProperty( [ fieldProperty ], field => {
        return fields.indexOf( field ) + 1;
      } )
    } );

    const fieldNumberText = new Text( fieldSignStringProperty, {
      fill: PDLColors.fieldSignTextColorProperty,
      font: PDLConstants.VSM_FIELD_SIGN_FONT
    } );

    const fieldSignHeadingContainer = new VBox( {
      children: [ fieldNumberText ],
      align: 'center',
      maxWidth: 100
    } );

    super( fieldProperty, fieldSignHeadingContainer, projectileSelectorNode, 34, options );
  }
}

projectileDataLab.register( 'VSMFieldSignNode', VSMFieldSignNode );
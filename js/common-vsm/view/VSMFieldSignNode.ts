// Copyright 2023, University of Colorado Boulder

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
import NumberProperty from '../../../../axon/js/NumberProperty.js';

type SelfOptions = EmptySelfOptions;
type VSMFieldSignNodeOptions = SelfOptions & FieldSignNodeOptions;

export default class VSMFieldSignNode extends FieldSignNode {
  public constructor( fieldProperty: TReadOnlyProperty<Field>,
                      fields: Field[],
                      modelViewTransform: ModelViewTransform2,
                      providedOptions?: VSMFieldSignNodeOptions ) {

    // REVIEW: Should projectileCountProperty move to the model?

    // A projectile is counted if it is landed or if it goes below y=0 meters (beyond the 100m mark horizontally)
    const projectileCountProperty = new NumberProperty( 0 );
    const updateProjectileCountProperty = () => {
      const projectiles = fieldProperty.value.projectiles.filter(
        projectile => projectile.phase === 'LANDED' ||
                      projectile.phase === 'AIRBORNE_BELOW_FIELD'
      );
      projectileCountProperty.value = projectiles.length;
    };

    // Listen to each of the fields for changes to their projectiles
    fields.forEach( field => {
      field.projectileLandedEmitter.addListener( updateProjectileCountProperty );
      field.projectilesClearedEmitter.addListener( updateProjectileCountProperty );
    } );

    fieldProperty.link( updateProjectileCountProperty );

    // Create the field sign
    const fieldSignPosition = modelViewTransform.modelToViewPosition( new Vector2( 95, 0 ) );

    const options = optionize<VSMFieldSignNodeOptions, SelfOptions, FieldSignNodeOptions>()( {
      x: fieldSignPosition.x, y: PDLConstants.FIELD_SIGN_CENTER_Y
    }, providedOptions );

    const fieldSignStringProperty = new PatternStringProperty( ProjectileDataLabStrings.fieldValuePatternStringProperty, {
      value: new DerivedProperty( [ fieldProperty ], field => {
        return fields.indexOf( field ) + 1;
      } )
    } );

    const patternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.nEqualsProjectileCountPatternStringProperty, {
      projectileCount: projectileCountProperty
    } );

    const fieldNumberText = new Text( fieldSignStringProperty, { font: PDLConstants.PRIMARY_FONT } );
    const projectileCountText = new Text( patternStringProperty, { font: PDLConstants.PRIMARY_FONT } );

    const fieldSignTextNodes = [ fieldNumberText, projectileCountText ];

    const fieldSignTextContainer = new VBox( {
      children: [ ...fieldSignTextNodes ],
      align: 'center',
      maxWidth: modelViewTransform.modelToViewDeltaX( 6 )
    } );

    super( fieldSignTextContainer, options );
  }
}

projectileDataLab.register( 'VSMFieldSignNode', VSMFieldSignNode );
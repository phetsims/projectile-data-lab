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
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SamplingField from '../model/SamplingField.js';

type SelfOptions = EmptySelfOptions;
type VSMFieldSignNodeOptions = SelfOptions & FieldSignNodeOptions;

export default class SamplingFieldSignNode extends FieldSignNode {
  public constructor( fieldProperty: TReadOnlyProperty<SamplingField>,
                      modelViewTransform: ModelViewTransform2,
                      selectedSampleProperty: TReadOnlyProperty<number>,
                      sampleCountProperty: TReadOnlyProperty<number>,
                      providedOptions?: VSMFieldSignNodeOptions ) {

    const fieldSignPosition = modelViewTransform.modelToViewPosition( new Vector2( 95, 0 ) );

    const options = optionize<VSMFieldSignNodeOptions, SelfOptions, FieldSignNodeOptions>()( {
      x: fieldSignPosition.x, y: PDLConstants.FIELD_SIGN_CENTER_Y
    }, providedOptions );

    const fieldSignStringProperty = new PatternStringProperty( ProjectileDataLabStrings.launcherNumberPatternStringProperty, {
      number: new DerivedProperty( [ fieldProperty ], field => field.launcher )
    } );

    const sampleSizeStringProperty = new PatternStringProperty( ProjectileDataLabStrings.sampleSizeValuePatternStringProperty, {
      value: new DerivedProperty( [ fieldProperty ], field => field.sampleSize )
    } );

    const patternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.sampleNofMPatternStringProperty, {

      // TODO: unify naming for these across strings/variables, see https://github.com/phetsims/projectile-data-lab/issues/7
      selected: selectedSampleProperty,
      count: sampleCountProperty
    } );

    const fieldSignTextContainer = new VBox( {
      align: 'left',
      children: [
        new Text( fieldSignStringProperty, { font: PDLConstants.PRIMARY_FONT } ),
        new Text( sampleSizeStringProperty, { font: PDLConstants.PRIMARY_FONT } ),
        new Text( patternStringProperty, { font: PDLConstants.PRIMARY_FONT } )
      ],
      maxWidth: modelViewTransform.modelToViewDeltaX( 6 )
    } );

    super( fieldSignTextContainer, options );
  }
}

projectileDataLab.register( 'SamplingFieldSignNode', SamplingFieldSignNode );
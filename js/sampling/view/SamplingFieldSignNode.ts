// Copyright 2023-2024, University of Colorado Boulder

import FieldSignNode, { FieldSignNodeOptions } from '../../common/view/FieldSignNode.js';
import projectileDataLab from '../../projectileDataLab.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import PDLConstants from '../../common/PDLConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLColors from '../../common/PDLColors.js';
import { MysteryLauncherIcon } from '../../common/view/MysteryLauncherIcon.js';
import Launcher from '../../common/model/Launcher.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = EmptySelfOptions;
type SamplingFieldSignNodeOptions = SelfOptions & FieldSignNodeOptions;

/**
 * The SamplingFieldSignNode shows the launcher number and the number of projectiles that have landed in that field.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
export default class SamplingFieldSignNode extends FieldSignNode {
  public constructor( launcherProperty: TReadOnlyProperty<Launcher>,
                      sampleSizeProperty: TReadOnlyProperty<number>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions?: SamplingFieldSignNodeOptions ) {

    // Create the field sign
    const fieldSignPosition = modelViewTransform.modelToViewPosition( new Vector2( PDLConstants.SAMPLING_FIELD_SIGN_X, 0 ) );

    const options = optionize<SamplingFieldSignNodeOptions, SelfOptions, FieldSignNodeOptions>()( {
      x: fieldSignPosition.x, y: PDLConstants.FIELD_SIGN_CENTER_Y, signPostOffsetX: 75
    }, providedOptions );

    const launcherNumberProperty = new DerivedProperty( [ launcherProperty ], launcher => launcher.launcherNumber );
    const launcherNumberStringProperty = new PatternStringProperty( ProjectileDataLabStrings.launcherNumberPatternStringProperty, {
      number: launcherNumberProperty
    } );

    const sampleSizeStringProperty = new PatternStringProperty( ProjectileDataLabStrings.sampleSizePatternStringProperty, {
      sampleSize: sampleSizeProperty
    } );

    const launcherNumberText = new Text( launcherNumberStringProperty, {
      fill: PDLColors.fieldSignTextColorProperty,
      font: PDLConstants.FIELD_SIGN_FONT
    } );

    const sampleSizeText = new Text( sampleSizeStringProperty, {
      fill: PDLColors.fieldSignTextColorProperty,
      font: PDLConstants.FIELD_SIGN_FONT
    } );

    const fieldSignTextNodes = [ launcherNumberText, sampleSizeText ];

    const fieldSignTextContainer = new VBox( {
      children: [ ...fieldSignTextNodes ],
      align: 'center',
      spacing: 3,
      maxWidth: 140,
      yMargin: 2
    } );

    const launcherIconNode = new Node();
    launcherProperty.link( launcherNumber => {
      launcherIconNode.children = [ new MysteryLauncherIcon( launcherNumber ) ];
    } );

    const fieldSignContents = new HBox( {
      spacing: 7,
      children: [
        launcherIconNode,
        fieldSignTextContainer
      ]
    } );

    super( fieldSignContents, options );
  }
}

projectileDataLab.register( 'SamplingFieldSignNode', SamplingFieldSignNode );
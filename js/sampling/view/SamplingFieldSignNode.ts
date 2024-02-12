// Copyright 2023-2024, University of Colorado Boulder

import FieldSignNode, { FieldSignNodeOptions } from '../../common/view/FieldSignNode.js';
import projectileDataLab from '../../projectileDataLab.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import PDLConstants from '../../common/PDLConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLColors from '../../common/PDLColors.js';
import Launcher from '../../common/model/Launcher.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import SampleSelectorNode from './SampleSelectorNode.js';
import { optionize } from '../../../../phet-core/js/imports.js';
import PDLUtils from '../../common/PDLUtils.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import SamplingField from '../model/SamplingField.js';
import Field from '../../common/model/Field.js';

type SelfOptions = EmptySelfOptions;
type SamplingFieldSignNodeOptions = SelfOptions & StrictOmit<FieldSignNodeOptions, 'getFieldColor'>;

/**
 * The SamplingFieldSignNode shows the launcher number and the number of projectiles that have landed in that field.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
export default class SamplingFieldSignNode extends FieldSignNode {
  public constructor( fields: Field[],
                      fieldProperty: TReadOnlyProperty<Field>,
                      launcherProperty: TReadOnlyProperty<Launcher>,
                      sampleSizeProperty: TReadOnlyProperty<number>,
                      modelViewTransform: ModelViewTransform2,
                      sampleSelectorNode: SampleSelectorNode,
                      providedOptions?: SamplingFieldSignNodeOptions ) {

    const options = optionize<SamplingFieldSignNodeOptions, SelfOptions, FieldSignNodeOptions>()( {
      getFieldColor: ( fields, field ) => {

        // TODO: Is this okay to duplicate? See https://github.com/phetsims/projectile-data-lab/issues/104
        // Colorize based on the sample size
        // This one band-aid type annotation workaround is preferable to adding generic types to a mountain of classes
        const f = field as SamplingField;
        return PDLUtils.colorForSampleSize( f.sampleSize );
      }
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
      font: PDLConstants.SAMPLING_FIELD_SIGN_FONT
    } );

    const sampleSizeText = new Text( sampleSizeStringProperty, {
      fill: PDLColors.fieldSignTextColorProperty,
      font: PDLConstants.SAMPLING_FIELD_SIGN_FONT
    } );

    const fieldSignHeadingContainer = new VBox( {
      children: [ launcherNumberText, sampleSizeText ],
      align: 'center',
      spacing: 3
    } );

    super( fields, fieldProperty, fieldSignHeadingContainer, sampleSelectorNode, options );
  }
}

projectileDataLab.register( 'SamplingFieldSignNode', SamplingFieldSignNode );
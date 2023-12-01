// Copyright 2023, University of Colorado Boulder

/**
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import PDLModel, { PDLModelOptions } from '../../common/model/PDLModel.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Multilink from '../../../../axon/js/Multilink.js';
import SamplingField from './SamplingField.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

type SelfOptions = EmptySelfOptions;

type SamplingModelOptions = SelfOptions & StrictOmit<PDLModelOptions<SamplingField>, 'timeSpeedValues' | 'fields' | 'isPathsVisible'>;

// TODO: These should be properties that can be customized via PhET-IO - see https://github.com/phetsims/projectile-data-lab/issues/7
const SAMPLE_SIZES = [ 2, 5, 15, 40 ];

export default class SamplingModel extends PDLModel<SamplingField> {

  public readonly sampleSizeProperty: Property<number>;

  public readonly numberOfSamplesProperty: DynamicProperty<number, number, SamplingField>;
  public readonly selectedSampleProperty: DynamicProperty<number, number, SamplingField>;
  public readonly numberOfCompletedSamplesProperty: DynamicProperty<number, number, SamplingField>;
  public readonly presetLauncherProperty: NumberProperty;

  public constructor( providedOptions: SamplingModelOptions ) {

    const fields: SamplingField[] = [];
    const NUM_LAUNCHERS = 6;
    for ( let i = 0; i < NUM_LAUNCHERS; i++ ) {
      for ( let j = 0; j < SAMPLE_SIZES.length; j++ ) {
        const fieldNumber = 1 + j + i * SAMPLE_SIZES.length;
        fields.push( new SamplingField( i + 1, SAMPLE_SIZES[ j ], {
          tandem: providedOptions.tandem.createTandem( 'field' + fieldNumber )
        } ) );
      }
    }

    const options = optionize<SamplingModelOptions, SelfOptions, PDLModelOptions<SamplingField>>()( {
      timeSpeedValues: [ TimeSpeed.NORMAL, TimeSpeed.FAST ],
      fields: fields,
      isPathsVisible: true
    }, providedOptions );

    super( options );

    this.sampleSizeProperty = new Property<number>( 2, {
      validValues: SAMPLE_SIZES,
      tandem: options.tandem.createTandem( 'sampleSizeProperty' ),
      phetioDocumentation: 'This property configures the number of projectiles in a sample',
      phetioValueType: NumberIO
    } );

    this.presetLauncherProperty = new NumberProperty( 1 );

    // // TODO: The field is a derived property based on the selected launcher and sample size. https://github.com/phetsims/projectile-data-lab/issues/7
    // // TODO: Fix reentrant error - see https://github.com/phetsims/projectile-data-lab/issues/7
    Multilink.multilink( [ this.sampleSizeProperty, this.presetLauncherProperty ], ( sampleSize, presetLauncher ) => {
      const field = this.fields.find( field => field.sampleSize === sampleSize && field.launcher === presetLauncher )!;
      this.fieldProperty.value = field;
    } );

    this.numberOfSamplesProperty = new DynamicProperty<number, number, SamplingField>( this.fieldProperty, {
      derive: t => t.numberOfSamplesProperty
    } );

    this.selectedSampleProperty = new DynamicProperty<number, number, SamplingField>( this.fieldProperty, {

      // The up/down carousel card changes the selected sample, so this is bidirectional
      bidirectional: true,
      derive: t => t.selectedSampleProperty
    } );

    this.numberOfCompletedSamplesProperty = new DynamicProperty<number, number, SamplingField>( this.fieldProperty, {
      derive: t => t.numberOfCompletedSamplesProperty
    } );
  }

  public step( dt: number ): void {
    this.fieldProperty.value.step( dt, this.isContinuousLaunchingProperty.value );
  }

  /**
   * Resets the model.
   */
  public override reset(): void {
    super.reset();
    this.sampleSizeProperty.reset();
    this.presetLauncherProperty.reset();
  }
}

projectileDataLab.register( 'SamplingModel', SamplingModel );
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

const SAMPLE_SIZES = [ 2, 5, 15, 40 ];

export default class SamplingModel extends PDLModel<SamplingField> {

  public readonly sampleSizeProperty: Property<number>;
  public readonly mysteryLauncherProperty: NumberProperty;

  public readonly numberOfStartedSamplesProperty: DynamicProperty<number, number, SamplingField>;
  public readonly selectedSampleProperty: DynamicProperty<number, number, SamplingField>;
  public readonly numberOfCompletedSamplesProperty: DynamicProperty<number, number, SamplingField>;
  public readonly sampleMeanProperty: DynamicProperty<number | null, number | null, SamplingField>;

  public constructor( providedOptions: SamplingModelOptions ) {

    const fields: SamplingField[] = [];
    const NUM_LAUNCHERS = 6;
    const fieldsTandem = providedOptions.tandem.createTandem( 'fields' );
    for ( let i = 0; i < NUM_LAUNCHERS; i++ ) {
      for ( let j = 0; j < SAMPLE_SIZES.length; j++ ) {
        fields.push( new SamplingField( i + 1, SAMPLE_SIZES[ j ], {
          tandem: fieldsTandem.createTandem( 'launcher' + ( i + 1 ) + 'sampleSize' + SAMPLE_SIZES[ j ] )
        } ) );
      }
    }

    const options = optionize<SamplingModelOptions, SelfOptions, PDLModelOptions<SamplingField>>()( {
      timeSpeedValues: [ TimeSpeed.NORMAL, TimeSpeed.FAST ],
      fields: fields,
      isPathsVisible: true
    }, providedOptions );

    super( true, options );

    this.sampleSizeProperty = new Property<number>( 2, {
      validValues: SAMPLE_SIZES,
      tandem: options.tandem.createTandem( 'sampleSizeProperty' ),
      phetioDocumentation: 'This property configures the number of projectiles in a sample',
      phetioValueType: NumberIO
    } );

    this.mysteryLauncherProperty = new NumberProperty( 1 );

    // TODO: The field is a derived property based on the selected launcher and sample size. https://github.com/phetsims/projectile-data-lab/issues/7
    Multilink.multilink( [ this.sampleSizeProperty, this.mysteryLauncherProperty ], ( sampleSize, mysteryLauncher ) => {
      const field = this.fields.find( field => field.sampleSize === sampleSize && field.launcher === mysteryLauncher )!;
      this.fieldProperty.value = field;
    } );

    this.numberOfStartedSamplesProperty = new DynamicProperty<number, number, SamplingField>( this.fieldProperty, {
      derive: t => t.numberOfStartedSamplesProperty
    } );

    this.selectedSampleProperty = new DynamicProperty<number, number, SamplingField>( this.fieldProperty, {

      // The up/down carousel card changes the selected sample, so this is bidirectional
      bidirectional: true,
      derive: t => t.selectedSampleProperty
    } );

    this.numberOfCompletedSamplesProperty = new DynamicProperty<number, number, SamplingField>( this.fieldProperty, {
      derive: t => t.numberOfCompletedSamplesProperty
    } );

    this.sampleMeanProperty = new DynamicProperty<number | null, number | null, SamplingField>( this.fieldProperty, {
      derive: t => t.sampleMeanProperty
    } );

    // When the launch mode changes, update the timing between projectiles within a sample.
    this.launchModeProperty.link( launchMode => {
      this.fields.forEach( field => field.setLaunchMode( launchMode ) );
    } );
  }

  public override launchButtonPressed(): void {
    if ( this.launchModeProperty.value === 'single' ) {
      this.fieldProperty.value.startNewSample();
    }
    else {
      if ( !this.isContinuousLaunchingProperty.value ) {
        this.fieldProperty.value.startNewSample();
      }
      this.fieldProperty.value.isContinuousLaunchingProperty.value = !this.fieldProperty.value.isContinuousLaunchingProperty.value;
    }
  }

  public step( dt: number ): void {
    this.fieldProperty.value.step( dt, this.isContinuousLaunchingProperty.value );
  }

  public override clearCurrentField(): void {
    super.clearCurrentField();
    this.isContinuousLaunchingProperty.reset();
  }

  /**
   * Resets the model.
   */
  public override reset(): void {
    super.reset();
    this.sampleSizeProperty.reset();
    this.mysteryLauncherProperty.reset();
  }
}

projectileDataLab.register( 'SamplingModel', SamplingModel );
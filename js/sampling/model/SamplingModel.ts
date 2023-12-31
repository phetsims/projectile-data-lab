// Copyright 2023-2024, University of Colorado Boulder

/**
 * The SamplingModel is the model for the Projectile Data Lab's Sampling screen. All projectiles are tracked the
 * same as in the parent, to simplify phet-io statefulness, and it adds phases and utilities to launch multiple
 * projectiles to be part of a sample.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
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
import { LaunchMode, LaunchModeValues } from '../../common/model/LaunchMode.js';
import { SamplingPhase } from './SamplingPhase.js';
import PDLQueryParameters from '../../common/PDLQueryParameters.js';

type SelfOptions = EmptySelfOptions;

type SamplingModelOptions = SelfOptions & StrictOmit<PDLModelOptions<SamplingField>, 'timeSpeedValues' | 'fields' | 'isPathsVisible'>;

const SAMPLE_SIZES = [ 2, 5, 15, 40 ];

export default class SamplingModel extends PDLModel<SamplingField> {

  public readonly sampleSizeProperty: Property<number>;
  public readonly mysteryLauncherProperty: NumberProperty;

  public readonly phaseProperty: DynamicProperty<SamplingPhase, SamplingPhase, SamplingField>;
  public readonly selectedSampleProperty: DynamicProperty<number, number, SamplingField>;
  public readonly numberOfStartedSamplesProperty: DynamicProperty<number, number, SamplingField>;
  public readonly numberOfCompletedSamplesProperty: DynamicProperty<number, number, SamplingField>;
  public readonly sampleMeanProperty: DynamicProperty<number | null, number | null, SamplingField>;

  public constructor( providedOptions: SamplingModelOptions ) {

    // This is an adapter Property that converts between the SamplingModel's launchModeProperty which is available
    // after the super() call
    const samplingLaunchModeProperty = new Property<LaunchMode>( 'single', {
      validValues: LaunchModeValues
    } );

    const fields: SamplingField[] = [];
    const NUM_LAUNCHERS = 6;
    const fieldsTandem = providedOptions.tandem.createTandem( 'fields' );
    for ( let i = 0; i < NUM_LAUNCHERS; i++ ) {
      for ( let j = 0; j < SAMPLE_SIZES.length; j++ ) {
        fields.push( new SamplingField(
          i + 1, SAMPLE_SIZES[ j ], samplingLaunchModeProperty, {
            tandem: fieldsTandem.createTandem( `launcher${i + 1}sampleSize${SAMPLE_SIZES[ j ]}Field` ),
            phetioFeatured: true
          } ) );
      }
    }

    const options = optionize<SamplingModelOptions, SelfOptions, PDLModelOptions<SamplingField>>()( {
      timeSpeedValues: [ TimeSpeed.NORMAL, TimeSpeed.FAST ],
      fields: fields,
      isPathsVisible: true
    }, providedOptions );

    super( true, options );

    this.launchModeProperty.link( launchMode => {
      samplingLaunchModeProperty.value = launchMode;
    } );

    this.sampleSizeProperty = new Property<number>( 2, {
      validValues: SAMPLE_SIZES,
      tandem: options.tandem.createTandem( 'sampleSizeProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property configures the number of projectiles in a sample',
      phetioValueType: NumberIO
    } );

    this.mysteryLauncherProperty = new NumberProperty( 1, {
      validValues: _.range( 1, 7 ),
      tandem: providedOptions.tandem.createTandem( 'mysteryLauncherProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property configures the active launcher by number.'
    } );

    // In the SamplingModel, the field acts like a derived property based on the selected launcher and sample size
    Multilink.multilink( [ this.sampleSizeProperty, this.mysteryLauncherProperty ], ( sampleSize, mysteryLauncher ) => {
      const field = this.fields.find( field => field.sampleSize === sampleSize && field.launcher === mysteryLauncher )!;
      this.fieldProperty.value = field;
    } );

    this.numberOfStartedSamplesProperty = new DynamicProperty<number, number, SamplingField>( this.fieldProperty, {
      derive: t => t.numberOfStartedSamplesProperty
    } );

    this.numberOfCompletedSamplesProperty = new DynamicProperty<number, number, SamplingField>( this.fieldProperty, {
      derive: t => t.numberOfCompletedSamplesProperty
    } );

    this.phaseProperty = new DynamicProperty<SamplingPhase, SamplingPhase, SamplingField>( this.fieldProperty, {
      derive: t => t.phaseProperty
    } );

    this.selectedSampleProperty = new DynamicProperty<number, number, SamplingField>( this.fieldProperty, {

      // The up/down carousel card changes the selected sample, so this is bidirectional
      bidirectional: true,
      derive: t => t.selectedSampleProperty
    } );

    this.sampleMeanProperty = new DynamicProperty<number | null, number | null, SamplingField>( this.fieldProperty, {
      derive: t => t.sampleMeanProperty
    } );
  }

  public override launchButtonPressed(): void {

    if ( this.numberOfStartedSamplesProperty.value >= PDLQueryParameters.maxSamples ) {
      return;
    }

    console.log( 'launchButtonPressed' );

    const field = this.fieldProperty.value;
    const phaseProperty = field.phaseProperty;

    if ( this.launchModeProperty.value === 'single' ) {
      if ( phaseProperty.value !== 'idle' ) {

        // When firing a sample while another was in progress, finish out the prior one first
        field.finishCurrentSample();
        phaseProperty.value = 'showingCompleteSampleWithMean';
      }

      this.selectedSampleProperty.value = field.numberOfCompletedSamplesProperty.value + 1;
      phaseProperty.value = 'showingAirborneProjectiles';
    }

    else if ( this.launchModeProperty.value === 'continuous' ) {
      field.isContinuousLaunchingProperty.toggle();

      if ( phaseProperty.value === 'idle' ) {
        this.selectedSampleProperty.value = 1;
        field.finishCurrentSample();
        phaseProperty.value = 'showingCompleteSampleWithMean';
      }
      else {

        if ( field.isContinuousLaunchingProperty.value ) {
          this.selectedSampleProperty.value = field.numberOfCompletedSamplesProperty.value + 1;
        }

        field.finishCurrentSample();
        phaseProperty.value = 'showingCompleteSampleWithMean';
      }
    }
  }

  public step( dt: number ): void {
    this.fieldProperty.value.step( dt );
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
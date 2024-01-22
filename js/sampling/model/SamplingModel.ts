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
import { LaunchMode, LaunchModeValues } from '../../common/model/LaunchMode.js';
import { SamplingPhase } from './SamplingPhase.js';
import PDLQueryParameters from '../../common/PDLQueryParameters.js';
import Launcher, { MYSTERY_LAUNCHERS } from '../../common/model/Launcher.js';
import PDLConstants from '../../common/PDLConstants.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';

type SelfOptions = EmptySelfOptions;

type SamplingModelOptions = SelfOptions & StrictOmit<PDLModelOptions<SamplingField>, 'timeSpeedValues' | 'fields' | 'isPathsVisible'>;

const SAMPLE_SIZES = [ 2, 5, 15, 40 ];

export default class SamplingModel extends PDLModel<SamplingField> {

  public readonly sampleSizeProperty: Property<number>;

  public readonly phaseProperty: DynamicProperty<SamplingPhase, SamplingPhase, SamplingField>;
  public readonly selectedSampleIndexProperty: DynamicProperty<number, number, SamplingField>;
  public readonly numberOfStartedSamplesProperty: DynamicProperty<number, number, SamplingField>;
  public readonly numberOfCompletedSamplesProperty: DynamicProperty<number, number, SamplingField>;
  public readonly sampleMeanProperty: DynamicProperty<number | null, number | null, SamplingField>;

  public readonly launcherProperty: Property<Launcher>;

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
        fields.push( new SamplingField( MYSTERY_LAUNCHERS[ i ], SAMPLE_SIZES[ j ], samplingLaunchModeProperty, {
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

    super( options );

    // In the SamplingModel, the launcher is an independent variable that (with the sample size) determines the Field
    this.launcherProperty = new Property<Launcher>( MYSTERY_LAUNCHERS[ 0 ], {
      tandem: options.tandem.createTandem( 'launcherProperty' ),
      phetioValueType: ReferenceIO( IOType.ObjectIO )
    } );

    this.launchModeProperty.link( launchMode => {
      samplingLaunchModeProperty.value = launchMode;
    } );

    this.sampleSizeProperty = new Property<number>( 2, {
      validValues: SAMPLE_SIZES,
      tandem: options.tandem.createTandem( 'sampleSizeProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'This property configures the number of projectiles in a sample.',
      phetioValueType: NumberIO
    } );

    // In the SamplingModel, the field acts like a derived property based on the selected launcher and sample size
    // TODO: This seems buggy after https://github.com/phetsims/projectile-data-lab/issues/96. Perhaps make launcherProperty or fieldProperty abstract in PDLModel?
    Multilink.multilink( [ this.sampleSizeProperty, this.launcherProperty ], ( sampleSize, launcher ) => {
      const field = this.fields.find( field => field.sampleSize === sampleSize && field.launcherProperty.value === launcher )!;
      this.fieldProperty.value = field;

      console.log( launcher.launcherNumber, sampleSize, field.identifier );
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

    this.selectedSampleIndexProperty = new DynamicProperty<number, number, SamplingField>( this.fieldProperty, {

      // The up/down carousel card changes the selected sample, so this is bidirectional
      bidirectional: true,
      derive: t => t.selectedSampleIndexProperty
    } );

    this.sampleMeanProperty = new DynamicProperty<number | null, number | null, SamplingField>( this.fieldProperty, {
      derive: t => t.sampleMeanProperty
    } );
  }

  public override launchButtonPressed(): void {

    if ( this.numberOfStartedSamplesProperty.value >= PDLQueryParameters.maxSamples ) {
      return;
    }

    const field = this.fieldProperty.value;
    const phaseProperty = field.phaseProperty;

    if ( this.launchModeProperty.value === 'single' ) {

      // If the simulation is paused, unpause it.
      this.isPlayingProperty.value = true;

      if ( phaseProperty.value !== 'idle' ) {

        // When firing a sample while another was in progress, finish out the prior one first
        field.finishCurrentSample();
        phaseProperty.value = 'showingCompleteSampleWithMean';
      }

      this.selectedSampleIndexProperty.value = field.numberOfCompletedSamplesProperty.value + 1;
      phaseProperty.value = 'showingAirborneProjectiles';
    }

    else if ( this.launchModeProperty.value === 'continuous' ) {
      field.isContinuousLaunchingProperty.toggle();

      if ( phaseProperty.value === 'idle' ) {

        // If the simulation is paused, unpause it.
        this.isPlayingProperty.value = true;

        this.selectedSampleIndexProperty.value = 1;
        field.finishCurrentSample();
        phaseProperty.value = 'showingCompleteSampleWithMean';
      }
      else {
        if ( field.isContinuousLaunchingProperty.value ) {

          // If the simulation is paused, unpause it.
          this.isPlayingProperty.value = true;

          this.selectedSampleIndexProperty.value = field.numberOfCompletedSamplesProperty.value + 1;
        }

        field.finishCurrentSample();
        phaseProperty.value = 'showingCompleteSampleWithMean';
      }
    }
  }

  public step( dt: number ): void {

    if ( !this.isPlayingProperty.value ) {
      return;
    }

    dt = dt * ( this.timeSpeedProperty.value === TimeSpeed.FAST ? PDLConstants.TIME_SPEED_FAST : 1 );
    this.fieldProperty.value.step( dt );
  }

  /**
   * Resets the model.
   */
  public override reset(): void {
    super.reset();
    this.sampleSizeProperty.reset();
  }
}

projectileDataLab.register( 'SamplingModel', SamplingModel );
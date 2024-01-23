// Copyright 2023-2024, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import Projectile from '../../common/model/Projectile.js';
import HistogramData from '../../common/model/HistogramData.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Emitter from '../../../../axon/js/Emitter.js';
import { SingleOrContinuous } from '../../common/model/SingleOrContinuous.js';
import { SamplingPhase, SamplingPhaseValues } from './SamplingPhase.js';
import PDLQueryParameters from '../../common/PDLQueryParameters.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Launcher from '../../common/model/Launcher.js';

/**
 * The SamplingField is an extension of the Field class that adds fields for the Sampling model. Note in order to support
 * CODAP, the "sample" is a number stored within the Projectile (rather than adding arrays or data structures here).
 * This allows CODAP students to see projectiles from different samples, or to filter by sample.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type SamplingFieldOptions = SelfOptions & StrictOmit<FieldOptions, 'isLauncherConfigurationPhetioInstrumented'>;

// This is the delay between the last projectile landing and the mean symbol appearing, in 'Single sample' mode.
const SHOWING_SINGLE_SAMPLE_TIME = 0.3;

// This is the duration of the sample and mean symbol being visible, in 'Continuous' mode.
const CONTINUOUS_MODE_PERIOD = 0.4;

export default class SamplingField extends Field {
  public override identifier: string;

  // A sample is "started" when the first projectile is launched for that sample.
  public readonly numberOfStartedSamplesProperty: NumberProperty;

  // A sample is "completed" when the mean indicator is shown after a delay following the last projectile landing.
  public readonly numberOfCompletedSamplesProperty: NumberProperty;

  // This property is used to set the visibility and position of the mean indicator.
  // If it is null, the current sample is not yet complete and the mean indicator is not visible.
  // Note: In 'Single sample' mode, there is a delay between the last projectile in a sample and the mean indicator appearing.
  public readonly sampleMeanProperty: Property<number | null>;

  public readonly projectileCreatedEmitter = new Emitter<[ Projectile ]>( {
    parameters: [ {
      name: 'projectile',
      valueType: Projectile
    } ]
  } );

  // Total elapsed time of running the model, so we can update the current phase and/or move to the next phase.
  private readonly timeProperty: NumberProperty;

  // Mark the time when a phase began, so we can track how long we have been in the phase.
  private readonly phaseStartTimeProperty: NumberProperty;

  // Total time to launch all projectiles in single mode.
  private readonly totalSampleTime: number;

  // Current phase, see documentation above
  public readonly phaseProperty: StringUnionProperty<SamplingPhase>;

  public readonly selectedSampleIndexProperty: NumberProperty;

  public constructor( launcher: Launcher,
                      public readonly sampleSize: number,
                      private readonly launchModeProperty: Property<SingleOrContinuous>,
                      providedOptions: SamplingFieldOptions ) {
    const options = optionize<SamplingFieldOptions, SelfOptions, FieldOptions>()( {
      isLauncherConfigurationPhetioInstrumented: false
    }, providedOptions );

    super( [ launcher ],

      // The launcher never changes on this field, but we still need a Property<Launcher> in the parent type to power
      // the DynamicProperty instances.
      new Property( launcher, {
        validValues: [ launcher ]
      } ), options );

    this.selectedSampleIndexProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'selectedSampleIndexProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The selected sample being shown on the field.'
    } );

    this.identifier = window.phetio.PhetioIDUtils.getComponentName( this.phetioID );

    // PhET-iO instrumentation not needed since these are computable from the Projectiles and the phase
    this.numberOfStartedSamplesProperty = new NumberProperty( 0 );
    this.numberOfCompletedSamplesProperty = new NumberProperty( 0, {
      phetioDocumentation: 'The number of samples that have been completed.',
      tandem: options.tandem.createTandem( 'numberOfCompletedSamplesProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,

      // State is managed by the projectiles and updated in the stateSetEmitter below
      phetioState: false
    } );

    // Increase the total time as the sample size increases, so that larger samples take longer but not too long.
    this.totalSampleTime =
      this.sampleSize === 2 ? 0.75 :
      this.sampleSize === 5 ? 2 :
      this.sampleSize === 15 ? 5 :
      this.sampleSize === 40 ? 9 :
      0;

    assert && assert( this.totalSampleTime > 0, 'this.totalSampleTime should be greater than 0' );

    this.sampleMeanProperty = new Property<number | null>( null, {
      reentrant: true
    } );

    this.phaseProperty = new StringUnionProperty<SamplingPhase>( 'idle', {
      validValues: SamplingPhaseValues,
      tandem: options.tandem.createTandem( 'phaseProperty' ),
      phetioDocumentation: 'The sampling screen is managed by a finite state machine. The possible states are called phases. For internal phet-io use only, for managing state save and load.'
    } );

    this.timeProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'timeProperty' ),
      phetioDocumentation: 'The total elapsed time of running the model, so we can update the current phase and/or move to the next phase. For PhET-iO internal use only for managing state save and load.'
    } );

    this.phaseStartTimeProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'phaseStartTimeProperty' ),
      phetioDocumentation: 'Mark the time when a phase began, so we can track how long we have been in the phase. For PhET-iO internal use only for managing state save and load.'
    } );

    this.selectedSampleIndexProperty.link( ( newSampleIndex, oldSampleIndex ) => {
      if ( typeof oldSampleIndex === 'number' && newSampleIndex < oldSampleIndex ) {
        this.finishSample( oldSampleIndex );
      }
      this.updateComputedProperties();
    } );

    const phaseChanged = () => {
      this.phaseStartTimeProperty.value = this.timeProperty.value;
      this.updateComputedProperties();
    };
    this.phaseProperty.link( phaseChanged );

    Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => {
      this.updateComputedProperties();
    } );

    this.numberOfStartedSamplesProperty.link( numberOfStartedSamples => {
      if ( numberOfStartedSamples >= PDLQueryParameters.maxSamples ) {
        this.isContinuousLaunchingProperty.value = false;
      }
    } );
  }

  /**
   * In this simulation, some of the properties are computed from the state of the projectiles+phase, so we need to update
   * them accordingly.
   */
  private updateComputedProperties(): void {
    const totalProjectiles = this.getTotalProjectileCount();

    // If the selected sample is greater than the number of started samples, then we are about to start creating projectiles for a new sample
    this.numberOfStartedSamplesProperty.value = Math.max( Math.ceil( totalProjectiles / this.sampleSize ), this.selectedSampleIndexProperty.value );

    let numberOfCompletedSamples = Math.floor( totalProjectiles / this.sampleSize );

    if ( this.launchModeProperty.value === 'single' &&
         ( this.phaseProperty.value === 'showingCompleteSampleWithoutMean' || this.phaseProperty.value === 'showingAirborneProjectiles' ) ) {
      numberOfCompletedSamples--;
    }

    this.numberOfCompletedSamplesProperty.value = Math.max( 0, numberOfCompletedSamples );

    // Update the sample mean
    const projectilesInSelectedSample = this.getProjectilesInSelectedSample();

    // This multilink is called during transient intermediate phases, so we must guard and make sure we truly have a complete sample
    const isComplete = this.phaseProperty.value === 'showingCompleteSampleWithMean' && projectilesInSelectedSample.length === this.sampleSize;

    this.sampleMeanProperty.value = isComplete ? _.mean( projectilesInSelectedSample.map( projectile => projectile.x ) ) : null;

    // if ( this.landedProjectiles.length === 0 ) {
    //   assert && assert( this.numberOfCompletedSamplesProperty.value === 0, 'numberOfCompletedSamplesProperty should be 0 when there are no projectiles' );
    // }
  }

  public getProjectilesInSelectedSample(): Projectile[] {
    return this.getProjectilesInSample( this.selectedSampleIndexProperty.value );
  }

  public getProjectilesInSample( sampleNumber: number ): Projectile[] {
    return this.getAllProjectiles().filter( projectile => projectile.sampleNumber === sampleNumber );
  }

  public getLandedProjectilesInSelectedSample(): Projectile[] {
    return this.landedProjectiles.filter( projectile => projectile.sampleNumber === this.selectedSampleIndexProperty.value );
  }

  /**
   * Return an array of samples which have their means currently showing. Each sample is an object with a single property, x,
   * which is the mean distance of projectiles in that sample. This is used for the histogram.
   */
  public getHistogramData(): HistogramData[] {

    const samples: HistogramData[] = [];

    for ( let sampleIndex = 0; sampleIndex < this.numberOfCompletedSamplesProperty.value; sampleIndex++ ) {
      const sampleNumber = sampleIndex + 1;

      const members = this.landedProjectiles.filter( projectile => projectile.sampleNumber === sampleNumber );

      if ( members.length === this.sampleSize ) {

        const mean = _.mean( members.map( projectile => projectile.x ) );
        assert && assert( !isNaN( mean ), 'mean should not be NaN' );

        samples.push( { x: mean } );
      }
    }
    return samples;
  }

  public createLandedProjectile( sampleNumber: number ): void {
    const projectile = this.createProjectile( sampleNumber );
    projectile.setLanded();

    this.landedProjectiles.push( projectile );
    this.projectilesChangedEmitter.emit();
    this.projectileCreatedEmitter.emit( projectile );
  }

  // If the user fires a new sample while a prior sample was in progress, finish up the prior sample.
  // Most important for 'Single' mode
  public finishCurrentSample(): void {
    this.finishSample( this.selectedSampleIndexProperty.value );
  }

  private finishSample( sampleNumber: number ): void {
    let changed = false;
    while ( this.getProjectilesInSample( sampleNumber ).length < this.sampleSize ) {
      changed = true;
      this.createLandedProjectile( sampleNumber );
    }

    // Anything in the air should end up on the ground.
    this.getProjectilesInSample( sampleNumber ).forEach( projectile => {
      projectile.setLanded();
      changed = true;
    } );

    if ( changed ) {
      this.updateComputedProperties();
      this.projectilesChangedEmitter.emit();
    }
  }

  public step( dt: number ): void {

    this.stepAirborneParticles( dt );

    this.timeProperty.value += dt;
    const timeInMode = this.timeProperty.value - this.phaseStartTimeProperty.value;

    if ( this.phaseProperty.value === 'idle' ) {

      // Nothing to do, waiting for user to press the launch button
    }
    else if ( this.phaseProperty.value === 'showingAirborneProjectiles' ) { // Only for single mode

      // The continuous amount we have progressed through the current sample
      const portionOfSample = Math.min( timeInMode / this.totalSampleTime, 1 );

      // Compute the number of projectile that should be showing at this time
      const numberProjectilesToShow = Math.ceil( portionOfSample * this.sampleSize );

      let changed = false;
      while ( this.getProjectilesInSelectedSample().length < numberProjectilesToShow ) {
        const projectile = this.createProjectile( this.selectedSampleIndexProperty.value );
        this.airborneProjectiles.push( projectile );
        this.projectileCreatedEmitter.emit( projectile );
        changed = true;
      }

      if ( changed ) {
        this.projectilesChangedEmitter.emit();
        this.updateComputedProperties();
      }

      // Allow extra time to show focus on the final projectile before showing the sample mean
      if ( this.getLandedProjectilesInSelectedSample().length === this.sampleSize ) {

        this.phaseProperty.value = 'showingCompleteSampleWithoutMean';
      }
    }
    else if ( this.phaseProperty.value === 'showingCompleteSampleWithoutMean' ) { // Only for single mode

      if ( timeInMode > SHOWING_SINGLE_SAMPLE_TIME ) {
        this.phaseProperty.value = 'showingCompleteSampleWithMean';
      }
    }
    else if ( this.phaseProperty.value === 'showingCompleteSampleWithMean' ) {
      if (
        this.launchModeProperty.value === 'continuous' &&
        this.isContinuousLaunchingProperty.value &&
        timeInMode >= CONTINUOUS_MODE_PERIOD &&
        this.numberOfCompletedSamplesProperty.value < PDLQueryParameters.maxSamples ) {

        // Create all projectiles for this sample immediately and go to next one
        this.selectedSampleIndexProperty.value++;

        this.finishCurrentSample();

        // Manually restart the phase timer, since the phase will not change when showing sequential continuous samples
        this.phaseStartTimeProperty.value = this.timeProperty.value;
      }
    }
  }

  // When the eraser button is pressed, clear the selected Field's projectiles.
  public override clearProjectiles(): void {

    super.clearProjectiles();
    this.updateComputedProperties();
    this.phaseProperty.reset();
  }
}

projectileDataLab.register( 'SamplingField', SamplingField );

// Copyright 2023-2024, University of Colorado Boulder

import optionize from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import Projectile from '../../common/model/Projectile.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { VSMFieldIdentifier } from './VSMFieldIdentifier.js';
import PDLConstants from '../../common/PDLConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PDLEventTimer from '../../common/model/PDLEventTimer.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import { StopwatchPhase, StopwatchPhaseValues } from './StopwatchPhase.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PDLQueryParameters from '../../common/PDLQueryParameters.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Launcher from '../../common/model/Launcher.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Range from '../../../../dot/js/Range.js';

/**
 * The VSMField is an extension of the Field class that adds fields for the VSM models.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = {

  // On the Measures screen, the launcher property is read-only, because the value is determined by the combination
  // of the mysteryOrCustomProperty and mysteryLauncherProperty.
  isLauncherPropertyPhetioReadOnly: boolean;
};
export type VSMFieldOptions = SelfOptions & StrictOmit<FieldOptions, 'isLauncherConfigurationPhetioInstrumented'>;

export default class VSMField extends Field {

  // The most recent speed of a projectile launched by the launcher, in meters per second
  public readonly latestLaunchSpeedProperty: Property<number>;

  public readonly continuousLaunchTimer = new PDLEventTimer( PDLConstants.MINIMUM_TIME_BETWEEN_LAUNCHES );

  public readonly selectedProjectileNumberProperty: NumberProperty;
  public readonly selectedProjectileProperty: TReadOnlyProperty<Projectile | null>;

  public readonly stopwatchPhaseProperty: Property<StopwatchPhase>;
  public readonly stopwatchElapsedTimeProperty: NumberProperty;

  public readonly projectileLaunchedEmitter = new Emitter<[ Projectile ]>( {
    parameters: [ {
      name: 'projectile',
      valueType: Projectile
    } ]
  } );
  public readonly numberOfLandedProjectilesProperty: NumberProperty;
  public readonly totalProjectileCountProperty: NumberProperty;

  public override selectedSampleIndexProperty = new NumberProperty( 0 );

  public constructor( launchers: readonly Launcher[], public readonly identifier: VSMFieldIdentifier, providedOptions: VSMFieldOptions ) {

    const options = optionize<VSMFieldOptions, SelfOptions, FieldOptions>()( {
      isLauncherConfigurationPhetioInstrumented: true
    }, providedOptions );

    const launcherProperty = new Property( launchers[ 0 ], {
      validValues: launchers,
      tandem: launchers.length === 1 ? Tandem.OPT_OUT : options.tandem.createTandem( 'launcherProperty' ),
      phetioReadOnly: options.isLauncherPropertyPhetioReadOnly,
      phetioValueType: ReferenceIO( IOType.ObjectIO )
    } );

    super( launchers, launcherProperty, options );

    this.latestLaunchSpeedProperty = new Property<number>( this.meanSpeedProperty.value, {
      tandem: providedOptions.tandem.createTandem( 'latestLaunchSpeedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'This property is the latest launch speed, in meters per second. When a projectile is launched, this is set to the launch speed.',
      phetioValueType: NumberIO,
      phetioFeatured: true
    } );

    this.selectedProjectileNumberProperty = new NumberProperty( 0, {
      phetioFeatured: true,
      tandem: providedOptions.tandem.createTandem( 'selectedProjectileNumberProperty' ),
      range: new Range( 0, PDLQueryParameters.maxProjectiles ),
      rangePropertyOptions: {
        tandem: Tandem.OPT_OUT
      },
      numberType: 'Integer',
      phetioDocumentation: 'This property is the number of the selected projectile, in order of landing. This number is 1-indexed, and 0 means no projectile is selected.'
    } );

    this.selectedProjectileProperty = new DerivedProperty( [ this.selectedProjectileNumberProperty ],
      highlightedProjectileNumber => {
        return this.landedProjectiles[ highlightedProjectileNumber - 1 ] || null;
      } );

    this.stopwatchPhaseProperty = new Property<StopwatchPhase>( 'clear', {
      validValues: StopwatchPhaseValues,
      tandem: providedOptions.tandem.createTandem( 'stopwatchPhaseProperty' ),
      phetioDocumentation: 'This property represents the phase of the stopwatch used to time projectile flight.',
      phetioValueType: StringUnionIO( StopwatchPhaseValues )
    } );

    this.stopwatchElapsedTimeProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'stopwatchElapsedTimeProperty' ),
      phetioDocumentation: 'This property is the elapsed time of the stopwatch, in seconds.'
    } );

    // A projectile is counted if it is landed or if it goes below y=0 meters (beyond the 100m mark horizontally)
    this.numberOfLandedProjectilesProperty = new NumberProperty( 0, {
      phetioFeatured: true,
      phetioDocumentation: 'This Property represents the number of projectiles that have landed.',
      tandem: options.tandem.createTandem( 'numberOfLandedProjectilesProperty' ),
      phetioReadOnly: true,
      phetioState: false,
      range: new Range( 0, PDLQueryParameters.maxProjectiles ),
      rangePropertyOptions: {
        tandem: Tandem.OPT_OUT
      },
      numberType: 'Integer'
    } );
    this.totalProjectileCountProperty = new NumberProperty( 0 );

    this.projectileLandedEmitter.addListener( projectile => {

      // After a projectile lands, update the selected projectile number and the number of landed projectiles
      this.selectedProjectileNumberProperty.value = this.landedProjectiles.indexOf( projectile ) + 1;

      this.numberOfLandedProjectilesProperty.value = this.landedProjectiles.length;
    } );

    this.projectileLaunchedEmitter.addListener( projectile => {
      this.totalProjectileCountProperty.value = this.getTotalProjectileCount();
    } );

    Tandem.PHET_IO_ENABLED && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => {
      this.updateProjectileCounts();
    } );

    // If the selected projectile is changed, repaint the canvas even if time is paused
    this.selectedProjectileProperty.lazyLink( () => {
      this.projectilesChangedEmitter.emit();
    } );

    // If the launch configuration is changed, re-center the launcher.
    this.meanAngleProperty.lazyLink( configuredLaunchAngle => {
      this.latestLaunchAngleProperty.value = configuredLaunchAngle;
    } );

    // TODO: Find a better way to do this - see https://github.com/phetsims/projectile-data-lab/issues/28
    // If the angle standard deviation is changed, re-center the launcher so that there is no overlap between the two.
    // Do not do this during a continuous launch, because it causes flicker.
    this.standardDeviationAngleProperty.lazyLink( () => {
      if ( !this.isContinuousLaunchingProperty.value ) {
        this.latestLaunchAngleProperty.value = this.meanAngleProperty.value;
      }
    } );
  }

  public updateProjectileCounts(): void {
    this.numberOfLandedProjectilesProperty.value = this.landedProjectiles.length;
    this.totalProjectileCountProperty.value = this.getTotalProjectileCount();
  }

  public launchProjectile(): void {
    if ( this.getTotalProjectileCount() >= PDLQueryParameters.maxProjectiles ) {
      return;
    }

    const projectile = this.createProjectile( 0 );
    this.airborneProjectiles.push( projectile );

    this.latestLaunchAngleProperty.value = projectile.launchAngle;
    this.latestLaunchSpeedProperty.value = projectile.launchSpeed;

    this.projectileLaunchedEmitter.emit( projectile );
  }

  public step( dt: number ): void {

    if ( this.stopwatchPhaseProperty.value === 'running' ) {
      this.stopwatchElapsedTimeProperty.value += dt;
    }

    this.stepAirborneParticles( dt );
  }

  public override reset(): void {
    super.reset();

    this.standardDeviationAngleProperty.reset();
    this.continuousLaunchTimer.reset();
    this.stopwatchPhaseProperty.reset();
    this.stopwatchElapsedTimeProperty.reset();
  }

  public override clearProjectiles(): void {
    super.clearProjectiles();

    // Reset the time elapsed since the last launch so that continuous mode can immediately launch a projectile
    this.continuousLaunchTimer.setZeroTimeRemaining();

    this.selectedProjectileNumberProperty.reset();

    this.numberOfLandedProjectilesProperty.reset();
    this.totalProjectileCountProperty.reset();
  }
}

projectileDataLab.register( 'VSMField', VSMField );

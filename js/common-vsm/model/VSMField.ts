// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Field, { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import Projectile from '../../common/model/Projectile.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import { LauncherMechanism, LauncherMechanismValues } from './LauncherMechanism.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import { VSMFieldIdentifier } from './VSMFieldIdentifier.js';
import PDLConstants from '../../common/PDLConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PDLEventTimer from '../../common/model/PDLEventTimer.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

/**
 * The VSMField is an extension of the Field class that adds fields for the VSM models.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type VSMFieldOptions = SelfOptions & FieldOptions;

export default class VSMField extends Field {

  // The most recent speed of a projectile launched by the launcher, in meters per second
  public readonly latestLaunchSpeedProperty: Property<number>;

  public readonly isLauncherCustomProperty: Property<boolean>;

  public readonly customLauncherTypeProperty: Property<LauncherMechanism>;

  public readonly angleStabilizerProperty: NumberProperty;

  public readonly continuousLaunchTimer = new PDLEventTimer( PDLConstants.MINIMUM_TIME_BETWEEN_LAUNCHES );

  public readonly selectedProjectileNumberProperty: NumberProperty;
  public readonly selectedProjectileProperty: TReadOnlyProperty<Projectile | null>;

  public readonly isStopwatchRunningProperty: BooleanProperty;
  public readonly stopwatchElapsedTimeProperty: NumberProperty;

  public readonly projectileLaunchedEmitter = new Emitter<[ Projectile ]>( {
    parameters: [ {
      name: 'projectile',
      valueType: Projectile
    } ]
  } );
  public readonly landedProjectileCountProperty: NumberProperty;

  public constructor( public readonly identifier: VSMFieldIdentifier, providedOptions: VSMFieldOptions ) {
    super( providedOptions );

    this.latestLaunchSpeedProperty = new Property<number>( this.meanLaunchSpeedProperty.value, {
      tandem: providedOptions.tandem.createTandem( 'latestLaunchSpeedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'This property is the latest launch speed, in meters per second. When a projectile is launched, this is set to the launch speed.',
      phetioValueType: NumberIO
    } );

    this.selectedProjectileNumberProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'selectedProjectileNumberProperty' ),
      phetioDocumentation: 'This property is the number of the selected projectile, in order of landing. This number is 1-indexed, and 0 means no projectile is selected.'
    } );

    this.selectedProjectileProperty = new DerivedProperty( [ this.selectedProjectileNumberProperty ],
      highlightedProjectileNumber => {
        return this.landedProjectiles[ highlightedProjectileNumber - 1 ] || null;
      } );

    this.isLauncherCustomProperty = new Property<boolean>( false, {
      tandem: providedOptions.tandem.createTandem( 'isLauncherCustomProperty' ),
      phetioDocumentation: 'This property is true when the custom launcher is selected.',
      phetioValueType: BooleanIO
    } );

    this.customLauncherTypeProperty = new Property<LauncherMechanism>( 'spring', {
      validValues: LauncherMechanismValues,
      tandem: providedOptions.tandem.createTandem( 'customLauncherTypeProperty' ),
      phetioDocumentation: 'This property configures the mechanism of the custom launcher.',
      phetioValueType: StringUnionIO( LauncherMechanismValues )
    } );

    this.angleStabilizerProperty = new NumberProperty( PDLConstants.LAUNCHER_CONFIGS[ 0 ].angleStandardDeviation, {
      range: PDLConstants.ANGLE_STABILIZER_RANGE,
      tandem: providedOptions.tandem.createTandem( 'angleStabilizerProperty' ),
      phetioDocumentation: 'This property configures the width of the angle stabilizer for the custom launcher.'
    } );

    this.isStopwatchRunningProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'isStopwatchRunningProperty' ),
      phetioDocumentation: 'This property is true when the stopwatch is running.'
    } );

    this.stopwatchElapsedTimeProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'stopwatchElapsedTimeProperty' ),
      phetioDocumentation: 'This property is the elapsed time of the stopwatch, in seconds.'
    } );

    // A projectile is counted if it is landed or if it goes below y=0 meters (beyond the 100m mark horizontally)
    this.landedProjectileCountProperty = new NumberProperty( 0 );

    // TODO: When phetio-state is set, does it trigger "landed" on things? Probably not. And it probably shouldn't. https://github.com/phetsims/projectile-data-lab/issues/7
    // But in that case we will need to track this data another way.
    this.projectileLandedEmitter.addListener( projectile => {

      // After a projectile lands, update the selected projectile number and the number of landed projectiles
      const indexOfNewProjectile = this.landedProjectiles.indexOf( projectile );

      const indexOfPreviouslyLandedProjectile = indexOfNewProjectile - 1;
      const indexOfSelectedProjectile = this.selectedProjectileNumberProperty.value - 1;

      // However, if the user is not selecting the latest projectile, then don't change the selected projectile
      if ( indexOfSelectedProjectile === indexOfPreviouslyLandedProjectile ) {
        this.selectedProjectileNumberProperty.value = this.landedProjectiles.indexOf( projectile ) + 1;
      }

      this.landedProjectileCountProperty.value = this.landedProjectiles.length;
    } );

    // If the selected projectile is changed, repaint the canvas even if time is paused
    this.selectedProjectileProperty.lazyLink( () => {
      this.projectilesChangedEmitter.emit();
    } );

    // If the launch configuration is changed, re-center the launcher.
    this.meanLaunchAngleProperty.lazyLink( configuredLaunchAngle => {
      this.latestLaunchAngleProperty.value = configuredLaunchAngle;
    } );

    // If the angle stabilizer is changed, re-center the launcher so that there is no overlap between the two.
    // Do not do this during a continuous launch, because it causes flicker.
    this.angleStabilizerProperty.lazyLink( angleStabilizer => {
      if ( !this.isContinuousLaunchingProperty.value ) {
        this.latestLaunchAngleProperty.value = this.meanLaunchAngleProperty.value;
      }
    } );
  }

  public launchProjectile(): void {
    if ( this.getTotalProjectileCount() >= PDLConstants.MAX_PROJECTILES_PER_VSM_FIELD ) {
      return;
    }

    this.stopwatchElapsedTimeProperty.value = 0;
    this.isStopwatchRunningProperty.value = true;

    const projectile = this.createProjectile( 0 );
    this.airborneProjectiles.push( projectile );

    this.latestLaunchAngleProperty.value = projectile.launchAngle;
    this.latestLaunchSpeedProperty.value = projectile.launchSpeed;

    this.projectileLaunchedEmitter.emit( projectile );
  }

  public step( dt: number ): void {

    if ( this.isStopwatchRunningProperty.value ) {
      this.stopwatchElapsedTimeProperty.value += dt;
    }

    // If any projectiles were airborne at the beginning of the step, repaint the canvas at the end
    const numInitialAirborneProjectiles = this.airborneProjectiles.length;

    this.airborneProjectiles.forEach( projectile => {
      projectile.step( this, dt );
    } );

    // Repaint if any projectiles were airborne at the beginning of the step
    if ( numInitialAirborneProjectiles ) {
      this.projectilesChangedEmitter.emit();
    }
  }

  public override reset(): void {
    super.reset();

    this.isLauncherCustomProperty.reset();
    this.customLauncherTypeProperty.reset();
    this.angleStabilizerProperty.reset();
    this.continuousLaunchTimer.reset();
  }

  public override clearProjectiles(): void {
    super.clearProjectiles();

    // Reset the time elapsed since the last launch so that continuous mode can immediately launch a projectile
    this.continuousLaunchTimer.setZeroTimeRemaining();

    this.selectedProjectileNumberProperty.reset();
    this.landedProjectileCountProperty.reset();
  }
}

projectileDataLab.register( 'VSMField', VSMField );

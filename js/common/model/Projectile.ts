// Copyright 2023-2024, University of Colorado Boulder

import { ProjectileType, ProjectileTypeValues } from './ProjectileType.js';
import projectileDataLab from '../../projectileDataLab.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import PDLConstants from '../PDLConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import Field from './Field.js';
import { ScreenIdentifier, ScreenIdentifierValues } from './ScreenIdentifier.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import { LauncherConfiguration, LauncherConfigurationValues } from './LauncherConfiguration.js';
import { LauncherMechanism, LauncherMechanismValues } from '../../common-vsm/model/LauncherMechanism.js';

/**
 * Projectile is the model for a projectile in the Projectile Data Lab. It contains information about a projectile's
 * projectile type, launch angle, launch speed, initial height.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class Projectile {

  public screenIdentifier: ScreenIdentifier;

  public fieldIdentifier: string;

  public launcherConfiguration: LauncherConfiguration;
  public launcherType: 'mystery' | 'custom';

  // The following are mutually exclusive depending on whether the launcherType is mystery or custom.
  public mysteryLauncherNumber: number | null;
  public customLauncherMechanism: LauncherMechanism | null;
  public customLauncherAngleStabilizer: number | null;

  // The x and y coordinates of the projectile relative to the launch position, in meters
  public x: number;
  public y: number;

  // timeAirborne is the time the projectile has been airborne since launch, in seconds
  public timeAirborne: number;

  // The type of the projectile - CANNONBALL, PUMPKIN or PIANO
  public type: ProjectileType;

  // Initial angle of the projectile in degrees
  public launchAngle: number;

  // Initial speed of the projectile in meters per second
  public launchSpeed: number;

  // Initial height of the projectile in meters
  public launchHeight: number;

  // The sample number associated with this projectile
  public sampleNumber: number;

  // The horizontal scale of the projectile, 1 for un-flipped, -1 for flipped
  public isFlippedHorizontally: boolean;

  // The index of the image to display when the projectile has landed
  public landedImageIndex: number;

  public constructor(
    screenIdentifier: ScreenIdentifier,
    fieldIdentifier: string,
    sampleNumber: number,
    launcherConfiguration: LauncherConfiguration,
    launcherType: 'mystery' | 'custom',
    mysteryLauncherNumber: number | null,
    customLauncherMechanism: LauncherMechanism | null,
    customLauncherAngleStabilizer: number | null,
    x: number,
    y: number,
    type: ProjectileType,
    isFlippedHorizontally: boolean,
    landedImageIndex: number,
    timeAirborne: number,
    launchAngle: number,
    launchSpeed: number,
    launchHeight: number
  ) {
    this.screenIdentifier = screenIdentifier;
    this.fieldIdentifier = fieldIdentifier;
    this.sampleNumber = sampleNumber;
    this.launcherConfiguration = launcherConfiguration;
    this.launcherType = launcherType;
    this.mysteryLauncherNumber = mysteryLauncherNumber;
    this.customLauncherMechanism = customLauncherMechanism;
    this.customLauncherAngleStabilizer = customLauncherAngleStabilizer;
    this.x = x;
    this.y = y;
    this.type = type;
    this.isFlippedHorizontally = isFlippedHorizontally;
    this.landedImageIndex = landedImageIndex;
    this.timeAirborne = timeAirborne;
    this.launchAngle = launchAngle;
    this.launchSpeed = launchSpeed;
    this.launchHeight = launchHeight;
  }

  public step( field: Field, dt: number ): void {
    this.timeAirborne += dt;

    this.x = Projectile.getProjectileX( this.launchSpeed, this.launchAngle, this.timeAirborne );
    this.y = Projectile.getProjectileY( this.launchSpeed, this.launchAngle, this.launchHeight, this.timeAirborne )!;

    if ( this.y <= 0 ) {
      this.setLanded();
      field.projectileLandedEmitter.emit( this );
    }
  }

  public setLanded(): void {
    this.timeAirborne = Projectile.getTotalFlightTime( this.launchSpeed, this.launchAngle, this.launchHeight );
    this.x = Projectile.getHorizontalRange( this.launchSpeed, this.launchAngle, this.launchHeight );
    this.y = 0;
  }

  public static ProjectileIO = new IOType<Projectile, ProjectileStateObject>( 'ProjectileIO', {
    valueType: Projectile,
    stateSchema: {
      screenIdentifier: StringUnionIO( ScreenIdentifierValues ),
      fieldIdentifier: StringIO,
      sampleNumber: NumberIO,
      launcherConfiguration: StringUnionIO( LauncherConfigurationValues ),
      launcherType: StringUnionIO( [ 'mystery', 'custom' ] ),
      mysteryLauncherNumber: NullableIO( NumberIO ),
      customLauncherMechanism: NullableIO( StringUnionIO( LauncherMechanismValues ) ),
      customLauncherAngleStabilizer: NullableIO( NumberIO ),
      x: NumberIO,
      y: NumberIO,
      type: StringUnionIO( ProjectileTypeValues ),
      isFlippedHorizontally: BooleanIO,
      landedImageIndex: NumberIO,
      timeAirborne: NumberIO,
      launchAngle: NumberIO,
      launchSpeed: NumberIO,
      launchHeight: NumberIO
    },
    toStateObject: ( projectile: Projectile ): ProjectileStateObject => {
      return {
        screenIdentifier: projectile.screenIdentifier,
        fieldIdentifier: projectile.fieldIdentifier,
        sampleNumber: projectile.sampleNumber,
        launcherConfiguration: projectile.launcherConfiguration,
        launcherType: projectile.launcherType,
        mysteryLauncherNumber: projectile.mysteryLauncherNumber,
        customLauncherMechanism: projectile.customLauncherMechanism,
        customLauncherAngleStabilizer: projectile.customLauncherAngleStabilizer,
        x: projectile.x,
        y: projectile.y,
        type: projectile.type,
        isFlippedHorizontally: projectile.isFlippedHorizontally,
        landedImageIndex: projectile.landedImageIndex,
        timeAirborne: projectile.timeAirborne,
        launchAngle: projectile.launchAngle,
        launchSpeed: projectile.launchSpeed,
        launchHeight: projectile.launchHeight
      };
    },
    fromStateObject: ( stateObject: ProjectileStateObject ) => {
      return new Projectile(
        stateObject.screenIdentifier,
        stateObject.fieldIdentifier,
        stateObject.sampleNumber,
        stateObject.launcherConfiguration,
        stateObject.launcherType,
        stateObject.mysteryLauncherNumber,
        stateObject.customLauncherMechanism,
        stateObject.customLauncherAngleStabilizer,
        stateObject.x,
        stateObject.y,
        stateObject.type,
        stateObject.isFlippedHorizontally,
        stateObject.landedImageIndex,
        stateObject.timeAirborne,
        stateObject.launchAngle,
        stateObject.launchSpeed,
        stateObject.launchHeight
      );
    }
  } );

  /** Physics functions - The PDL sim does not have air resistance, so 2D kinematics is sufficient to model the motion **/

  public static getProjectileX( launchSpeed: number, launchAngle: number, timeAirborne: number ): number {
    return launchSpeed * Math.cos( Utils.toRadians( launchAngle ) ) * timeAirborne;
  }

  public static getProjectileY( launchSpeed: number, launchAngle: number, launchHeight: number, timeAirborne: number ): number {
    return launchHeight + launchSpeed * Math.sin( Utils.toRadians( launchAngle ) ) * timeAirborne
           - 0.5 * PDLConstants.FREEFALL_ACCELERATION * timeAirborne * timeAirborne;
  }

  public static getHorizontalRange( launchSpeed: number, launchAngle: number, launchHeight: number ): number {
    const g = PDLConstants.FREEFALL_ACCELERATION;
    const v0 = launchSpeed;
    const launchAngleRadians = Utils.toRadians( launchAngle );
    const sinTheta = Math.sin( launchAngleRadians );
    const cosTheta = Math.cos( launchAngleRadians );

    return ( v0 * cosTheta / g ) * ( v0 * sinTheta + Math.sqrt( v0 * v0 * sinTheta * sinTheta + 2 * g * launchHeight ) );
  }

  public static getMaximumHeight( launchSpeed: number, launchAngle: number, launchHeight: number ): number {
    if ( launchAngle <= 0 ) {
      return launchHeight;
    }
    else {
      const g = PDLConstants.FREEFALL_ACCELERATION;
      const v0 = launchSpeed;
      const sinTheta = Math.sin( Utils.toRadians( launchAngle ) );
      return launchHeight + v0 * v0 * sinTheta * sinTheta / ( 2 * g );
    }
  }

  public static getTotalFlightTime( launchSpeed: number, launchAngle: number, launchHeight: number ): number {
    const g = PDLConstants.FREEFALL_ACCELERATION;
    const v0 = launchSpeed;
    const sinTheta = Math.sin( Utils.toRadians( launchAngle ) );
    return ( v0 * sinTheta / g ) + Math.sqrt( ( v0 * sinTheta / g ) * ( v0 * sinTheta / g ) + 2 * launchHeight / g );
  }
}

export type ProjectileStateObject = {
  screenIdentifier: ScreenIdentifier;
  fieldIdentifier: string;
  sampleNumber: number;
  launcherConfiguration: LauncherConfiguration;
  launcherType: 'mystery' | 'custom';
  mysteryLauncherNumber: number | null;
  customLauncherMechanism: LauncherMechanism | null;
  customLauncherAngleStabilizer: number | null;
  x: number;
  y: number;
  type: ProjectileType;
  isFlippedHorizontally: boolean;
  landedImageIndex: number;
  timeAirborne: number;
  launchAngle: number;
  launchSpeed: number;
  launchHeight: number;
};

projectileDataLab.register( 'Projectile', Projectile );
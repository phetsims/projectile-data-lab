// Copyright 2023, University of Colorado Boulder

import { ProjectileType, ProjectileTypeValues } from './ProjectileType.js';
import projectileDataLab from '../../projectileDataLab.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import PDLConstants from '../PDLConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import Field from './Field.js';
import { ScreenIdentifier, ScreenIdentifierValues } from './ScreenIdentifier.js';
import { ProjectilePhase, ProjectilePhaseValues } from './ProjectilePhase.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';

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

  // The x and y coordinates of the projectile relative to the launch position, in meters
  public x: number;
  public y: number;

  // timeAirborne is the time the projectile has been airborne since launch, in seconds
  public timeAirborne: number;

  // The type of the projectile - CANNONBALL, PUMPKIN or PIANO
  public type: ProjectileType;

  // Phase of the projectile's flight - AIRBORNE, LANDED
  public phase: ProjectilePhase;

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
    x: number,
    y: number,
    type: ProjectileType,
    phase: ProjectilePhase,
    isFlippedHorizontally: boolean,
    landedImageIndex: number,
    timeAirborne: number,
    launchAngle: number,
    launchSpeed: number,
    launchHeight: number
  ) {
    this.screenIdentifier = screenIdentifier;
    this.fieldIdentifier = fieldIdentifier;
    this.x = x;
    this.y = y;
    this.type = type;
    this.phase = phase;
    this.isFlippedHorizontally = isFlippedHorizontally;
    this.landedImageIndex = landedImageIndex;
    this.timeAirborne = timeAirborne;
    this.launchAngle = launchAngle;
    this.launchSpeed = launchSpeed;
    this.launchHeight = launchHeight;
    this.sampleNumber = sampleNumber;
  }

  public step( field: Field, dt: number ): void {
    if ( this.phase === 'AIRBORNE' || this.phase === 'AIRBORNE_BELOW_FIELD' ) {
      this.timeAirborne += dt;

      this.x = Projectile.getProjectileX( this.launchSpeed, this.launchAngle, this.timeAirborne );
      this.y = Projectile.getProjectileY( this.launchSpeed, this.launchAngle, this.launchHeight, this.timeAirborne )!;

      if ( this.phase === 'AIRBORNE' ) {
        if ( this.y <= 0 ) {
          if ( this.x > PDLConstants.MAX_FIELD_DISTANCE ) {
            this.phase = 'AIRBORNE_BELOW_FIELD';
          }
          else {
            this.phase = 'LANDED';
            this.x = Projectile.getHorizontalRange( this.launchSpeed, this.launchAngle, this.launchHeight );
            this.y = 0;
            this.timeAirborne = Projectile.getTotalFlightTime( this.launchSpeed, this.launchAngle, this.launchHeight );
          }

          field.projectileLandedEmitter.emit( this );
        }
      }

      if ( this.phase === 'AIRBORNE_BELOW_FIELD' ) {
        if ( this.y <= PDLConstants.BELOW_FIELD_LANDING_Y ) {
          this.phase = 'LANDED_BELOW_FIELD';
        }
      }
    }
  }

  public setLanded( field: Field ): void {
    const landedX = Projectile.getHorizontalRange( this.launchSpeed, this.launchAngle, this.launchHeight );

    if ( landedX > PDLConstants.MAX_FIELD_DISTANCE ) {

      // If the projectile goes past the field, simulate that it was launched from a higher height to calculate the
      // total time of flight to land below the field.
      const deltaHeightToLandBelowField = this.launchHeight - PDLConstants.BELOW_FIELD_LANDING_Y;

      this.phase = 'LANDED_BELOW_FIELD';
      this.timeAirborne = Projectile.getTotalFlightTime( this.launchSpeed, this.launchAngle, deltaHeightToLandBelowField );
      this.x = Projectile.getProjectileX( this.launchSpeed, this.launchAngle, this.timeAirborne );
      this.y = PDLConstants.BELOW_FIELD_LANDING_Y;
    }
    else {
      this.phase = 'LANDED';
      this.timeAirborne = Projectile.getTotalFlightTime( this.launchSpeed, this.launchAngle, this.launchHeight );
      this.x = landedX;
      this.y = 0;
    }

    field.projectileLandedEmitter.emit( this );
  }

  public static ProjectileIO = new IOType<Projectile, ProjectileStateObject>( 'ProjectileIO', {
    valueType: Projectile,
    stateSchema: {
      screenIdentifier: StringUnionIO( ScreenIdentifierValues ),
      fieldIdentifier: StringIO,
      sampleNumber: NumberIO,
      x: NumberIO,
      y: NumberIO,
      type: StringUnionIO( ProjectileTypeValues ),
      phase: StringUnionIO( ProjectilePhaseValues ),
      isFlippedHorizontally: BooleanIO,
      landedImageIndex: NumberIO,
      timeAirborne: NumberIO,
      launchAngle: NullableIO( NumberIO ),
      launchSpeed: NullableIO( NumberIO ),
      launchHeight: NullableIO( NumberIO )
    },
    toStateObject: ( projectile: Projectile ): ProjectileStateObject => {
      return {
        screenIdentifier: projectile.screenIdentifier,
        fieldIdentifier: projectile.fieldIdentifier,
        sampleNumber: projectile.sampleNumber,
        x: projectile.x,
        y: projectile.y,
        type: projectile.type,
        phase: projectile.phase,
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
        stateObject.x,
        stateObject.y,
        stateObject.type,
        stateObject.phase,
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
  x: number;
  y: number;
  type: ProjectileType;
  phase: ProjectilePhase;
  isFlippedHorizontally: boolean;
  landedImageIndex: number;
  timeAirborne: number;
  launchAngle: number;
  launchSpeed: number;
  launchHeight: number;
};

projectileDataLab.register( 'Projectile', Projectile );
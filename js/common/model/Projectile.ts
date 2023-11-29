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

/**
 * Projectile is the model for a projectile in the Projectile Data Lab. It contains information about a projectile's
 * projectile type, launch angle, launch speed, initial height.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class Projectile {

  public screenIdentifier: ScreenIdentifier;

  public fieldNumber: number;

  // The x and y coordinates of the projectile relative to the launch position, in meters
  public x: number;
  public y: number;

  // timeAirborne is the time the projectile has been airborne since launch, in seconds
  public timeAirborne: number;

  // The type of the projectile - CANNONBALL, PUMPKIN or TOY_PIANO
  public type: ProjectileType;

  // Phase of the projectile's flight - LOADED, AIRBORNE, LANDED
  public phase: ProjectilePhase;

  // Initial angle of the projectile in degrees
  public launchAngle: number | null;

  // Initial speed of the projectile in meters per second
  public launchSpeed: number | null;

  // Initial height of the projectile in meters
  public launchHeight: number | null;

  // The horizontal scale of the projectile, 1 for un-flipped, -1 for flipped
  public scaleX: 1 | -1;

  // The index of the image to display when the projectile has landed
  public landedImageIndex: number;

  public constructor(
    fieldNumber: number,
    screenIdentifier: ScreenIdentifier,
    x: number,
    y: number,
    type: ProjectileType,
    phase: ProjectilePhase = 'LOADED',
    scaleX: 1 | -1 = 1,
    landedImageIndex = 0,
    timeAirborne = 0,
    launchAngle: number | null = null,
    launchSpeed: number | null = null,
    launchHeight: number | null = null
  ) {
    this.screenIdentifier = screenIdentifier;
    this.fieldNumber = fieldNumber;
    this.x = x;
    this.y = y;
    this.type = type;
    this.phase = phase;
    this.scaleX = scaleX;
    this.landedImageIndex = landedImageIndex;
    this.timeAirborne = timeAirborne;
    this.launchAngle = launchAngle;
    this.launchSpeed = launchSpeed;
    this.launchHeight = launchHeight;
  }

  public step( field: Field, dt: number ): void {
    if ( this.phase === 'AIRBORNE' || this.phase === 'AIRBORNE_BELOW_FIELD' ) {
      this.timeAirborne += dt;

      this.x = Projectile.getProjectileX( this.launchSpeed!, this.launchAngle!, this.timeAirborne );
      this.y = Projectile.getProjectileY( this.launchSpeed!, this.launchAngle!, this.launchHeight!, this.timeAirborne )!;

      if ( this.phase === 'AIRBORNE' ) {
        if ( this.y <= 0 ) {
          if ( this.x > PDLConstants.MAX_FIELD_DISTANCE ) {
            this.phase = 'AIRBORNE_BELOW_FIELD';
          }
          else {
            this.phase = 'LANDED';
            this.x = Projectile.getHorizontalRange( this.launchSpeed!, this.launchAngle!, this.launchHeight! );
            this.y = 0;
            this.timeAirborne = Projectile.getTotalFlightTime( this.launchSpeed!, this.launchAngle!, this.launchHeight! )!;
          }

          field.projectileLandedEmitter.emit( this );
        }
      }

      if ( this.phase === 'AIRBORNE_BELOW_FIELD' ) {
        if ( this.y <= PDLConstants.BELOW_FIELD_LANDING_Y ) {
          this.phase = 'LANDED';
        }
      }
    }
  }

  public setLanded( field: Field ): void {

    this.phase = 'LANDED';

    let timeAirborne = Projectile.getTotalFlightTime( this.launchSpeed!, this.launchAngle!, this.launchHeight! );
    let landedX = Projectile.getHorizontalRange( this.launchSpeed!, this.launchAngle!, this.launchHeight! );
    let landedY = 0;

    if ( landedX > PDLConstants.MAX_FIELD_DISTANCE ) {
      const deltaHeightToLandBelowField = this.launchHeight! - PDLConstants.BELOW_FIELD_LANDING_Y;
      timeAirborne = Projectile.getTotalFlightTime( this.launchSpeed!, this.launchAngle!, deltaHeightToLandBelowField );
      landedX = Projectile.getProjectileX( this.launchSpeed!, this.launchAngle!, timeAirborne );
      landedY = PDLConstants.BELOW_FIELD_LANDING_Y;
    }

    this.timeAirborne = timeAirborne;
    this.x = landedX;
    this.y = landedY;

    field.projectileLandedEmitter.emit( this );
  }

  public static ProjectileIO = new IOType<Projectile, ProjectileStateObject>( 'ProjectileIO', {
    valueType: Projectile,
    stateSchema: {
      fieldNumber: NumberIO,
      screenIdentifier: StringUnionIO( ScreenIdentifierValues ),

      // TODO: x and y can be derived from everything else, do we really want it in the state? See https://github.com/phetsims/projectile-data-lab/issues/7
      x: NumberIO,
      y: NumberIO,
      type: StringUnionIO( ProjectileTypeValues ),
      phase: StringUnionIO( ProjectilePhaseValues ),
      scaleX: NumberIO,
      landedImageIndex: NumberIO,
      timeAirborne: NumberIO,
      launchAngle: NullableIO( NumberIO ),
      launchSpeed: NullableIO( NumberIO ),
      launchHeight: NullableIO( NumberIO )
    },
    toStateObject: ( projectile: Projectile ): ProjectileStateObject => {
      return {
        screenIdentifier: projectile.screenIdentifier,
        fieldNumber: projectile.fieldNumber,
        x: projectile.x,
        y: projectile.y,
        type: projectile.type,
        phase: projectile.phase,
        scaleX: projectile.scaleX,
        landedImageIndex: projectile.landedImageIndex,
        timeAirborne: projectile.timeAirborne,
        launchAngle: projectile.launchAngle,
        launchSpeed: projectile.launchSpeed,
        launchHeight: projectile.launchHeight
      };
    },
    fromStateObject: ( stateObject: ProjectileStateObject ) => {
      return new Projectile(
        stateObject.fieldNumber,
        stateObject.screenIdentifier,
        stateObject.x,
        stateObject.y,
        stateObject.type,
        stateObject.phase,
        stateObject.scaleX,
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

  // TODO: launchHeight could be inferred from the launcher configuration. See https://github.com/phetsims/projectile-data-lab/issues/7
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
  fieldNumber: number;
  x: number;
  y: number;
  type: ProjectileType;
  phase: ProjectilePhase;
  scaleX: 1 | -1;
  landedImageIndex: number;
  timeAirborne: number;
  launchAngle: number | null;
  launchSpeed: number | null;
  launchHeight: number | null;
};

projectileDataLab.register( 'Projectile', Projectile );
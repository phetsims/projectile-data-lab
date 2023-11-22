// Copyright 2023, University of Colorado Boulder

import { ProjectileType, ProjectileTypeValues } from './ProjectileType.js';
import { ProjectilePhase, ProjectilePhaseValues } from './ProjectilePhase.js';
import projectileDataLab from '../../projectileDataLab.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import PDLUtils from '../PDLUtils.js';

/**
 * Projectile is the model for a projectile in the Projectile Data Lab. It contains information about a projectile's
 * projectile type, launch angle, launch speed, initial height.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class Projectile {

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

  public step( dt: number ): void {
    if ( this.phase === 'AIRBORNE' ) {
      this.timeAirborne += dt;

      this.x = PDLUtils.getProjectileX( this.launchSpeed!, this.launchAngle!, this.timeAirborne );
      this.y = PDLUtils.getProjectileY( this.launchSpeed!, this.launchAngle!, this.launchHeight!, this.timeAirborne )!;

      const horizontalRange = PDLUtils.getHorizontalRange( this.launchSpeed!, this.launchAngle!, this.launchHeight! );
      if ( this.x >= horizontalRange ) {
        this.phase = 'LANDED';
        this.x = horizontalRange;
        this.y = 0;
        this.timeAirborne = PDLUtils.getTotalFlightTime( this.launchSpeed!, this.launchAngle!, this.launchHeight! )!;
      }
    }
  }

  public static ProjectileIO = new IOType<Projectile, ProjectileStateObject>( 'ProjectileIO', {
    valueType: Projectile,
    stateSchema: {

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
}

export type ProjectileStateObject = {
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
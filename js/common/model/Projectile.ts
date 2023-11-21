// Copyright 2023, University of Colorado Boulder

import { ProjectileType } from './ProjectileType.js';
import { ProjectilePhase } from './ProjectilePhase.js';
import projectileDataLab from '../../projectileDataLab.js';

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
}

projectileDataLab.register( 'Projectile', Projectile );
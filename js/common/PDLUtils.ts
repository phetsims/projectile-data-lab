// Copyright 2023, University of Colorado Boulder

/**
 * Utilities used throughout this simulation.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../projectileDataLab.js';
import Vector2 from '../../../dot/js/Vector2.js';
import PDLConstants from './PDLConstants.js';

export default class PDLUtils {
  public static transformField( point: Vector2 ): Vector2 {
    const pointY = point.y + PDLConstants.FIELD_SCALING_FACTOR_VERTICAL * Math.abs( point.y );
    const horizontalDistanceFactor = point.x / ( 0.5 * PDLConstants.FIELD_WIDTH );
    const verticalDistanceFactor = pointY / ( 0.5 * PDLConstants.FIELD_HEIGHT );
    return new Vector2(
      point.x + PDLConstants.FIELD_SCALING_FACTOR_HORIZONTAL * horizontalDistanceFactor * verticalDistanceFactor,
      pointY );
  }

  public static getProjectileX( launchSpeed: number, launchAngle: number, timeAirborne: number ): number {
    const launchAngleRadians = launchAngle * Math.PI / 180;
    return launchSpeed * Math.cos( launchAngleRadians ) * timeAirborne;
  }

  public static getProjectileY( launchSpeed: number, launchAngle: number, launchHeight: number, timeAirborne: number ): number {
    const launchAngleRadians = launchAngle * Math.PI / 180;
    return launchHeight + launchSpeed * Math.sin( launchAngleRadians ) * timeAirborne
           - 0.5 * PDLConstants.FREEFALL_ACCELERATION * timeAirborne * timeAirborne;
  }

  // TODO: This could be inferred from the field itself. See https://github.com/phetsims/projectile-data-lab/issues/7
  public static getHorizontalRange( launchSpeed: number, launchAngle: number, launchHeight: number ): number {
    const launchAngleRadians = launchAngle * Math.PI / 180;
    const g = PDLConstants.FREEFALL_ACCELERATION;
    const v0 = launchSpeed;
    const sinTheta = Math.sin( launchAngleRadians );
    const cosTheta = Math.cos( launchAngleRadians );

    return ( v0 * cosTheta / g ) * ( v0 * sinTheta + Math.sqrt( v0 * v0 * sinTheta * sinTheta + 2 * g * launchHeight ) );
  }

  public static getMaximumHeight( launchSpeed: number, launchAngle: number, launchHeight: number ): number {
    if ( launchAngle <= 0 ) {
      return launchHeight;
    }
    else {
      const launchAngleRadians = launchAngle * Math.PI / 180;
      const g = PDLConstants.FREEFALL_ACCELERATION;
      const v0 = launchSpeed;
      const sinTheta = Math.sin( launchAngleRadians );
      return launchHeight + v0 * v0 * sinTheta * sinTheta / ( 2 * g );
    }
  }

  public static getTotalFlightTime( launchSpeed: number, launchAngle: number, launchHeight: number ): number | null {
    const launchAngleRadians = launchAngle * Math.PI / 180;
    const g = PDLConstants.FREEFALL_ACCELERATION;
    const v0 = launchSpeed;
    const sinTheta = Math.sin( launchAngleRadians );
    return ( v0 * sinTheta / g ) + Math.sqrt( ( v0 * sinTheta / g ) * ( v0 * sinTheta / g ) + 2 * launchHeight / g );
  }
}
projectileDataLab.register( 'PDLUtils', PDLUtils );
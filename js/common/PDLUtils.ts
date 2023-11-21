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

  public static getProjectileY( launchSpeed: number, launchAngle: number, launchHeight: number, timeAirborne: number ): number | null {
    const launchAngleRadians = launchAngle * Math.PI / 180;
    return launchHeight + launchSpeed * Math.sin( launchAngleRadians ) * timeAirborne
           - 0.5 * PDLConstants.FREEFALL_ACCELERATION * timeAirborne * timeAirborne;
  }

  public static getHorizontalRange( launchSpeed: number, launchAngle: number, launchHeight: number ): number | null {
    if ( launchHeight !== 0 ) {
      assert && assert( launchAngle === 0, 'Launch angle must equal zero when launch height is nonzero' );
      return launchSpeed * Math.sqrt( 2 * launchHeight / PDLConstants.FREEFALL_ACCELERATION );
    }
    else {
      const launchAngleRadians = launchAngle * Math.PI / 180;
      return launchSpeed * launchSpeed * Math.sin( 2 * launchAngleRadians ) / PDLConstants.FREEFALL_ACCELERATION;
    }
  }

  public static getMaximumHeight( launchSpeed: number, launchAngle: number, launchHeight: number ): number | null {
    if ( launchHeight !== 0 ) {
      assert && assert( launchAngle === 0, 'Launch angle must equal zero when launch height is nonzero' );
      return launchHeight;
    }
    else {
      const launchAngleRadians = launchAngle * Math.PI / 180;
      return launchSpeed * launchSpeed * Math.sin( launchAngleRadians ) * Math.sin( launchAngleRadians ) / ( 2 * PDLConstants.FREEFALL_ACCELERATION );
    }
  }

  public static getTotalFlightTime( launchSpeed: number, launchAngle: number, launchHeight: number ): number | null {
    if ( launchHeight !== 0 ) {
      assert && assert( launchAngle === 0, 'Launch angle must equal zero when launch height is nonzero' );
      return Math.sqrt( 2 * launchHeight / PDLConstants.FREEFALL_ACCELERATION );
    }
    else {
      const launchAngleRadians = launchAngle * Math.PI / 180;
      return 2 * launchSpeed * Math.sin( launchAngleRadians ) / PDLConstants.FREEFALL_ACCELERATION;
    }
  }
}
projectileDataLab.register( 'PDLUtils', PDLUtils );
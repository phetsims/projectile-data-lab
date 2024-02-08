// Copyright 2023, University of Colorado Boulder

/**
 * Utilities used throughout this simulation.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../projectileDataLab.js';
import Vector2 from '../../../dot/js/Vector2.js';
import PDLConstants from './PDLConstants.js';
import { Color } from '../../../scenery/js/imports.js';
import PDLColors from './PDLColors.js';
import { VSMFieldIdentifierValues } from '../common-vsm/model/VSMFieldIdentifier.js';
import { SAMPLE_SIZES } from '../sampling/model/SamplingModel.js';

export default class PDLUtils {
  public static transformField( point: Vector2 ): Vector2 {
    const pointY = point.y + PDLConstants.FIELD_SCALING_FACTOR_VERTICAL * Math.abs( point.y );
    const horizontalDistanceFactor = point.x / ( 0.5 * PDLConstants.FIELD_WIDTH );
    const verticalDistanceFactor = pointY / ( 0.5 * PDLConstants.FIELD_HEIGHT );
    return new Vector2(
      point.x + PDLConstants.FIELD_SCALING_FACTOR_HORIZONTAL * horizontalDistanceFactor * verticalDistanceFactor,
      pointY );
  }

  public static colorForFieldIndex( index: number ): Color {
    return PDLColors.fieldFill1ColorProperty.value.blend(
      PDLColors.fieldFill2ColorProperty.value, index / ( VSMFieldIdentifierValues.length - 1 ) );
  }

  public static colorForSampleSize( sampleSize: number ): Color {
    const index = SAMPLE_SIZES.indexOf( sampleSize );

    return PDLColors.fieldFill1ColorProperty.value.blend(
      PDLColors.fieldFill2ColorProperty.value, index / ( SAMPLE_SIZES.length - 1 ) );
  }
}
projectileDataLab.register( 'PDLUtils', PDLUtils );
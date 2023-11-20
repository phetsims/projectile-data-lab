// Copyright 2023, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../projectileDataLab.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';

const maxFieldDistance = 100;
const fieldWidth = 880;
const pixelsToDistance = fieldWidth / maxFieldDistance;

const PDLConstants = {

  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  // In field units
  MAX_FIELD_DISTANCE: maxFieldDistance,
  FIELD_LINE_NUMBER_INCREMENT: 10,
  RAISED_LAUNCHER_HEIGHT: 15,

  // In view units
  FIELD_CENTER_OFFSET_X: 32,
  FIELD_CENTER_Y: 495,
  FIELD_HEIGHT: 50,
  FIELD_WIDTH: fieldWidth,
  FIELD_BORDER_LINE_WIDTH: 3,
  FIELD_CENTER_LINE_WIDTH: 2.5,
  FIELD_LINE_WIDTH: 2,
  FIELD_LINE_NUMBERED_WIDTH: 2.5,
  FIELD_LABEL_TOP_MARGIN: 3,

  // This is a value between 0-Number.POSITIVE_INFINITY. A value of 0 would mean the left and right edges are parallel.
  // The more extreme the value is, the more the left and right edges angle inward.  A point on the center line will
  // be offset by this amount
  FIELD_SCALING_FACTOR_HORIZONTAL: 18,

  // This is a value between 0-1.
  // 0 would mean the top and bottom halves of the same field have the same height.
  // 1 would mean the entire field is shown below the center line.
  // So this controls the amount of "squishing" for the perspective transformation.
  FIELD_SCALING_FACTOR_VERTICAL: 0.2,

  PIXELS_TO_DISTANCE: pixelsToDistance,

  PRIMARY_FONT: new PhetFont( 16 )
} as const;

projectileDataLab.register( 'PDLConstants', PDLConstants );
export default PDLConstants;
// Copyright 2023, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../projectileDataLab.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';

const maxFieldDistance = 100;
const fieldWidth = 870;
const pixelsToDistance = fieldWidth / maxFieldDistance;

const PDLConstants = {

  SCREEN_VIEW_X_MARGIN: 10,
  SCREEN_VIEW_Y_MARGIN: 10,

  // In field units
  MAX_FIELD_DISTANCE: maxFieldDistance,
  FIELD_LINE_NUMBER_INCREMENT: 10,
  RAISED_LAUNCHER_HEIGHT: 15,
  FREEFALL_ACCELERATION: 9.8,

  // In view units
  FIELD_CENTER_OFFSET_X: 32,
  FIELD_CENTER_Y: 500,
  FIELD_HEIGHT: 40,
  FIELD_WIDTH: fieldWidth,
  FIELD_BORDER_LINE_WIDTH: 2,
  FIELD_CENTER_LINE_WIDTH: 2,
  FIELD_LINE_WIDTH: 2,
  FIELD_LINE_NUMBERED_WIDTH: 2.5,
  FIELD_LABEL_TOP_MARGIN: 2,
  FIELD_SIGN_CENTER_Y: 445,

  // Horizontal scaling controls the amount of x-offset applied to each point for the perspective transformation.
  // FIELD_SCALING_FACTOR_HORIZONTAL can be any value between 0-Number.POSITIVE_INFINITY.
  // 0 would mean the left and right edges are parallel.
  // The larger the value, the more the left and right edges angle inward.
  // The value represents the maximum x-offset of points furthest from the center.
  FIELD_SCALING_FACTOR_HORIZONTAL: 18,

  // Vertical scaling controls the amount of "squishing" for the perspective transformation.
  // FIELD_SCALING_FACTOR_VERTICAL must be between 0-1.
  // 0 means the top and bottom halves of the same field have the same height.
  // 1 means the entire field is shown below the center line.
  FIELD_SCALING_FACTOR_VERTICAL: 0.25,

  PIXELS_TO_DISTANCE: pixelsToDistance,

  PRIMARY_FONT: new PhetFont( 13 ),
  FIELD_LABEL_FONT: new PhetFont( 16 ),
  LAUNCH_CONTROL_FONT: new PhetFont( 15 ),

  INTER_PANEL_VERTICAL_SPACING: 5
} as const;

projectileDataLab.register( 'PDLConstants', PDLConstants );
export default PDLConstants;
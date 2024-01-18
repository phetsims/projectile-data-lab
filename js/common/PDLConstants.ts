// Copyright 2023-2024, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../projectileDataLab.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Range from '../../../dot/js/Range.js';

const maxFieldDistance = 100;
const fieldWidth = 850;
const pixelsToDistance = fieldWidth / maxFieldDistance;

const maxAngleStandardDeviation = 8; // degrees

const PDLConstants = {

  SCREEN_VIEW_X_MARGIN: 8,
  SCREEN_VIEW_Y_MARGIN: 8,
  BOTTOM_UI_HEIGHT: 55,
  INTER_PANEL_SPACING: 4,
  BOTTOM_UI_SPACING: 20,

  MINIMUM_TIME_BETWEEN_LAUNCHES: 0.7, // seconds
  MAX_ANGLE_STANDARD_DEVIATION: maxAngleStandardDeviation, // degrees

  // This is the multiple of launch angle standard deviations to use for the gap of the angle stabilizer.
  ANGLE_STABILIZER_NUM_STANDARD_DEVIATIONS: 3,

  // In field units
  MAX_FIELD_DISTANCE: maxFieldDistance,
  RAISED_LAUNCHER_HEIGHT: 12,
  FREEFALL_ACCELERATION: 9.81,
  FIELD_LABEL_INCREMENT: 10,

  // In view units
  FIELD_CENTER_OFFSET_X: 44,
  FIELD_CENTER_Y: 510,
  FIELD_HEIGHT: 40,
  FIELD_WIDTH: fieldWidth,
  FIELD_BORDER_LINE_WIDTH: 2,
  FIELD_CENTER_LINE_WIDTH: 2,
  FIELD_LINE_WIDTH: 1.5,
  FIELD_LINE_NUMBERED_WIDTH: 2,
  FIELD_LABEL_TOP_MARGIN: 1,
  FIELD_SIGN_X: 86,
  SAMPLING_FIELD_SIGN_X: 88,
  FIELD_SIGN_CENTER_Y: 458,
  FIELD_SIGN_PROJECTILE_SELECTOR_SEPARATION: 8,
  HISTOGRAM_PANEL_MARGIN: 5,

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

  // The factor multiple for time speed in 'Fast' mode
  TIME_SPEED_FAST: 6,

  SPRING_SPEED_MEAN: 25,
  SPRING_SPEED_SD: 0.3,
  PRESSURE_SPEED_MEAN: 25,
  PRESSURE_SPEED_SD: 0.6,
  EXPLOSION_SPEED_MEAN: 25,
  EXPLOSION_SPEED_SD: 1.2,

  // The projectile source images are scaled by this factor when drawing them on the canvas
  PROJECTILE_IMAGE_SCALE_FACTOR: 0.15,

  HEATMAP_TOOL_LABEL_FONT: new PhetFont( { size: 11 } ),
  PRIMARY_FONT: new PhetFont( { size: 13 } ),
  FIELD_LABEL_FONT: new PhetFont( { size: 15 } ),
  FIELD_SIGN_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
  FIELD_SIGN_COUNT_FONT: new PhetFont( { size: 15, weight: 'bold' } ),
  LAUNCH_CONTROL_FONT: new PhetFont( { size: 15 } ),
  NO_AIR_RESISTANCE_FONT: new PhetFont( { size: 15 } ),
  MEASURING_TAPE_FONT: new PhetFont( { size: 13, weight: 'bold' } ),
  INTERVAL_TOOL_FONT: new PhetFont( { size: 15 } ),
  SELECTOR_FONT: new PhetFont( { size: 14 } ),
  HISTOGRAM_PANEL_FONT: new PhetFont( { size: 12 } ),

  ANGLE_STABILIZER_RANGE: new Range( 0, maxAngleStandardDeviation ),

  // Allow the top content to go above the dev bounds, but not too far
  ABOVE_DEV_BOUNDS_TOP: -200
} as const;

projectileDataLab.register( 'PDLConstants', PDLConstants );
export default PDLConstants;
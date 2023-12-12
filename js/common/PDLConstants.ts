// Copyright 2023, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../projectileDataLab.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import PresetLauncherConfiguration from './PresetLauncherConfiguration.js';
import Range from '../../../dot/js/Range.js';

const maxFieldDistance = 100;
const fieldWidth = 850;
const pixelsToDistance = fieldWidth / maxFieldDistance;

const MAX_ANGLE_STANDARD_DEVIATION = 8; // degrees

const PDLConstants = {

  SCREEN_VIEW_X_MARGIN: 8,
  SCREEN_VIEW_Y_MARGIN: 8,
  BOTTOM_UI_HEIGHT: 55,
  INTER_PANEL_SPACING: 5,
  BOTTOM_UI_SPACING: 20,

  MAX_PROJECTILES_PER_FIELD: 500,
  MINIMUM_TIME_BETWEEN_LAUNCHES: 0.4, // seconds
  MAX_ANGLE_STANDARD_DEVIATION: MAX_ANGLE_STANDARD_DEVIATION, // degrees

  // This is the multiple of launch angle standard deviations to use for the gap of the angle stabilizer.
  ANGLE_STABILIZER_NUM_STANDARD_DEVIATIONS: 3,

  // In field units
  MAX_FIELD_DISTANCE: maxFieldDistance,
  RAISED_LAUNCHER_HEIGHT: 15,
  FREEFALL_ACCELERATION: 9.81,
  FIELD_LABEL_INCREMENT: 10,

  // In view units
  FIELD_CENTER_OFFSET_X: 44,
  FIELD_CENTER_Y: 500,
  FIELD_HEIGHT: 40,
  FIELD_WIDTH: fieldWidth,
  FIELD_BORDER_LINE_WIDTH: 2,
  FIELD_CENTER_LINE_WIDTH: 2,
  FIELD_LINE_WIDTH: 2,
  FIELD_LINE_NUMBERED_WIDTH: 2.5,
  FIELD_LABEL_TOP_MARGIN: 1,
  FIELD_SIGN_CENTER_Y: 447,
  FIELD_SIGN_AIR_RESISTANCE_TEXT_SEPARATION: 48,

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

  SPRING_SPEED_MEAN: 25,
  SPRING_SPEED_SD: 0.8,
  PRESSURE_SPEED_MEAN: 25,
  PRESSURE_SPEED_SD: 1.6,
  EXPLOSION_SPEED_MEAN: 20,
  EXPLOSION_SPEED_SD: 4,

  LAUNCHER_CONFIGS: [
    new PresetLauncherConfiguration( 'SPRING', 2 ),
    new PresetLauncherConfiguration( 'SPRING', 8 ),
    new PresetLauncherConfiguration( 'EXPLOSION', 0 ),
    new PresetLauncherConfiguration( 'PRESSURE', 2 ),
    new PresetLauncherConfiguration( 'PRESSURE', 4 ),
    new PresetLauncherConfiguration( 'EXPLOSION', 8 )
  ],

  // The projectile source images are scaled by this factor when drawing them on the canvas
  PROJECTILE_IMAGE_SCALE_FACTOR: 0.15,

  HEATMAP_TOOL_LABEL_FONT: new PhetFont( 11 ),
  PRIMARY_FONT: new PhetFont( 13 ),
  FIELD_LABEL_FONT: new PhetFont( 15 ),
  LAUNCH_CONTROL_FONT: new PhetFont( 15 ),
  NO_AIR_RESISTANCE_FONT: new PhetFont( 15 ),
  MEASURING_TAPE_FONT: new PhetFont( { size: 13, weight: 'bold' } ),

  ANGLE_STABILIZER_RANGE: new Range( 0, MAX_ANGLE_STANDARD_DEVIATION ),

  // Allow the top content to go above the dev bounds, but not too far
  ABOVE_DEV_BOUNDS_TOP: -200
} as const;

projectileDataLab.register( 'PDLConstants', PDLConstants );
export default PDLConstants;
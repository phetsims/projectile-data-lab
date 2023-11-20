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

  FIELD_SCALING_FACTOR_HORIZONTAL: 18,
  FIELD_SCALING_FACTOR_VERTICAL: 0.2,

  PIXELS_TO_DISTANCE: pixelsToDistance,

  PRIMARY_FONT: new PhetFont( 16 )
} as const;

projectileDataLab.register( 'PDLConstants', PDLConstants );
export default PDLConstants;
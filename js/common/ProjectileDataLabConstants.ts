// Copyright 2023, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../projectileDataLab.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';

const ProjectileDataLabConstants = {

  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  MAX_FIELD_DISTANCE: 100, // In field units

  FIELD_CENTER_OFFSET_X: 50,
  FIELD_CENTER_Y: 500,
  FIELD_HEIGHT: 50,
  FIELD_WIDTH: 880, // In view units
  FIELD_BORDER_LINE_WIDTH: 3,

  PRIMARY_FONT: new PhetFont( 16 )
} as const;

projectileDataLab.register( 'ProjectileDataLabConstants', ProjectileDataLabConstants );
export default ProjectileDataLabConstants;
// Copyright 2024, University of Colorado Boulder

/**
 * isResettingAllProperty is a global Property that is true while a 'reset all' is in progress.
 * It is intended to be added to the ResetAllButton in a ScreenView like this:
 *
 * new ResetAllButton( {
 *   listener: () => {
 *     isResettingAllProperty.value = true;
 *     ... // Reset things here.
 *     isResettingAllProperty.value = false;
 *   }
 * } );
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import projectileDataLab from '../../projectileDataLab.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

const isResettingAllProperty = new BooleanProperty( false );

projectileDataLab.register( 'isResettingAllProperty', isResettingAllProperty );

export default isResettingAllProperty;
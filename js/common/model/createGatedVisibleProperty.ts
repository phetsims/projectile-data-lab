// Copyright 2023, University of Colorado Boulder

/**
 * The `createGatedVisibleProperty` function abstracts the process of creating a "gated" visibility Property
 * designed for PhET-iO integration. This method comes in handy when an object's visibility is already controlled
 * within the simulation, but there is a need to grant additional visibility control to an external entity,
 * such as a studio or a PhET-iO client.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

// TODO: Move this to a new home - see https://github.com/phetsims/projectile-data-lab/issues/171

import Tandem from '../../../../tandem/js/Tandem.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';

export const createGatedVisibleProperty = ( visibleProperty: TReadOnlyProperty<boolean>, tandem: Tandem, selfVisiblePropertyOptions?: PhetioObjectOptions ): TReadOnlyProperty<boolean> => {
  return DerivedProperty.and( [ visibleProperty, new BooleanProperty( true, combineOptions<PhetioObjectOptions>( {
    tandem: tandem.createTandem( 'selfVisibleProperty' ),
    phetioFeatured: true
  }, selfVisiblePropertyOptions ) ) ], {
    tandem: tandem.createTandem( 'visibleProperty' ),
    phetioValueType: BooleanIO
  } );
};

projectileDataLab.register( 'createGatedVisibleProperty', createGatedVisibleProperty );
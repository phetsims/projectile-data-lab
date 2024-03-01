// Copyright 2024, University of Colorado Boulder

/**
 * PDLPreferences defines the simulation-specific preferences for Projectile Data Lab. Initial values are taken from
 * the corresponding query parameters.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Tandem from '../../../tandem/js/Tandem.js';
import StringUnionProperty from '../../../axon/js/StringUnionProperty.js';
import { BinStrategy, BinStrategyValues } from './BinStrategy.js';
import { BooleanProperty } from '../../../axon/js/imports.js';
import PDLQueryParameters from './PDLQueryParameters.js';
import projectileDataLab from '../projectileDataLab.js';
import { LaunchSoundStrategy, LaunchSoundStrategyValues } from './LaunchSoundStrategy.js';

const PDLPreferences = {

  autoGenerateDataProperty: new BooleanProperty( PDLQueryParameters.autoGenerateData, {
    tandem: Tandem.PREFERENCES.createTandem( 'autoGenerateDataProperty' ),
    phetioFeatured: true,
    phetioDocumentation: 'When true, the data is instantly and automatically generated when the launch button is pressed.'
  } ),

  projectileTypeAffectsSpeedProperty: new BooleanProperty( PDLQueryParameters.projectileTypeAffectsSpeed, {
    tandem: Tandem.PREFERENCES.createTandem( 'projectileTypeAffectsSpeedProperty' ),
    phetioFeatured: true,
    phetioDocumentation: 'When true, the projectile type affects its mean launch speed.'
  } ),

  // phet-types.d.ts does not support inferring string union types for string query parameters, so we need to cast
  binStrategyProperty: new StringUnionProperty<BinStrategy>( PDLQueryParameters.binStrategy as BinStrategy, {
    validValues: BinStrategyValues,
    tandem: Tandem.PREFERENCES.createTandem( 'binStrategyProperty' ),
    phetioFeatured: true,
    phetioDocumentation: 'Indicates whether the histogram bins are sized based on the bin width or the number of bins.'
  } ),

  showStandardErrorProperty: new BooleanProperty( PDLQueryParameters.showStandardError, {
    tandem: Tandem.PREFERENCES.createTandem( 'showStandardErrorProperty' ),
    phetioFeatured: true,
    phetioDocumentation: 'When true, the standard error is displayed in the histogram values display on the Measures screen.'
  } ),

  // phet-types.d.ts does not support inferring string union types for string query parameters, so we need to cast
  launchSoundStrategyProperty: new StringUnionProperty<LaunchSoundStrategy>( PDLQueryParameters.launchSoundStrategy as LaunchSoundStrategy, {
    validValues: LaunchSoundStrategyValues,
    tandem: Tandem.PREFERENCES.createTandem( 'launchSoundStrategyProperty' ),
    phetioFeatured: true,
    phetioDocumentation: 'Indicates whether the launch sound is based on the initial speed or initial angle of the projectile, or if there is none.'
  } )
};

projectileDataLab.register( 'PDLPreferences', PDLPreferences );

export default PDLPreferences;
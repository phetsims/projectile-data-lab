// Copyright 2023-2024, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import projectileDataLab from '../projectileDataLab.js';
import { BinStrategyValues } from './BinStrategy.js';
import { LaunchSoundStrategyValues } from './LaunchSoundStrategy.js';
import PDLConstants from './PDLConstants.js';
import packageJSON from '../../../joist/js/packageJSON.js';

const SCHEMA_MAP = {

  /**
   * Whether to auto-generate data for the simulation.
   * - This is false by default, which means the user watches the data set accumulate.
   * - When true, this automatically generates a full set of data when the launch button is pressed. If the
   * launch button is pressed when there is already a full set of data, the data is cleared and regenerated.
   *
   * This is connected to a PhET-iO instrumented Property and can be controlled via the Preferences dialog.
   * See https://github.com/phetsims/projectile-data-lab/issues/146
   */
  autoGenerateData: {
    type: 'boolean' as const,
    defaultValue: false,
    public: true
  },

  /**
   * Whether the selected projectile type affects the speed.
   * - When true (the default), pumpkins, pianos and cannonballs have different launch speeds.
   * - When false, all projectiles have the same launch speed.
   *
   * This is connected to a PhET-iO instrumented Property and can be controlled via the Preferences dialog.
   * See https://github.com/phetsims/projectile-data-lab/issues/142
   */
  projectileTypeAffectsSpeed: {
    type: 'boolean' as const,
    defaultValue: true,
    public: true
  },

  /**
   * The user can choose whether to size the histogram bins based by width or by the total number of bins.
   *
   * This is connected to a PhET-iO instrumented Property and can be controlled via the Preferences dialog.
   * The design for this feature is described in https://docs.google.com/document/d/1I5duB_wwUMS4FhsZWjQYNGkjTjrVh6EfvUL6BrjBgJU/edit#heading=h.n822sfez56x8
   */
  histogramBins: {
    type: 'string' as const,

    // If a user were to copy the histogramBins query parameter from PDL and paste it into PSD, the number of bins would
    // be inaccurate. To prevent this, the validValues are restricted to 'binWidth' for PSD. This line ensures that if
    // a user tried to do this, we will intentionally alert the user that this is not allowed in PSD.
    validValues: packageJSON.name === 'projectile-data-lab' ? BinStrategyValues : [ 'binWidth' ],
    defaultValue: 'binWidth',
    public: true
  },

  /**
   * The user can choose whether to show the standard error on the histogram 'Values' panel.
   *
   * This is connected to a PhET-iO instrumented Property and can be controlled via the Preferences dialog.
   * The design for this feature is described in https://github.com/phetsims/projectile-data-lab/issues/74
   */
  showStandardError: {
    type: 'boolean' as const,
    defaultValue: false,
    public: true
  },

  /**
   * The strategy for playing a sound when a projectile is launched. The pitch of the sound can be based on the
   * launch speed, the launch angle, or no sound can be played.
   *
   * This is connected to a PhET-iO instrumented Property and can be controlled via the Preferences dialog.
   * The design for this feature is described in https://github.com/phetsims/projectile-data-lab/issues/205
   */
  launchSound: {
    type: 'string' as const,
    validValues: LaunchSoundStrategyValues,
    defaultValue: 'speed',
    public: true
  },

  /**
   * Whether a sound is played when a projectile lands.
   *
   * This is connected to a PhET-iO instrumented Property and can be controlled via the Preferences dialog.
   * The design for this feature is described in https://github.com/phetsims/projectile-data-lab/issues/238
   */
  playLandingSound: {
    type: 'boolean' as const,
    defaultValue: true,
    public: true
  },

  // The maximum number of Projectiles per field for the VSM screens, to streamline testing and development.
  maxProjectilesVSMField: {
    type: 'number' as const,
    defaultValue: PDLConstants.MAX_PROJECTILES_VSM_FIELD_DEFAULT,
    public: false
  },

  // The maximum number of samples per field for the Sampling screen, to streamline testing and development.
  maxSamples: {
    type: 'number' as const,
    defaultValue: 200,
    public: false
  }
};

const PDLQueryParameters = QueryStringMachine.getAll( SCHEMA_MAP );

// The schema map is a read-only part of the public API, in case schema details (e.g. validValues) are needed elsewhere.
PDLQueryParameters.SCHEMA_MAP = SCHEMA_MAP;

projectileDataLab.register( 'PDLQueryParameters', PDLQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.projectileDataLab.PDLQueryParameters' );

export default PDLQueryParameters;
// Copyright 2023-2024, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import projectileDataLab from '../projectileDataLab.js';
import Tandem from '../../../tandem/js/Tandem.js';
import StringUnionProperty from '../../../axon/js/StringUnionProperty.js';
import { BinStrategy, BinStrategyValues } from './BinStrategy.js';

const SCHEMA_MAP = {
  binStrategy: {
    type: 'string' as const,
    validValues: BinStrategyValues,
    defaultValue: 'binWidth',
    public: true
  },

  // Per field for VSM, for testing.
  maxProjectiles: {
    type: 'number' as const,
    defaultValue: 500,
    public: false
  },

  // Max per field for Sampling, for testing.
  maxSamples: {
    type: 'number' as const,
    defaultValue: 200,
    public: false
  }
};

const PDLQueryParameters = QueryStringMachine.getAll( SCHEMA_MAP );

// phet-types.d.ts does not support inferring string union types for string query parameters, so we need to cast
const binStrategy = PDLQueryParameters.binStrategy as BinStrategy;

// the top checkboxes are left aligned with the play area checkboxes, so their max width is smaller to accommodate
// for the accordion box margin
export const BIN_STRATEGY_PROPERTY = new StringUnionProperty<BinStrategy>( binStrategy, {
  validValues: BinStrategyValues,
  tandem: Tandem.PREFERENCES.createTandem( 'binStrategyProperty' ),
  phetioFeatured: true
} );

// The schema map is a read-only part of the public API, in case schema details (e.g. validValues) are needed elsewhere.
PDLQueryParameters.SCHEMA_MAP = SCHEMA_MAP;

projectileDataLab.register( 'PDLQueryParameters', PDLQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.projectileDataLab.PDLQueryParameters' );

export default PDLQueryParameters;
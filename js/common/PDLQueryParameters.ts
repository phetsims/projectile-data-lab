// Copyright 2023, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import projectileDataLab from '../projectileDataLab.js';

const SCHEMA_MAP = {
  // TODO add schemas for query parameters, see https://github.com/phetsims/projectile-data-lab/issues/4
  // Should this be validValues: histogram: [ 'binWidth', 'numberOfBins' ]?
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
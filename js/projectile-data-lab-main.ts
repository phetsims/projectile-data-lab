// Copyright 2023, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import ProjectileDataLabStrings from './ProjectileDataLabStrings.js';
import './common/ProjectileDataLabQueryParameters.js';
import VariabilityScreen from './variability/VariabilityScreen.js';
import SourcesScreen from './sources/SourcesScreen.js';
import MeasuresScreen from './measures/MeasuresScreen.js';
import SamplingScreen from './sampling/SamplingScreen.js';

// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded. See https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461
simLauncher.launch( () => {

  const titleStringProperty = ProjectileDataLabStrings[ 'projectile-data-lab' ].titleStringProperty;

  const screens = [
    new VariabilityScreen( { tandem: Tandem.ROOT.createTandem( 'variabilityScreen' ) } ),
    new SourcesScreen( { tandem: Tandem.ROOT.createTandem( 'sourcesScreen' ) } ),
    new MeasuresScreen( { tandem: Tandem.ROOT.createTandem( 'measuresScreen' ) } ),
    new SamplingScreen( { tandem: Tandem.ROOT.createTandem( 'samplingScreen' ) } )
  ];

  const options: SimOptions = {

    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode, see https://github.com/phetsims/projectile-data-lab/issues/3
    credits: {
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      contributors: '',
      qualityAssurance: '',
      graphicArts: '',
      soundDesign: '',
      thanks: ''
    }
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );
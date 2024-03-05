// Copyright 2023-2024, University of Colorado Boulder

/**
 * The SamplingLaunchPanel allows the user to select the launcher and sample size.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import { Node } from '../../../../scenery/js/imports.js';
import SampleSizeSection from './SampleSizeSection.js';
import { PDLLaunchPanel, PDLLaunchPanelOptions } from '../../common/view/PDLLaunchPanel.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import MysteryLauncherSection from '../../common/view/MysteryLauncherSection.js';
import Launcher from '../../common/model/Launcher.js';

type SelfOptions = EmptySelfOptions;
type SamplingLaunchPanelOptions = SelfOptions & PDLLaunchPanelOptions;

export default class SamplingLaunchPanel extends PDLLaunchPanel {

  public constructor( launcherProperty: PhetioProperty<Launcher>, sampleSizeProperty: Property<number>, providedOptions: SamplingLaunchPanelOptions ) {
    const launcherSection = new MysteryLauncherSection( launcherProperty, {
      tandem: providedOptions.tandem.createTandem( 'launcherSection' )
    } );

    const sampleSizeSection = new SampleSizeSection( sampleSizeProperty, {
      tandem: providedOptions.tandem.createTandem( 'sampleSizeSection' )
    } );

    const content: Node[] = [ launcherSection, sampleSizeSection ];

    const options = optionize<SamplingLaunchPanelOptions, SelfOptions, PDLLaunchPanelOptions>()( {
      yMargin: 8
    }, providedOptions );

    super( content, options );
  }
}
projectileDataLab.register( 'SamplingLaunchPanel', SamplingLaunchPanel );

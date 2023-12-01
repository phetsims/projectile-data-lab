// Copyright 2023, University of Colorado Boulder

import { PDLPanelOptions } from '../../common/view/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import { Node } from '../../../../scenery/js/imports.js';
import SampleSizeSection from './SampleSizeSection.js';
import { PDLLaunchPanel } from '../../common/view/PDLLaunchPanel.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import SectionLauncherType from '../../common/view/SectionLauncherType.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SamplingLaunchPanelOptions = SelfOptions & PDLPanelOptions;

export default class SamplingLaunchPanel extends PDLLaunchPanel {

  public constructor( launcherProperty: PhetioProperty<number>, sampleSizeProperty: Property<number>, providedOptions: SamplingLaunchPanelOptions ) {
    const launcherTypeSection = new SectionLauncherType( launcherProperty, {
      tandem: providedOptions.tandem
    } );

    const sampleSizeSection = new SampleSizeSection( sampleSizeProperty, {
      tandem: providedOptions.tandem
    } );

    const content: Node[] = [ launcherTypeSection, sampleSizeSection ];

    super( content, providedOptions );
  }
}
projectileDataLab.register( 'SamplingLaunchPanel', SamplingLaunchPanel );

// Copyright 2023, University of Colorado Boulder

import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import { Color, HSeparator, Node } from '../../../../scenery/js/imports.js';
import SampleSizeSection from '../../sources/view/SampleSizeSection.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SamplingLaunchPanelOptions = SelfOptions & PDLPanelOptions;

export default class SamplingLaunchPanel extends PDLPanel {

  public constructor( launcherProperty: Property<number>, sampleSizeProperty: Property<number>, providedOptions: SamplingLaunchPanelOptions ) {
    const content: Node[] = [];
    const sameSizeSection = new SampleSizeSection( sampleSizeProperty, {
      tandem: providedOptions.tandem
    } );
    content.push( sameSizeSection );

    const separator = new HSeparator( { stroke: Color.BLACK } );
    content.push( separator );

    super( content, providedOptions );
  }
}
projectileDataLab.register( 'SamplingLaunchPanel', SamplingLaunchPanel );

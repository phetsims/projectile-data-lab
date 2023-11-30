// Copyright 2023, University of Colorado Boulder

/**
 * The PDLPanel defines the default look and feel for panels in the Projectile Data Lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../../projectileDataLab.js';
import { Node, VBox } from '../../../../../scenery/js/imports.js';
import WithRequired from '../../../../../phet-core/js/types/WithRequired.js';
import { PDLPanel, PDLPanelOptions } from './PDLPanel.js';
import SectionLauncherType from './SectionLauncherType.js';
import PhetioProperty from '../../../../../axon/js/PhetioProperty.js';

type SelfOptions = EmptySelfOptions;
export type PDLLaunchPanelOptions = SelfOptions & WithRequired<PDLPanelOptions, 'tandem'>;

export class PDLLaunchPanel extends PDLPanel {
  public constructor( launcherProperty: PhetioProperty<number>, children: Node[], providedOptions: PDLLaunchPanelOptions ) {

    const options = optionize<PDLLaunchPanelOptions, SelfOptions, PDLPanelOptions>()( {}, providedOptions );

    const launcherTypeSection = new SectionLauncherType( launcherProperty, {
      tandem: providedOptions.tandem
    } );
    children.push( launcherTypeSection );

    const contentContainer = new VBox( { children: children, spacing: 5, stretch: true, align: 'left' } );
    super( contentContainer, options );
  }
}

projectileDataLab.register( 'PDLLaunchPanel', PDLLaunchPanel );
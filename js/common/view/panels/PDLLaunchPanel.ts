// Copyright 2023, University of Colorado Boulder

/**
 * The PDLPanel defines the default look and feel for panels in the Projectile Data Lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../../projectileDataLab.js';
import { Node } from '../../../../../scenery/js/imports.js';
import WithRequired from '../../../../../phet-core/js/types/WithRequired.js';
import { PDLPanel, PDLPanelOptions } from './PDLPanel.js';
import SectionLauncherType from './SectionLauncherType.js';
import PhetioProperty from '../../../../../axon/js/PhetioProperty.js';
import PDLConstants from '../../PDLConstants.js';

type SelfOptions = EmptySelfOptions;
export type PDLLaunchPanelOptions = SelfOptions & WithRequired<PDLPanelOptions, 'tandem'>;

export class PDLLaunchPanel extends PDLPanel {
  public constructor( launcherProperty: PhetioProperty<number>, content: Node[], providedOptions: PDLLaunchPanelOptions ) {
    const options = optionize<PDLLaunchPanelOptions, SelfOptions, PDLPanelOptions>()( {
      left: PDLConstants.SCREEN_VIEW_X_MARGIN,
      top: PDLConstants.SCREEN_VIEW_Y_MARGIN
    }, providedOptions );

    const launcherTypeSection = new SectionLauncherType( launcherProperty, {
      tandem: providedOptions.tandem
    } );
    content.push( launcherTypeSection );

    super( content, options );
  }
}

projectileDataLab.register( 'PDLLaunchPanel', PDLLaunchPanel );
// Copyright 2023, University of Colorado Boulder

/**
 * The PDLPanel defines the default look and feel for panels in the Projectile Data Lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
import { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../../projectileDataLab.js';
import { PanelOptions } from '../../../../../sun/js/Panel.js';
import { Node } from '../../../../../scenery/js/imports.js';
import WithRequired from '../../../../../phet-core/js/types/WithRequired.js';
import { PDLPanel } from './PDLPanel.js';
import SectionLauncherType from './SectionLauncherType.js';
import Property from '../../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;
export type PDLLaunchPanelOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

export class PDLLaunchPanel extends PDLPanel {
  public constructor( launcherProperty: Property<number>, content: Node[], providedOptions: PDLLaunchPanelOptions ) {
    const launcherTypeSection = new SectionLauncherType( launcherProperty, {
      tandem: providedOptions.tandem
    } );
    content.push( launcherTypeSection );

    super( content, providedOptions );
  }
}

projectileDataLab.register( 'PDLLaunchPanel', PDLLaunchPanel );
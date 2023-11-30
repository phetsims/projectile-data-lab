// Copyright 2023, University of Colorado Boulder

/**
 * The PDLPanel defines the default look and feel for panels in the Projectile Data Lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import { Node } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PDLColors from '../PDLColors.js';

type SelfOptions = EmptySelfOptions;
export type PDLPanelOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

export class PDLPanel extends Panel {
  public constructor( content: Node, providedOptions?: PDLPanelOptions ) {

    const options = optionize<PDLPanelOptions, SelfOptions, PanelOptions>()( {
      fill: PDLColors.panelColorProperty
    }, providedOptions );

    super( content, options );
  }
}

projectileDataLab.register( 'PDLPanel', PDLPanel );
// Copyright 2023-2024, University of Colorado Boulder

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
import PDLColors from '../PDLColors.js';

type SelfOptions = EmptySelfOptions;
export type PDLPanelOptions = SelfOptions & PanelOptions;

export class PDLPanel extends Panel {
  public constructor( content: Node, providedOptions?: PDLPanelOptions ) {

    const options = optionize<PDLPanelOptions, SelfOptions, PanelOptions>()( {
      fill: PDLColors.panelColorProperty,
      stroke: PDLColors.panelStrokeColorProperty,
      cornerRadius: 5,
      phetioFeatured: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    super( content, options );
  }
}

projectileDataLab.register( 'PDLPanel', PDLPanel );
// Copyright 2023-2024, University of Colorado Boulder

/**
 * The PDLPanel defines the default look and feel for panels in the Projectile Data Lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import { HSeparator, Node, VBox } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { PDLPanel, PDLPanelOptions } from './PDLPanel.js';
import PDLConstants from '../PDLConstants.js';
import PDLColors from '../PDLColors.js';

type SelfOptions = EmptySelfOptions;
export type PDLLaunchPanelOptions = SelfOptions & WithRequired<PDLPanelOptions, 'tandem'>;

export class PDLLaunchPanel extends PDLPanel {
  public constructor( children: Node[], providedOptions: PDLLaunchPanelOptions ) {

    const options = optionize<PDLLaunchPanelOptions, SelfOptions, PDLPanelOptions>()( {
      left: PDLConstants.SCREEN_VIEW_X_MARGIN,
      top: PDLConstants.SCREEN_VIEW_Y_MARGIN,

      // Fill all the space on the left, even if the child components don't use all the space
      preferredWidth: 171
    }, providedOptions );

    // Add a separator between each of the children, but not after the last one
    const childrenWithSeparators: Node[] = [];
    children.forEach( ( child, index ) => {
      childrenWithSeparators.push( child );
      if ( index < children.length - 1 ) {
        childrenWithSeparators.push( new HSeparator( { stroke: PDLColors.panelStrokeProperty } ) );
      }
    } );

    const contentContainer = new VBox( { children: childrenWithSeparators, spacing: 5, stretch: true } );
    super( contentContainer, options );
  }
}

projectileDataLab.register( 'PDLLaunchPanel', PDLLaunchPanel );
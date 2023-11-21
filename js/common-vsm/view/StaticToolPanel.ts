// Copyright 2023, University of Colorado Boulder

/**
 * The StaticToolPanel shows checkboxes for non-interactive (static) tools. This file defines checkboxes for the
 * ubiquitous static tools. Please see subclasses for where more screen-specific checkboxes are defined.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { PDLPanel, PDLPanelOptions } from '../../common/view/panels/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { HBox, Node, Rectangle } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PDLText from '../../common/view/PDLText.js';

export default class StaticToolPanel extends PDLPanel {
  private readonly checkboxGroup: VerticalCheckboxGroup;

  public constructor( providedOptions: PDLPanelOptions ) {

    const createCheckboxRow = ( label: string, icon: Node ) => {
      return new HBox( { stretch: true, children: [ new PDLText( label ), icon ] } );
    };

    const checkboxGroup = new VerticalCheckboxGroup( [ {
      property: new BooleanProperty( false ),
      createNode: () => createCheckboxRow( 'Paths', new Rectangle( 0, 0, 12, 12, { fill: 'red' } ) )
    }, {
      property: new BooleanProperty( false ),
      createNode: () => createCheckboxRow( 'Launch angle', new Rectangle( 0, 0, 12, 12, { fill: 'green' } ) )
    }, {
      property: new BooleanProperty( false ),
      createNode: () => createCheckboxRow( 'Launch speed', new Rectangle( 0, 0, 12, 12, { fill: 'blue' } ) )
    }
    ], {
      tandem: providedOptions.tandem.createTandem( 'checkboxGroup' )
    } );
    super( [ checkboxGroup ], providedOptions );
    this.checkboxGroup = checkboxGroup;
  }
}

projectileDataLab.register( 'StaticToolPanel', StaticToolPanel );
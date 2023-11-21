// Copyright 2023, University of Colorado Boulder

/**
 * The InteractiveToolPanel shows checkboxes for non-interactive (static) tools. This file defines checkboxes for the
 * ubiquitous static tools. Please see subclasses for where more screen-specific checkboxes are defined.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { PDLPanel, PDLPanelOptions } from '../../common/view/panels/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { HBox, Node, Rectangle } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem } from '../../../../sun/js/VerticalCheckboxGroup.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import StaticToolPanel from './StaticToolPanel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PDLText from '../../common/view/PDLText.js';

type SelfOptions = {
  additionalVerticalCheckboxGroupItems?: VerticalCheckboxGroupItem[];
};
export type InteractiveToolPanelOptions = SelfOptions & PDLPanelOptions;

export default class InteractiveToolPanel extends PDLPanel {
  private readonly checkboxGroup: VerticalCheckboxGroup;

  public constructor( providedOptions: InteractiveToolPanelOptions ) {

    const options = optionize<InteractiveToolPanelOptions, SelfOptions, PDLPanelOptions>()( {
      additionalVerticalCheckboxGroupItems: []
    }, providedOptions );

    const checkboxGroup = new VerticalCheckboxGroup( [ {
      property: new BooleanProperty( false ),
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.targetStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'red' } ) )
    }, {
      property: new BooleanProperty( false ),
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.tapeMeasureStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'green' } ) )
    }, {
      property: new BooleanProperty( false ),
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.stopwatchStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'blue' } ) )
    },
      ...options.additionalVerticalCheckboxGroupItems
    ], {
      tandem: options.tandem.createTandem( 'checkboxGroup' )
    } );
    super( [ checkboxGroup ], options );
    this.checkboxGroup = checkboxGroup;
  }

  public static createCheckboxRow( label: TReadOnlyProperty<string>, icon: Node ): HBox {
    return new HBox( {
      stretch: true, children: [ new PDLText( label, {
        maxWidth: 200
      } ), icon ]
    } );
  }
}

projectileDataLab.register( 'InteractiveToolPanel', InteractiveToolPanel );
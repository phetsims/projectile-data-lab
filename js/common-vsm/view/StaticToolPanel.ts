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
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem } from '../../../../sun/js/VerticalCheckboxGroup.js';
import PDLText from '../../common/view/PDLText.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = {
  additionalVerticalCheckboxGroupItems?: VerticalCheckboxGroupItem[];
};
export type StaticToolPanelOptions = SelfOptions & PDLPanelOptions;

export default class StaticToolPanel extends PDLPanel {
  private readonly checkboxGroup: VerticalCheckboxGroup;

  public constructor(
    arePathsVisibleProperty: Property<boolean>,
    isLaunchAngleVisibleProperty: Property<boolean>,
    isLaunchSpeedVisibleProperty: Property<boolean>,
    providedOptions: StaticToolPanelOptions ) {

    const options = optionize<StaticToolPanelOptions, SelfOptions, PDLPanelOptions>()( {
      additionalVerticalCheckboxGroupItems: []
    }, providedOptions );

    const checkboxGroup = new VerticalCheckboxGroup( [ {
      property: arePathsVisibleProperty,
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.pathsStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'red' } ) )
    }, {
      property: isLaunchAngleVisibleProperty,
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.launchAngleStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'green' } ) )
    }, {
      property: isLaunchSpeedVisibleProperty,
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.launchSpeedStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'blue' } ) )
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

projectileDataLab.register( 'StaticToolPanel', StaticToolPanel );
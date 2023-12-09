// Copyright 2023, University of Colorado Boulder

/**
 * The StaticToolPanel shows checkboxes for non-interactive (static) tools. This file defines checkboxes for the
 * ubiquitous static tools. Please see subclasses for where more screen-specific checkboxes are defined.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { CanvasNode, CanvasNodeOptions, HBox, Node, Rectangle } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem } from '../../../../sun/js/VerticalCheckboxGroup.js';
import PDLText from '../../common/view/PDLText.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PDLColors from '../../common/PDLColors.js';

type SelfOptions = {
  additionalVerticalCheckboxGroupItems?: VerticalCheckboxGroupItem[];
};
export type StaticToolPanelOptions = SelfOptions & PDLPanelOptions;

export default class StaticToolPanel extends PDLPanel {

  public constructor(
    arePathsVisibleProperty: Property<boolean>,
    isLaunchAngleVisibleProperty: Property<boolean>,
    isLaunchSpeedVisibleProperty: Property<boolean>,
    providedOptions: StaticToolPanelOptions ) {

    const options = optionize<StaticToolPanelOptions, SelfOptions, PDLPanelOptions>()( {
      additionalVerticalCheckboxGroupItems: []
    }, providedOptions );

    class PathsIcon extends Node {
      public constructor() {

        class MyCanvasNode extends CanvasNode {
          public constructor( options: CanvasNodeOptions ) {
            super( options );
          }

          public override paintCanvas( context: CanvasRenderingContext2D ): void {

            // For debugging, fill the entire background of the canvas with yellow
            // context.fillStyle = 'yellow';
            // context.fillRect( 0, 0, 20, 20 );

            const color = PDLColors.pathStrokeHighlightedColorProperty.value.toCSS();
            context.save();
            context.strokeStyle = color;
            context.lineWidth = 1.5;

            context.beginPath();
            context.moveTo( 0, 18 );
            context.quadraticCurveTo( 10, -18, 18, 18 );
            context.stroke();
            context.restore();
          }
        }

        const canvasNode = new MyCanvasNode( {
          canvasBounds: new Bounds2( 0, 0, 18, 18 )
        } );
        super( {
          children: [ canvasNode ],
          pickable: false,
          maxWidth: 25
        } );
      }
    }

    const checkboxGroup = new VerticalCheckboxGroup( [ {
      property: arePathsVisibleProperty,
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.pathsStringProperty, new PathsIcon() ),
      tandemName: 'pathsCheckbox'
    }, {
      property: isLaunchAngleVisibleProperty,
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.launchAngleStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'green' } ) ),
      tandemName: 'launchAngleCheckbox'
    }, {
      property: isLaunchSpeedVisibleProperty,
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.launchSpeedStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'blue' } ) ),
      tandemName: 'launchSpeedCheckbox'
    },
      ...options.additionalVerticalCheckboxGroupItems
    ], {
      tandem: options.tandem.createTandem( 'checkboxGroup' )
    } );
    super( checkboxGroup, options );
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
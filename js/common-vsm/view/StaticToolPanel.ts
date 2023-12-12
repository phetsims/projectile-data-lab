// Copyright 2023, University of Colorado Boulder

/**
 * The StaticToolPanel shows checkboxes for non-interactive (static) tools. This file defines checkboxes for the
 * ubiquitous static tools. Please see subclasses for where more screen-specific checkboxes are defined.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { CanvasNode, CanvasNodeOptions, HBox, Node } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem } from '../../../../sun/js/VerticalCheckboxGroup.js';
import PDLText from '../../common/view/PDLText.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PDLColors from '../../common/PDLColors.js';
import AngleToolNode from './AngleToolNode.js';
import SpeedToolNode from './SpeedToolNode.js';

type SelfOptions = {
  additionalVerticalCheckboxGroupItems?: VerticalCheckboxGroupItem[];
};
export type StaticToolPanelOptions = SelfOptions & PDLPanelOptions;

export const ICON_WIDTH = 24;

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
            context.moveTo( -ICON_WIDTH / 2, 18 );
            context.quadraticCurveTo( 0, -18, ICON_WIDTH / 2, 18 );
            context.stroke();
            context.restore();
          }
        }

        const canvasNode = new MyCanvasNode( {
          canvasBounds: new Bounds2( -ICON_WIDTH / 2, 0, ICON_WIDTH / 2, 18 )
        } );
        super( {
          children: [ canvasNode ],
          pickable: false,
          maxWidth: ICON_WIDTH
        } );
      }
    }

    class AngleToolIconNode extends Node {
      public constructor() {

        const angleToolNode = new AngleToolNode( new Property( false ), {
          isIcon: true,
          initialNeedleValue: 45
        } ).rasterized( {
          resolution: 1.25
        } );
        super( {
          children: [ angleToolNode ],
          pickable: false,
          maxWidth: ICON_WIDTH
        } );
      }
    }

    class SpeedToolIconNode extends Node {
      public constructor() {

        const speedToolNode = new SpeedToolNode( new Property( false ), {
          isIcon: true
        } )
          .rasterized( {
            resolution: 1.25
          } );
        super( {
          children: [ speedToolNode ],
          pickable: false,
          maxWidth: ICON_WIDTH
        } );
      }
    }

    const checkboxGroup = new VerticalCheckboxGroup( [ {
      property: arePathsVisibleProperty,
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.pathsStringProperty, new PathsIcon() ),
      tandemName: 'pathsCheckbox'
    }, {
      property: isLaunchAngleVisibleProperty,
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.launchAngleStringProperty, new AngleToolIconNode() ),
      tandemName: 'launchAngleCheckbox'
    }, {
      property: isLaunchSpeedVisibleProperty,
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.launchSpeedStringProperty, new SpeedToolIconNode() ),
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
      spacing: 10,
      stretch: true, children: [ new PDLText( label, {
        maxWidth: 90
      } ), icon ]
    } );
  }
}

projectileDataLab.register( 'StaticToolPanel', StaticToolPanel );
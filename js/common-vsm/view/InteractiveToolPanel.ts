// Copyright 2023, University of Colorado Boulder

/**
 * The InteractiveToolPanel shows checkboxes for non-interactive (static) tools. This file defines checkboxes for the
 * ubiquitous static tools. Please see subclasses for where more screen-specific checkboxes are defined.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { Color, HBox, Node } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem } from '../../../../sun/js/VerticalCheckboxGroup.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import StaticToolPanel from './StaticToolPanel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PDLText from '../../common/view/PDLText.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = {
  additionalVerticalCheckboxGroupItems?: VerticalCheckboxGroupItem[];
};
export type InteractiveToolPanelOptions = SelfOptions & PDLPanelOptions;

export default class InteractiveToolPanel extends PDLPanel {

  public constructor(
    isMeasuringTapeVisibleProperty: BooleanProperty,
    isStopwatchVisibleProperty: BooleanProperty,
    providedOptions: InteractiveToolPanelOptions ) {

    const options = optionize<InteractiveToolPanelOptions, SelfOptions, PDLPanelOptions>()( {
      additionalVerticalCheckboxGroupItems: []
    }, providedOptions );

    class StopwatchNodeIcon extends Node {
      public constructor() {
        const stopwatchNode = new StopwatchNode( new Stopwatch( {
          tandem: Tandem.OPT_OUT,
          isVisible: true
        } ), { tandem: Tandem.OPT_OUT } ).rasterized( { resolution: 1.25 } );
        super( {
          children: [ stopwatchNode ],
          pickable: false,
          maxWidth: 25
        } );
      }
    }

    class MeasuringTapeIcon extends Node {
      public constructor() {

        const measuringTapeNode = new MeasuringTapeNode( new Property( { name: 'm', multiplier: 1 } ), {
          visibleProperty: new BooleanProperty( true ),
          tipPositionProperty: new Property<Vector2>( new Vector2( 14, 0 ) ),
          lineColor: new Color( 0, 0, 0 ),
          crosshairLineWidth: 1.8,
          tapeLineWidth: 1.8,

          // MeasuringTapeNode does not support hiding the text. This is our "hack" to hide it.
          // REVIEW: Do we want to change common code support for that? Or try a font of 0?
          textMaxWidth: 1E-6,

          tandem: Tandem.OPT_OUT
        } ).rasterized( {
          resolution: 1.25
        } );
        super( {
          children: [ measuringTapeNode ],
          pickable: false,
          maxWidth: 25
        } );
      }
    }

    const checkboxGroup = new VerticalCheckboxGroup( [ {
      property: isMeasuringTapeVisibleProperty,
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.measuringTapeStringProperty, new MeasuringTapeIcon() ),
      tandemName: 'measuringTapeCheckbox'
    }, {
      property: isStopwatchVisibleProperty,
      createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.stopwatchStringProperty, new StopwatchNodeIcon() ),
      tandemName: 'stopwatchCheckbox'
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

projectileDataLab.register( 'InteractiveToolPanel', InteractiveToolPanel );
// Copyright 2023-2024, University of Colorado Boulder

/**
 * The InteractiveToolPanel shows checkboxes for non-interactive (static) tools. This file defines checkboxes for the
 * ubiquitous static tools. Please see subclasses for where more screen-specific checkboxes are defined.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import { Color, Node } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem } from '../../../../sun/js/VerticalCheckboxGroup.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { ICON_WIDTH } from './StaticToolPanel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PDLConstants from '../../common/PDLConstants.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import PDLCheckboxRow from '../../common/view/PDLCheckboxRow.js';
import PDLStopwatchNode from './PDLStopwatchNode.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';

type SelfOptions = {
  additionalVerticalCheckboxGroupItems?: VerticalCheckboxGroupItem[];
};
export type InteractiveToolPanelOptions = SelfOptions & PDLPanelOptions;

export default class InteractiveToolPanel extends PDLPanel {

  public constructor(
    isMeasuringTapeVisibleProperty: BooleanProperty,
    isStopwatchVisibleProperty: PhetioProperty<boolean>,
    providedOptions: InteractiveToolPanelOptions ) {

    const options = optionize<InteractiveToolPanelOptions, SelfOptions, PDLPanelOptions>()( {
      additionalVerticalCheckboxGroupItems: []
    }, providedOptions );

    class StopwatchNodeIcon extends Node {
      public constructor() {
        const stopwatch = new Stopwatch( { tandem: Tandem.OPT_OUT } );
        stopwatch.isVisibleProperty.value = true;
        const stopwatchNode = new PDLStopwatchNode( stopwatch, _.noop, { tandem: Tandem.OPT_OUT } ).rasterized( {
          resolution: 1.25
        } );
        super( {
          children: [ stopwatchNode ],
          pickable: false,
          maxWidth: ICON_WIDTH
        } );
      }
    }

    class MeasuringTapeIconNode extends Node {
      public constructor() {

        const measuringTapeNode = new MeasuringTapeNode( new Property( { name: 'm', multiplier: 1 } ), {
          visibleProperty: new BooleanProperty( true ),
          tipPositionProperty: new Property<Vector2>( new Vector2( 14, 0 ) ),
          lineColor: new Color( 0, 0, 0 ),
          crosshairLineWidth: 1.8,
          tapeLineWidth: 1.8,
          tandem: Tandem.OPT_OUT,
          hasValue: false
        } ).rasterized( { resolution: 1.25 } );
        super( {
          children: [ measuringTapeNode ],
          pickable: false,
          maxWidth: ICON_WIDTH
        } );
      }
    }

    const checkboxGroup = new VerticalCheckboxGroup( [ {
      property: isMeasuringTapeVisibleProperty,
      createNode: () => new PDLCheckboxRow( ProjectileDataLabStrings.measuringTapeStringProperty, new MeasuringTapeIconNode() ),
      tandemName: 'measuringTapeCheckbox'
    }, {
      property: isStopwatchVisibleProperty,
      createNode: () => new PDLCheckboxRow( ProjectileDataLabStrings.stopwatchStringProperty, new StopwatchNodeIcon() ),
      tandemName: 'stopwatchCheckbox'
    },
      ...options.additionalVerticalCheckboxGroupItems
    ], {
      tandem: options.tandem.createTandem( 'checkboxGroup' ),
      phetioFeatured: true,
      phetioVisiblePropertyInstrumented: false,
      checkboxOptions: {
        boxWidth: PDLConstants.VERTICAL_CHECKBOX_GROUP_CHECKBOX_WIDTH
      }
    } );
    super( checkboxGroup, options );
  }
}

projectileDataLab.register( 'InteractiveToolPanel', InteractiveToolPanel );
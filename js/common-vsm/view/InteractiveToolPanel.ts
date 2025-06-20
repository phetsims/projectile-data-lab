// Copyright 2023-2025, University of Colorado Boulder

/**
 * The InteractiveToolPanel shows checkboxes for non-interactive (static) tools. This file defines checkboxes for the
 * ubiquitous static tools. Please see subclasses for where more screen-specific checkboxes are defined.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GatedVisibleProperty from '../../../../axon/js/GatedVisibleProperty.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import MeasuringTapeNode from '../../../../scenery-phet/js/MeasuringTapeNode.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem } from '../../../../sun/js/VerticalCheckboxGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PDLConstants from '../../common/PDLConstants.js';
import PDLPreferences from '../../common/PDLPreferences.js';
import PDLCheckboxRow from '../../common/view/PDLCheckboxRow.js';
import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import projectileDataLab from '../../projectileDataLab.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLStopwatchNode from './PDLStopwatchNode.js';
import { ICON_WIDTH } from './StaticToolPanel.js';

type SelfOptions = {
  additionalVerticalCheckboxGroupItems?: VerticalCheckboxGroupItem[];
};
export type InteractiveToolPanelOptions = SelfOptions & WithRequired<PDLPanelOptions, 'tandem'>;

export default class InteractiveToolPanel extends PDLPanel {

  public constructor(
    isMeasuringTapeVisibleProperty: Property<boolean>,
    isStopwatchVisibleProperty: PhetioProperty<boolean>,
    providedOptions: InteractiveToolPanelOptions ) {

    const options = optionize<InteractiveToolPanelOptions, SelfOptions, PDLPanelOptions>()( {
      additionalVerticalCheckboxGroupItems: []
    }, providedOptions );

    class StopwatchNodeIcon extends Node {
      public constructor() {
        const stopwatch = new Stopwatch( { tandem: Tandem.OPT_OUT } );
        stopwatch.isVisibleProperty.value = true;
        const stopwatchNode = new PDLStopwatchNode( stopwatch, _.noop, {
          isIcon: true,
          tandem: Tandem.OPT_OUT,
          launchButtonEnabledProperty: new BooleanProperty( true )
        } );
        super( {
          children: [ stopwatchNode ],
          pickable: false,
          maxWidth: ICON_WIDTH,
          maxHeight: 16
        } );
      }
    }

    class MeasuringTapeIconNode extends Node {
      public constructor() {

        const measuringTapeNode = rasterizeNode( new MeasuringTapeNode( new Property( { name: 'm', multiplier: 1 } ), {
          visibleProperty: new BooleanProperty( true ),
          tipPositionProperty: new Property<Vector2>( new Vector2( 14, 0 ) ),
          lineColor: new Color( 0, 0, 0 ),
          crosshairLineWidth: 1.8,
          tapeLineWidth: 1.8,
          tandem: Tandem.OPT_OUT,
          hasValue: false
        } ), { resolution: 1.25 } );
        super( {
          children: [ measuringTapeNode ],
          pickable: false,
          maxWidth: ICON_WIDTH
        } );
      }
    }

    const checkboxGroupTandem = options.tandem.createTandem( 'checkboxGroup' );
    const stopwatchCheckboxTandemName = 'stopwatchCheckbox';

    const checkboxGroup = new VerticalCheckboxGroup( [

      // Measuring tape
      {
        property: isMeasuringTapeVisibleProperty,
        createNode: () => new PDLCheckboxRow( ProjectileDataLabStrings.measuringTapeStringProperty, new MeasuringTapeIconNode() ),
        tandemName: 'measuringTapeCheckbox'
      },

      // Stopwatch
      {
        property: isStopwatchVisibleProperty,
        createNode: () => new PDLCheckboxRow( ProjectileDataLabStrings.stopwatchStringProperty, new StopwatchNodeIcon() ),
        tandemName: stopwatchCheckboxTandemName,
        options: {
          visibleProperty: new GatedVisibleProperty( DerivedProperty.not( PDLPreferences.autoGenerateDataProperty ),
            checkboxGroupTandem.createTandem( stopwatchCheckboxTandemName ) )
        }
      },
      ...options.additionalVerticalCheckboxGroupItems
    ], {
      tandem: checkboxGroupTandem,
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
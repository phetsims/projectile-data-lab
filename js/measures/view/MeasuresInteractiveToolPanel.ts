// Copyright 2023-2024, University of Colorado Boulder

/**
 * The MeasuresInteractiveToolPanel extends the InteractiveToolPanel and provides a specialized user interface for
 * interacting with additional tools on the Measures screen.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node } from '../../../../scenery/js/imports.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import InteractiveToolPanel, { InteractiveToolPanelOptions } from '../../common-vsm/view/InteractiveToolPanel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IntervalToolNode from './IntervalToolNode.js';
import IntervalTool from '../model/IntervalTool.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import PDLCheckboxRow from '../../common/view/PDLCheckboxRow.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;
type MeasuresInteractiveToolPanelOptions = SelfOptions & InteractiveToolPanelOptions;

export default class MeasuresInteractiveToolPanel extends InteractiveToolPanel {
  public constructor(
    isMeasuringTapeVisibleProperty: Property<boolean>,
    isStopwatchVisibleProperty: PhetioProperty<boolean>,
    isIntervalToolVisibleProperty: Property<boolean>,
    providedOptions: MeasuresInteractiveToolPanelOptions ) {

    class IntervalToolIcon extends Node {
      public constructor() {

        // Create a ModelViewTransform2 that defines how to scale the relative sizes of the interval tool components.
        // A smaller scale emphasizes the text elements, a larger scale shrinks the text.
        const transform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, 0 ), 5 );
        const intervalTool = new IntervalTool( {
          tandem: Tandem.OPT_OUT
        } );
        const intervalToolNode = new IntervalToolNode( intervalTool, transform, {
          isIcon: true,
          visibleProperty: new BooleanProperty( true ),
          tandem: Tandem.OPT_OUT
        } ).rasterized( { resolution: 2 } );
        super( {
          children: [ intervalToolNode ],
          pickable: false,
          maxWidth: 22
        } );
      }
    }

    const options = optionize<MeasuresInteractiveToolPanelOptions, SelfOptions, InteractiveToolPanelOptions>()( {
      additionalVerticalCheckboxGroupItems: [
        {
          property: isIntervalToolVisibleProperty,
          createNode: () => new PDLCheckboxRow( ProjectileDataLabStrings.intervalToolStringProperty, new IntervalToolIcon() ),
          tandemName: 'intervalToolCheckbox'
        }
      ]
    }, providedOptions );

    super( isMeasuringTapeVisibleProperty, isStopwatchVisibleProperty, options );
  }
}

projectileDataLab.register( 'MeasuresInteractiveToolPanel', MeasuresInteractiveToolPanel );
// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';

type SelfOptions = EmptySelfOptions;
export type TimeDisplayNodeOptions = SelfOptions & NodeOptions;

export default class TimeDisplayNode extends Node {
  public constructor( stopwatchElapsedTimeProperty: TReadOnlyProperty<number>, providedOptions: TimeDisplayNodeOptions ) {

    const contents = new NumberDisplay( stopwatchElapsedTimeProperty, Stopwatch.ZERO_TO_ALMOST_SIXTY, {

      // Same as in StopwatchNode
      numberFormatter: StopwatchNode.RICH_TEXT_MINUTES_AND_SECONDS,
      useRichText: true,
      textOptions: {
        font: StopwatchNode.DEFAULT_FONT
      },
      align: 'right',
      cornerRadius: 4,
      xMargin: 4,
      yMargin: 2,
      pickable: false // allow dragging by the number display
    } );

    const xMargin = 5;
    const yMargin = 5;
    const backgroundNode = new ShadedRectangle( new Bounds2( 0, 0,
      contents.width + 2 * xMargin, contents.height + 2 * yMargin ), {
      baseColor: 'rgb( 80, 130, 230 )',
      tagName: 'div',
      focusable: true
    } );
    contents.center = backgroundNode.center;

    const options = optionize<TimeDisplayNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ backgroundNode, contents ]
    }, providedOptions );

    super( options );
  }
}
projectileDataLab.register( 'TimeDisplayNode', TimeDisplayNode );
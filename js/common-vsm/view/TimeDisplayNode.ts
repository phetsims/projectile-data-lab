// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { LinearGradient, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import PDLColors from '../../common/PDLColors.js';

type SelfOptions = {
  isIcon?: boolean;
};
export type TimeDisplayNodeOptions = SelfOptions & NodeOptions;

/**
 * TimeDisplayNode is a Node that displays the elapsed time of the stopwatch.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
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

    const xMargin = 8.5;
    const yMargin = 8.5;
    const bgWidth = contents.width + 2 * xMargin;
    const bgHeight = contents.height + 2 * yMargin;
    const backgroundNode = new ShadedRectangle( new Bounds2( 0, 0, bgWidth, bgHeight ), {
      baseColor: PDLColors.timerDisplayColorProperty,
      tagName: 'div',
      focusable: true
    } );
    contents.center = backgroundNode.center;

    // Create the graphics for the wire connecting to the launch button
    const WIRE_LENGTH = 30;
    const WIRE_WIDTH = 5;
    const WIRE_CAP_LENGTH = 3;
    const WIRE_CAP_WIDTH = 8;

    const wireTopY = 0.5 * bgHeight - 0.5 * WIRE_WIDTH;
    const wireCapTopY = 0.5 * bgHeight - 0.5 * WIRE_CAP_WIDTH;

    const wireFillGradient = new LinearGradient( 0, wireTopY, 0, wireTopY + WIRE_WIDTH );
    wireFillGradient.addColorStop( 0, PDLColors.launchButtonColorProperty );
    wireFillGradient.addColorStop( 1, PDLColors.launchButtonColorProperty.value.darkerColor( 0.8 ) );

    const wireCapFillGradient = new LinearGradient( 0, wireCapTopY, 0, wireCapTopY + WIRE_CAP_WIDTH );
    wireCapFillGradient.addColorStop( 0, PDLColors.timerDisplayColorProperty.value.darkerColor( 0.8 ) );
    wireCapFillGradient.addColorStop( 1, PDLColors.timerDisplayColorProperty.value.darkerColor( 0.6 ) );

    const wire = new Rectangle( -WIRE_LENGTH, wireTopY, WIRE_LENGTH, WIRE_WIDTH, {
      fill: wireFillGradient,
      pickable: false
    } );

    const wireCapLeft = new Rectangle( -WIRE_LENGTH - WIRE_CAP_LENGTH, wireCapTopY, WIRE_CAP_LENGTH, WIRE_CAP_WIDTH, {
      fill: wireCapFillGradient,
      cornerRadius: 1,
      pickable: false
    } );

    const wireCapRight = new Rectangle( -WIRE_CAP_LENGTH, wireCapTopY, WIRE_CAP_LENGTH, WIRE_CAP_WIDTH, {
      fill: wireCapFillGradient,
      cornerRadius: 1,
      pickable: false
    } );

    const children: Node[] = [ backgroundNode, contents ];

    if ( !providedOptions.isIcon ) {
      children.push( wire );
      children.push( wireCapLeft );
      children.push( wireCapRight );
    }

    const options = optionize<TimeDisplayNodeOptions, SelfOptions, NodeOptions>()( {
      isIcon: false,
      children: children
    }, providedOptions );

    super( options );
  }
}
projectileDataLab.register( 'TimeDisplayNode', TimeDisplayNode );
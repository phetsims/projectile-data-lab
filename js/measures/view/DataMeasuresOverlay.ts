// Copyright 2023-2024, University of Colorado Boulder

import optionize from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { Shape } from '../../../../kite/js/imports.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import MeanIndicatorNode from '../../common/view/MeanIndicatorNode.js';

/**
 * The DataMeasuresOverlay shows the graphics for the visual representation of the average and standard deviation
 * of the landed projectiles. It has a mean indicator node, a mean line, and two standard deviation lines with arrows.
 * It is used in both the field overlay and histogram overlay components on the Measures screen.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = {
  isIcon?: boolean;
};
export type DataMeasuresFieldOverlayOptions = SelfOptions & NodeOptions;

const LINE_WIDTH = 1.5;
const MIN_SD_FOR_SHOW_SD = 0.2;
const MIN_SD_FOR_SHOW_ARROWS = 0.8;

export default class DataMeasuresOverlay extends Node {
  public constructor( modelViewTransform: ModelViewTransform2 | ChartTransform,
                      landedDistanceAverageProperty: PhetioProperty<number | null>,
                      landedDistanceStandardDeviationProperty: PhetioProperty<number | null>,
                      totalHeight: number,
                      isVisibleProperty: BooleanProperty,
                      providedOptions: DataMeasuresFieldOverlayOptions ) {

    const origin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    const isStandardDeviationVisibleProperty = new DerivedProperty( [ landedDistanceStandardDeviationProperty ], standardDeviation => {
      return standardDeviation !== null && standardDeviation > MIN_SD_FOR_SHOW_SD;
    } );

    const isArrowsVisibleProperty = new DerivedProperty( [ landedDistanceStandardDeviationProperty ], standardDeviation => {
      return standardDeviation !== null && standardDeviation > MIN_SD_FOR_SHOW_ARROWS;
    } );

    const meanIndicatorRadius = providedOptions.isIcon ? 8 : 10;

    const meanIndicator = new MeanIndicatorNode( meanIndicatorRadius );
    meanIndicator.bottom = origin.y;

    const meanIndicatorHeight = meanIndicator.bounds.height;

    const lineOptions = {
      visibleProperty: isStandardDeviationVisibleProperty,
      stroke: 'black',
      lineWidth: LINE_WIDTH
    };

    const leftLine = new Path( new Shape().moveTo( 0, origin.y ).lineTo( 0, origin.y - totalHeight ), lineOptions );
    const rightLine = new Path( new Shape().moveTo( 0, origin.y ).lineTo( 0, origin.y - totalHeight ), lineOptions );
    const meanLine = new Path( new Shape().moveTo( 0, origin.y - meanIndicatorHeight ).lineTo( 0, origin.y - totalHeight ), lineOptions );

    const meanLineLength = totalHeight - meanIndicatorHeight;
    const arrowY = origin.y - totalHeight + meanLineLength / 2; // Put the arrow in the middle of the mean line

    const arrowOptions: ArrowNodeOptions = {
      visibleProperty: isArrowsVisibleProperty,
      doubleHead: true,
      headWidth: 5,
      headHeight: 5,
      tailWidth: 1,
      stroke: 'black'
    };

    const leftArrow = new ArrowNode( 0, arrowY, 0, arrowY, arrowOptions );
    const rightArrow = new ArrowNode( 0, arrowY, 0, arrowY, arrowOptions );

    Multilink.multilink( [ landedDistanceAverageProperty, landedDistanceStandardDeviationProperty ],
      ( average, standardDeviation ) => {

        if ( average !== null && standardDeviation !== null ) {
          const meanX = modelViewTransform.modelToViewX( average );
          const leftX = modelViewTransform.modelToViewX( average - standardDeviation );
          const rightX = modelViewTransform.modelToViewX( average + standardDeviation );

          meanIndicator.x = meanX;
          meanLine.x = meanX;

          leftLine.x = leftX;
          rightLine.x = rightX;

          leftArrow.setTail( leftX + LINE_WIDTH, leftArrow.tailY );
          leftArrow.setTip( meanX - LINE_WIDTH, leftArrow.tipY );
          rightArrow.setTail( rightX - LINE_WIDTH, rightArrow.tailY );
          rightArrow.setTip( meanX + LINE_WIDTH, rightArrow.tipY );
        }
      } );

    const isSelfVisibleProperty = new DerivedProperty(
      [ isVisibleProperty, landedDistanceAverageProperty ],
      ( isVisible, landedDistanceAverage ) => {
        return isVisible && landedDistanceAverage !== null;
      } );


    const options = optionize<DataMeasuresFieldOverlayOptions, SelfOptions, NodeOptions>()( {
      visibleProperty: isSelfVisibleProperty,
      children: [ leftLine, rightLine, meanLine, leftArrow, rightArrow, meanIndicator ],
      isIcon: false
    }, providedOptions );

    super( options );
  }
}

projectileDataLab.register( 'DataMeasuresOverlay', DataMeasuresOverlay );
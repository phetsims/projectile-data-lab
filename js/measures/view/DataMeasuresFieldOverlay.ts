// Copyright 2023, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { Shape } from '../../../../kite/js/imports.js';
import PDLColors from '../../common/PDLColors.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';

/**
 * The DataMeasuresFieldOverlay shows the graphics for the visual representation of the average and standard deviation
 * of the landed projectiles. It has a mean marker, a mean line, and two standard deviation lines with arrows.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type DataMeasuresFieldOverlayOptions = SelfOptions & NodeOptions;

export default class DataMeasuresFieldOverlay extends Node {
  public constructor( modelViewTransform: ModelViewTransform2,
                      landedDistanceAverageProperty: PhetioProperty<number | null>,
                      landedDistanceStandardDeviationProperty: PhetioProperty<number | null>,
                      providedOptions: DataMeasuresFieldOverlayOptions ) {

    const origin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    const isStandardDeviationVisibleProperty = new DerivedProperty( [ landedDistanceStandardDeviationProperty ], standardDeviation => {
      return standardDeviation !== null && standardDeviation > 0;
    } );

    const meanMarkerSideLength = 20;
    const meanMarkerHeight = meanMarkerSideLength * Math.sqrt( 3 ) / 2;
    const meanMarker = new Path( new Shape().polygon( [

      // The marker is an equilateral triangle with a side length of meanMarkerSideLength pointing down
      new Vector2( -meanMarkerSideLength / 2, origin.y - meanMarkerHeight ),
      new Vector2( meanMarkerSideLength / 2, origin.y - meanMarkerHeight ),
      new Vector2( 0, origin.y )
    ] ), {
      fill: PDLColors.meanMarkerColorProperty,
      stroke: 'black'
    } );

    const lineLength = 50;

    const leftLine = new Path( new Shape().moveTo( 0, origin.y ).lineTo( 0, origin.y - lineLength ), {
      visibleProperty: isStandardDeviationVisibleProperty,
      stroke: 'black',
      lineCap: 'round',
      lineWidth: 2
    } );
    const rightLine = new Path( new Shape().moveTo( 0, origin.y ).lineTo( 0, origin.y - lineLength ), {
      visibleProperty: isStandardDeviationVisibleProperty,
      stroke: 'black',
      lineCap: 'round',
      lineWidth: 2
    } );
    const meanLine = new Path( new Shape().moveTo( 0, origin.y - meanMarkerHeight ).lineTo( 0, origin.y - lineLength ), {
      visibleProperty: isStandardDeviationVisibleProperty,
      stroke: 'black',
      lineCap: 'round',
      lineWidth: 1
    } );

    const meanLineLength = lineLength - meanMarkerHeight;
    const arrowY = origin.y - lineLength + meanLineLength / 2; // Put the arrow in the middle of the mean line
    const arrowOptions = {
      visibleProperty: isStandardDeviationVisibleProperty,
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
          meanMarker.x = modelViewTransform.modelToViewX( average );
          meanLine.x = modelViewTransform.modelToViewX( average );

          leftLine.x = modelViewTransform.modelToViewX( average - standardDeviation );
          rightLine.x = modelViewTransform.modelToViewX( average + standardDeviation );

          leftArrow.setTail( modelViewTransform.modelToViewX( average - standardDeviation ), leftArrow.tailY );
          leftArrow.setTip( modelViewTransform.modelToViewX( average ), leftArrow.tipY );
          rightArrow.setTail( modelViewTransform.modelToViewX( average + standardDeviation ), rightArrow.tailY );
          rightArrow.setTip( modelViewTransform.modelToViewX( average ), rightArrow.tipY );
        }
      } );

    const options = optionize<DataMeasuresFieldOverlayOptions, SelfOptions, NodeOptions>()( {
      children: [ leftLine, rightLine, meanLine, leftArrow, rightArrow, meanMarker ]
    }, providedOptions );

    super( options );
  }
}

projectileDataLab.register( 'DataMeasuresFieldOverlay', DataMeasuresFieldOverlay );
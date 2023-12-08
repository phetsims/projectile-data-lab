// Copyright 2023, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import Multilink from '../../../../axon/js/Multilink.js';

/**
 * The DataMeasuresFieldOverlay shows the graphics for the visual representation of the average and standard deviation
 * of the landed projectiles.
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

    const averagePatternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.meanMPatternStringProperty, {
      average: landedDistanceAverageProperty
    } );
    const standardDeviationPatternStringProperty = new PatternStringProperty( ProjectileDataLabStrings.standardDeviationMPatternStringProperty, {
      standardDeviation: landedDistanceStandardDeviationProperty
    } );

    const origin = modelViewTransform.modelToViewPosition( Vector2.ZERO );
    const textY = modelViewTransform.modelToViewY( 1 );

    const averageDistanceText = new Text( averagePatternStringProperty, { x: origin.x, y: textY } );
    const sdTextLeft = new Text( standardDeviationPatternStringProperty, { x: origin.x, y: textY } );
    const sdTextRight = new Text( standardDeviationPatternStringProperty, { x: origin.x, y: textY } );

    Multilink.multilink( [ landedDistanceAverageProperty, landedDistanceStandardDeviationProperty ],
      ( average, standardDeviation ) => {
        if ( average !== null && standardDeviation !== null ) {
          averageDistanceText.x = modelViewTransform.modelToViewX( average );
          sdTextLeft.x = modelViewTransform.modelToViewX( average - standardDeviation );
          sdTextRight.x = modelViewTransform.modelToViewX( average + standardDeviation );
        }
      } );

    const options = optionize<DataMeasuresFieldOverlayOptions, SelfOptions, NodeOptions>()( {
      children: [ averageDistanceText, sdTextLeft, sdTextRight ]
    }, providedOptions );

    super( options );
  }
}

projectileDataLab.register( 'DataMeasuresFieldOverlay', DataMeasuresFieldOverlay );
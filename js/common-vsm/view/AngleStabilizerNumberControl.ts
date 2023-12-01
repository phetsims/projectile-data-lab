// Copyright 2023, University of Colorado Boulder

/**
 * A specific NumberControl for this sim that doesn't have tweaker buttons.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { Text, TextOptions } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PDLConstants from '../../common/PDLConstants.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';

type SelfOptions = EmptySelfOptions;
type AngleStabilizerNumberControlOptions = SelfOptions & NumberControlOptions;

export default class AngleStabilizerNumberControl extends NumberControl {

  /**
   * Auxiliary function that creates a NumberControl
   * @param labelString - label for the parameter
   * @param valueProperty - the Property that is set and linked to
   * @param range - range for the valueProperty value
   */
  public constructor( titleString: LocalizedStringProperty, valueProperty: PhetioProperty<number>, range: Range, providedOptions: AngleStabilizerNumberControlOptions ) {

    // TODO: Center the title and remove the number display - see https://github.com/phetsims/projectile-data-lab/issues/7
    const options = optionize<AngleStabilizerNumberControlOptions, EmptySelfOptions, NumberControlOptions>()( {
      titleNodeOptions: {
        maxWidth: 120
      },
      numberDisplayOptions: {
        enabled: false
      },
      sliderOptions: {
        majorTickLength: 12,
        minorTickLength: 5,
        minorTickSpacing: 1,
        tickLabelSpacing: 2,
        trackSize: new Dimension2( 50, 0.5 ),
        thumbSize: new Dimension2( 13, 22 ),
        thumbTouchAreaXDilation: 6,
        thumbTouchAreaYDilation: 4, // smaller to prevent overlap with above number spinner buttons
        majorTicks: [
          { value: range.min, label: new Text( ProjectileDataLabStrings.angleStabilizerNarrowStringProperty ) },
          { value: range.max, label: new Text( ProjectileDataLabStrings.angleStabilizerWideStringProperty ) }
        ]
      },
      includeArrowButtons: false,
      layoutFunction: NumberControl.createLayoutFunction4( {
        sliderPadding: 5
      } )
    }, providedOptions );

    super( titleString, valueProperty, range, options );
  }
}

projectileDataLab.register( 'AngleStabilizerNumberControl', AngleStabilizerNumberControl );
// Copyright 2023, University of Colorado Boulder

/**
 * A specific NumberControl for this sim that doesn't have tweaker buttons.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { Text } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PDLConstants from '../../common/PDLConstants.js';

// TODO: Get tandem working - see https://github.com/phetsims/projectile-data-lab/issues/7
type SelfOptions = EmptySelfOptions;
type AngleStabilizerNumberControlOptions = SelfOptions & WithRequired<NumberControlOptions, 'tandem'>;

export default class AngleStabilizerNumberControl extends NumberControl {

  /**
   * Auxiliary function that creates a NumberControl
   * @param labelString - label for the parameter
   * @param valueProperty - the Property that is set and linked to
   * @param range - range for the valueProperty value
   */
  public constructor( valueProperty: PhetioProperty<number>, providedOptions: AngleStabilizerNumberControlOptions ) {

    // TODO: Find a way to get the range from the angleStabilizerProperty - see https://github.com/phetsims/projectile-data-lab/issues/7
    const range = new Range( 0, PDLConstants.MAX_ANGLE_STANDARD_DEVIATION );

    // TODO: Center the title and remove the number display - see https://github.com/phetsims/projectile-data-lab/issues/7
    const options = optionize<AngleStabilizerNumberControlOptions, SelfOptions, NumberControlOptions>()( {
      layoutOptions: { topMargin: 7 },
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

    super( ProjectileDataLabStrings.angleStabilizerStringProperty, valueProperty, range, options );
  }
}

projectileDataLab.register( 'AngleStabilizerNumberControl', AngleStabilizerNumberControl );
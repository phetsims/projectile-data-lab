// Copyright 2023-2024, University of Colorado Boulder

/**
 * A specific NumberControl for this sim that changes the angle standard deviation for the launcher. Note that in the UI
 * it is named "Angle Stabilizer" to convey the mechanism, but throughout the code the actual value that is being set
 * is the standard deviation.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLConstants from '../../common/PDLConstants.js';
import PDLText from '../../common/view/PDLText.js';
import HSlider from '../../../../sun/js/HSlider.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
type AngleStandardDeviationNumberControlOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class AngleStabilizerSection extends VBox {

  public constructor( valueProperty: PhetioProperty<number>, providedOptions: AngleStandardDeviationNumberControlOptions ) {

    const range = PDLConstants.ANGLE_STABILIZER_RANGE;

    const slider = new HSlider( valueProperty, range, {
      layoutOptions: {
        stretch: true
      },
      tandem: providedOptions.tandem.createTandem( 'slider' ),
      majorTickLength: 12,
      minorTickLength: 5,
      tickLabelSpacing: 2,
      trackSize: new Dimension2( 50, 0.5 ),
      thumbSize: new Dimension2( 13, 22 ),
      thumbTouchAreaXDilation: 6,
      thumbTouchAreaYDilation: 4, // smaller to prevent overlap with above number spinner buttons
      phetioVisiblePropertyInstrumented: false
    } );
    slider.addMajorTick( range.min, new PDLText( ProjectileDataLabStrings.narrowStringProperty, {
      fontSize: 10,
      maxWidth: 60
    } ) );
    slider.addMajorTick( range.max, new PDLText( ProjectileDataLabStrings.wideStringProperty, {
      fontSize: 10,
      maxWidth: 60
    } ) );
    for ( let i = 1; i < range.max; i++ ) {
      slider.addMinorTick( i );
    }
    const options = optionize<AngleStandardDeviationNumberControlOptions, SelfOptions, VBoxOptions>()( {
      phetioFeatured: true,
      layoutOptions: {
        stretch: true,

        // Workaround since ToggleNode doesn't appear to support layoutOptions.stretch
        minContentWidth: 150
      },
      children: [
        new PDLText( ProjectileDataLabStrings.angleStabilizerStringProperty, {
          maxWidth: 150
        } ),
        slider
      ]
    }, providedOptions );
    super( options );
  }
}

projectileDataLab.register( 'AngleStabilizerSection', AngleStabilizerSection );
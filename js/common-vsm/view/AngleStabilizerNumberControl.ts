// Copyright 2023, University of Colorado Boulder

/**
 * A specific NumberControl for this sim that doesn't have tweaker buttons.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { VBox } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PDLConstants from '../../common/PDLConstants.js';
import PDLText from '../../common/view/PDLText.js';
import HSlider from '../../../../sun/js/HSlider.js';

type SelfOptions = EmptySelfOptions;
type AngleStabilizerNumberControlOptions = SelfOptions & WithRequired<NumberControlOptions, 'tandem'>;

export default class AngleStabilizerNumberControl extends VBox {

  public constructor( valueProperty: PhetioProperty<number>, providedOptions: AngleStabilizerNumberControlOptions ) {

    const range = PDLConstants.ANGLE_STABILIZER_RANGE;

    const options = optionize<AngleStabilizerNumberControlOptions, SelfOptions, NumberControlOptions>()( {}, providedOptions );

    const angleStabilizerSlider = new HSlider( valueProperty, range, {
      layoutOptions: {
        stretch: true
      },
      tandem: options.tandem.createTandem( 'angleStabilizerSlider' ),
      majorTickLength: 12,
      minorTickLength: 5,
      tickLabelSpacing: 2,
      trackSize: new Dimension2( 50, 0.5 ),
      thumbSize: new Dimension2( 13, 22 ),
      thumbTouchAreaXDilation: 6,
      thumbTouchAreaYDilation: 4 // smaller to prevent overlap with above number spinner buttons
    } );
    angleStabilizerSlider.addMajorTick( range.min, new PDLText( ProjectileDataLabStrings.angleStabilizerNarrowStringProperty, {
      fontSize: 10,
      maxWidth: 60
    } ) );
    angleStabilizerSlider.addMajorTick( range.max, new PDLText( ProjectileDataLabStrings.angleStabilizerWideStringProperty, {
      fontSize: 10,
      maxWidth: 60
    } ) );
    for ( let i = 1; i < range.max; i++ ) {
      angleStabilizerSlider.addMinorTick( i );
    }
    super( {
      children: [
        new PDLText( ProjectileDataLabStrings.angleStabilizerStringProperty, {
          maxWidth: 150
        } ),
        angleStabilizerSlider
      ]
    } );
  }
}

projectileDataLab.register( 'AngleStabilizerNumberControl', AngleStabilizerNumberControl );
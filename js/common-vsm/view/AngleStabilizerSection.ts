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
import PDLText from '../../common/view/PDLText.js';
import HSlider from '../../../../sun/js/HSlider.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import angleStabilizerClick_mp3 from '../../../sounds/angleStabilizerClick_mp3.js';
import PDLConstants from '../../common/PDLConstants.js';

const DISTANCE_BETWEEN_MINOR_TICKS = 1 / ( PDLConstants.ANGLE_STANDARD_DEVIATION_RANGE.getLength() );

const filter = new BiquadFilterNode( phetAudioContext, {
  type: 'lowpass',
  Q: 1,
  frequency: 800
} );

const minMaxFilter = new BiquadFilterNode( phetAudioContext, {
  type: 'bandpass',
  Q: 1,
  frequency: 600
} );

const angleStabilizerSoundClip = new SoundClip( angleStabilizerClick_mp3, {
  additionalAudioNodes: [ filter ]
} );
const angleStabilizerMinSoundClip = new SoundClip( angleStabilizerClick_mp3, {
  additionalAudioNodes: [ minMaxFilter ],
  initialPlaybackRate: 0.8
} );
const angleStabilizerMaxSoundClip = new SoundClip( angleStabilizerClick_mp3, {
  additionalAudioNodes: [ minMaxFilter ],
  initialPlaybackRate: 1.6
} );

soundManager.addSoundGenerator( angleStabilizerSoundClip, { categoryName: 'user-interface' } );
soundManager.addSoundGenerator( angleStabilizerMinSoundClip, { categoryName: 'user-interface' } );
soundManager.addSoundGenerator( angleStabilizerMaxSoundClip, { categoryName: 'user-interface' } );

type SelfOptions = EmptySelfOptions;
type AngleStandardDeviationNumberControlOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class AngleStabilizerSection extends VBox {

  public constructor( angleStabilizerProperty: PhetioProperty<number>, providedOptions: AngleStandardDeviationNumberControlOptions ) {
    const playbackRateMapper = ( value: number ) => Utils.linear( 0, 1, 1, 1.4, value );

    const slider = new HSlider( angleStabilizerProperty, new Range( 0, 1 ), {
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
      phetioVisiblePropertyInstrumented: false,

      // This is a lot like the defaults in ValueChangeSoundPlayer with the following differences:
      // 1. The pitch goes down as you go to the right
      // 2. Different sound clips
      // 3. PlaybackRateMappers change the pitch as you cross tick marks
      soundGenerator: new ValueChangeSoundPlayer( new Range( 0, 1 ), {
        middleMovingUpSoundPlayer: angleStabilizerSoundClip,
        middleMovingDownSoundPlayer: angleStabilizerSoundClip,
        middleMovingUpPlaybackRateMapper: playbackRateMapper,
        middleMovingDownPlaybackRateMapper: playbackRateMapper,
        interThresholdDelta: DISTANCE_BETWEEN_MINOR_TICKS,
        // constrainValue: ( value: number ) => Utils.roundToInterval( value, 0.000000001 ),
        minSoundPlayer: angleStabilizerMinSoundClip,
        maxSoundPlayer: angleStabilizerMaxSoundClip,
        minimumInterMiddleSoundTime: 0.035
      } )
    } );
    slider.addMajorTick( 0, new PDLText( ProjectileDataLabStrings.wideStringProperty, {
      fontSize: 10,
      maxWidth: 60
    } ) );
    slider.addMajorTick( 1, new PDLText( ProjectileDataLabStrings.narrowStringProperty, {
      fontSize: 10,
      maxWidth: 60
    } ) );

    // Compensate for round-off error, prevent drawing a minor tick mark over the rightmost major tick mark
    const MACHINE_EPSILON = 1E-6;
    for ( let i = DISTANCE_BETWEEN_MINOR_TICKS; i < 1 - MACHINE_EPSILON; i += DISTANCE_BETWEEN_MINOR_TICKS ) {
      slider.addMinorTick( i );
    }
    const options = optionize<AngleStandardDeviationNumberControlOptions, SelfOptions, VBoxOptions>()( {
      phetioFeatured: true,
      topMargin: 4,
      visiblePropertyOptions: {
        phetioFeatured: true
      },
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
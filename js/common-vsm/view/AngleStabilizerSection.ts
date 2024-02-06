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
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import generalBoundaryBoopSoundPlayer from '../../../../tambo/js/shared-sound-players/generalBoundaryBoopSoundPlayer.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import angleStabilizerClick_mp3 from '../../../sounds/angleStabilizerClick_mp3.js';
import SoundClipPlayer from '../../../../tambo/js/sound-generators/SoundClipPlayer.js';
import generalBoundaryBoop_mp3 from '../../../../tambo/sounds/generalBoundaryBoop_mp3.js';

const filter = new BiquadFilterNode( phetAudioContext, {
  type: 'lowpass',
  Q: 1,
  frequency: 800
} );

const DEFAULT_MIN_SOUND_PLAYER = new SoundClipPlayer( generalBoundaryBoop_mp3, {
  soundClipOptions: {
    initialOutputLevel: 0.2,
    initialPlaybackRate: 1 / Math.pow( 2, 1 / 6 ) // a major second lower
  },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

const angleStabilizerSoundClip = new SoundClip( angleStabilizerClick_mp3, {
  additionalAudioNodes: [ filter ]
} );
soundManager.addSoundGenerator( angleStabilizerSoundClip, { categoryName: 'user-interface' } );

type SelfOptions = EmptySelfOptions;
type AngleStandardDeviationNumberControlOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class AngleStabilizerSection extends VBox {

  public constructor( valueProperty: PhetioProperty<number>, providedOptions: AngleStandardDeviationNumberControlOptions ) {

    const range = PDLConstants.ANGLE_STABILIZER_RANGE;
    const PITCH_SCALE_FACTOR = 4;

    const playbackRateMapper = ( value: number ) => Utils.linear( 0, 8, 1.4 / PITCH_SCALE_FACTOR, 1 / PITCH_SCALE_FACTOR, value );

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
      phetioVisiblePropertyInstrumented: false,

      // This is a lot like the defaults in ValueChangeSoundPlayer with the following differences:
      // 1. The pitch goes down as you go to the right
      // 2. Different sound clips
      // 3. PlaybackRateMappers change the pitch as you cross tick marks
      soundGenerator: new ValueChangeSoundPlayer( new Range( 0, 8 ), {
        middleMovingUpSoundPlayer: angleStabilizerSoundClip,
        middleMovingDownSoundPlayer: angleStabilizerSoundClip,
        middleMovingUpPlaybackRateMapper: playbackRateMapper,
        middleMovingDownPlaybackRateMapper: playbackRateMapper,
        interThresholdDelta: 1,
        // constrainValue: ( value: number ) => Utils.roundToInterval( value, 0.000000001 ),
        minSoundPlayer: generalBoundaryBoopSoundPlayer,
        maxSoundPlayer: DEFAULT_MIN_SOUND_PLAYER,
        minimumInterMiddleSoundTime: 0.035
      } )
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
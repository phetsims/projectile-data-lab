// Copyright 2024, University of Colorado Boulder

/**
 * MeanTone is a class that plays a sound at a frequency based on the value of the mean.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @auther Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import { playbackRateForPosition } from './ProjectileSound.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import numberTone_mp3 from '../../../sounds/numberTone_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';

// This is the dominant frequency of numberTone_mp3. If the audio file is changed, this will need to be updated.
const E3 = 164.81; // Hz

const INITIAL_OUTPUT_LEVEL = 0.2;

// Filter to make the mean sound different from the main sound and from the median sound
const meanFilter = new BiquadFilterNode( phetAudioContext, {
  type: 'bandpass',
  Q: 2
} );

const meanSoundClip = new SoundClip( numberTone_mp3, {
  initialOutputLevel: INITIAL_OUTPUT_LEVEL,
  additionalAudioNodes: [ meanFilter ]
} );

soundManager.addSoundGenerator( meanSoundClip );

export class MeanTone {
  public static playMean( value: number ): void {
    const playbackRate = playbackRateForPosition( value );

    // set the frequency of the band pass filter to be equal to the frequency of the adjusted sound
    const frequency = E3 * playbackRate;
    meanFilter.frequency.setTargetAtTime( frequency, phetAudioContext.currentTime, 0 );

    meanSoundClip.setPlaybackRate( playbackRate );
    meanSoundClip.play();
  }
}

projectileDataLab.register( 'MeanTone', MeanTone );
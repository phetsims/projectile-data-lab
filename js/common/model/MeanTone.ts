// Copyright 2024-2026, University of Colorado Boulder

/**
 * MeanTone is a class that plays a sound at a frequency based on the value of the mean.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @auther Matthew Blackman (PhET Interactive Simulations)
 */

import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import meanTone_wav from '../../../sounds/meanTone_wav.js';
import { playbackRateForPosition } from './ProjectileSound.js';

const meanSoundClip = new SoundClip( meanTone_wav );

soundManager.addSoundGenerator( meanSoundClip );

export class MeanTone {
  public static playMean( value: number, outputLevel = 0.25 ): void {
    const playbackRate = playbackRateForPosition( value );
    meanSoundClip.setOutputLevel( outputLevel );
    meanSoundClip.setPlaybackRate( playbackRate );
    meanSoundClip.play();
  }
}

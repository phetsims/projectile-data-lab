// Copyright 2024, University of Colorado Boulder

/**
 * MeanTone is a class that plays a sound at a frequency based on the value of the mean.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @auther Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import { playbackRateForPosition } from './ProjectileSound.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import meanTone_wav from '../../../sounds/meanTone_wav.js';
import soundManager from '../../../../tambo/js/soundManager.js';

const meanSoundClip = new SoundClip( meanTone_wav, { initialOutputLevel: 0.25 } );

soundManager.addSoundGenerator( meanSoundClip );

export class MeanTone {
  public static playMean( value: number ): void {
    const playbackRate = playbackRateForPosition( value );
    meanSoundClip.setPlaybackRate( playbackRate );
    meanSoundClip.play();
  }
}

projectileDataLab.register( 'MeanTone', MeanTone );
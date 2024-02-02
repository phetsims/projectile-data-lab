// Copyright 2024, University of Colorado Boulder

/**
 * Play the landing sound at a given x position.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
import projectileDataLab from '../../projectileDataLab.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import landing_mp3 from '../../../sounds/landing_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Utils from '../../../../dot/js/Utils.js';

const landSoundClip = new SoundClip( landing_mp3, {
  initialOutputLevel: 1
} );
soundManager.addSoundGenerator( landSoundClip );

export default class LandingSound {
  public static play( x: number ): void {
    const playbackRate = Utils.linear( 0, 100, 0.5, 3, x );
    landSoundClip.setPlaybackRate( playbackRate );
    landSoundClip.play();
  }
}

projectileDataLab.register( 'LandingSound', LandingSound );
// Copyright 2024, University of Colorado Boulder

/**
 * Play the landing sound at a given x position.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
import projectileDataLab from '../../projectileDataLab.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Utils from '../../../../dot/js/Utils.js';
import ProjectileType, { CANNONBALL, PIANO, PUMPKIN } from './ProjectileType.js';
import cannonballLand_mp3 from '../../../sounds/cannonballLand_mp3.js';
import pumpkinLand_mp3 from '../../../sounds/pumpkinLand_mp3.js';
import pianoLand_mp3 from '../../../sounds/pianoLand_mp3.js';
import cannonballTone_mp3 from '../../../sounds/cannonballTone_mp3.js';
import pumpkinTone_mp3 from '../../../sounds/pumpkinTone_mp3.js';
import pianoTone_mp3 from '../../../sounds/pianoTone_mp3.js';
import dotRandom from '../../../../dot/js/dotRandom.js';

const cannonballToneSoundClip = new SoundClip( cannonballTone_mp3, { initialOutputLevel: 0.1 } );
const pumpkinToneSoundClip = new SoundClip( pumpkinTone_mp3, { initialOutputLevel: 0.1 } );
const pianoToneSoundClip = new SoundClip( pianoTone_mp3, { initialOutputLevel: 0.1 } );

const cannonballLandSoundClip = new SoundClip( cannonballLand_mp3, { initialOutputLevel: 0.06 } );
const pumpkinLandSoundClip = new SoundClip( pumpkinLand_mp3, { initialOutputLevel: 0.1 } );
const pianoLandSoundClip = new SoundClip( pianoLand_mp3, { initialOutputLevel: 0.02 } );

soundManager.addSoundGenerator( cannonballToneSoundClip );
soundManager.addSoundGenerator( pumpkinToneSoundClip );
soundManager.addSoundGenerator( pianoToneSoundClip );

soundManager.addSoundGenerator( cannonballLandSoundClip );
soundManager.addSoundGenerator( pumpkinLandSoundClip );
soundManager.addSoundGenerator( pianoLandSoundClip );

export const playbackRateForPosition = ( x: number ): number => {
  return Utils.linear( 0, 100, 0.2, 3.5, x );
};

//REVIEW Lots of if-then-else logic and duplicated code here. Should soundClip be an attribute of ProjectileType?
export default class ProjectileSound {

  public static play( projectileType: ProjectileType, x: number, isLanding: boolean ): void {

    const playbackRate = playbackRateForPosition( x );

    if ( projectileType === CANNONBALL ) {
      cannonballToneSoundClip.setPlaybackRate( playbackRate );
      cannonballToneSoundClip.play();

      if ( isLanding ) {
        // Choose a random playback rate for the landing sound
        cannonballLandSoundClip.setPlaybackRate( dotRandom.nextDoubleBetween( 0.8, 1.2 ) );
        cannonballLandSoundClip.play();
      }
    }
    else if ( projectileType === PUMPKIN ) {
      pumpkinToneSoundClip.setPlaybackRate( playbackRate );
      pumpkinToneSoundClip.play();

      if ( isLanding ) {
        // Choose a random playback rate for the landing sound
        pumpkinLandSoundClip.setPlaybackRate( dotRandom.nextDoubleBetween( 0.8, 1.3 ) );
        pumpkinLandSoundClip.play();
      }
    }
    else if ( projectileType === PIANO ) {
      pianoToneSoundClip.setPlaybackRate( playbackRate );
      pianoToneSoundClip.play();

      if ( isLanding ) {
        // Choose a random playback rate for the landing sound
        pianoLandSoundClip.setPlaybackRate( dotRandom.nextDoubleBetween( 0.9, 1.2 ) );
        pianoLandSoundClip.play();
      }
    }
  }
}

projectileDataLab.register( 'ProjectileSound', ProjectileSound );
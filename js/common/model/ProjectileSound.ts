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
import landingTone_mp3 from '../../../sounds/landingTone_mp3.js';
import pdlCannonLand_mp3 from '../../../sounds/pdlCannonLand_mp3.js';
import pdlPumpkinLand_mp3 from '../../../sounds/pdlPumpkinLand_mp3.js';
import pdlPianoLand_mp3 from '../../../sounds/pdlPianoLand_mp3.js';

const toneSoundClip = new SoundClip( landingTone_mp3, { initialOutputLevel: 0.2 } );
soundManager.addSoundGenerator( toneSoundClip );

const cannonballSoundClip = new SoundClip( pdlCannonLand_mp3, { initialOutputLevel: 0.1 } );
soundManager.addSoundGenerator( cannonballSoundClip );

const pianoSoundClip = new SoundClip( pdlPianoLand_mp3, { initialOutputLevel: 0.1 } );
soundManager.addSoundGenerator( pianoSoundClip );

const pumpkinSoundClip = new SoundClip( pdlPumpkinLand_mp3, { initialOutputLevel: 0.1 } );
soundManager.addSoundGenerator( pumpkinSoundClip );

export const playbackRateForPosition = ( x: number ): number => {
  return Utils.linear( 0, 100, 0.2, 3.5, x );
};

export default class ProjectileSound {

  public static play( projectileType: ProjectileType, x: number ): void {

    const playbackRate = playbackRateForPosition( x );

    if ( projectileType === CANNONBALL ) {
      cannonballSoundClip.setPlaybackRate( playbackRate );
      cannonballSoundClip.play();
    }
    else if ( projectileType === PUMPKIN ) {
      pumpkinSoundClip.setPlaybackRate( playbackRate );
      pumpkinSoundClip.play();
    }
    else if ( projectileType === PIANO ) {
      pianoSoundClip.setPlaybackRate( playbackRate );
      pianoSoundClip.play();
    }
  }
}

projectileDataLab.register( 'ProjectileSound', ProjectileSound );
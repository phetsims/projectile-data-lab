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
import ProjectileType, { CANNONBALL, PIANO, PUMPKIN } from './ProjectileType.js';
import pdlCannonLandandGeneralThudV1_mp3 from '../../../sounds/pdlCannonLandandGeneralThudV1_mp3.js';
import pdlPianoLand_mp3 from '../../../sounds/pdlPianoLand_mp3.js';
import pdlPumpkinLand_mp3 from '../../../sounds/pdlPumpkinLand_mp3.js';

const landSoundClip = new SoundClip( landing_mp3, { initialOutputLevel: 1 } );
soundManager.addSoundGenerator( landSoundClip );

// TODO: https://github.com/phetsims/projectile-data-lab/issues/140 The sound levels are not supposed to be balanced until the end.
// However, with initialOutputLevel: 1 here it is impossible to hear the landSoundClip (which conveys the pitch) at all.
const cannonSoundClip = new SoundClip( pdlCannonLandandGeneralThudV1_mp3, { initialOutputLevel: 0.2 } );
soundManager.addSoundGenerator( cannonSoundClip );

const pianoSoundClip = new SoundClip( pdlPianoLand_mp3, { initialOutputLevel: 0.2 } );
soundManager.addSoundGenerator( pianoSoundClip );

const pumpkinSoundClip = new SoundClip( pdlPumpkinLand_mp3, { initialOutputLevel: 0.2 } );
soundManager.addSoundGenerator( pumpkinSoundClip );

export const playbackRateForPosition = ( x: number ): number => {
  return Utils.linear( 0, 100, 0.5, 3, x );
};

export default class LandingSound {

  public static play( projectileType: ProjectileType, x: number ): void {
    landSoundClip.setPlaybackRate( playbackRateForPosition( x ) );
    landSoundClip.play();

    if ( projectileType === CANNONBALL ) {
      // cannonSoundClip.setPlaybackRate( playbackRateForPosition( x ) );
      cannonSoundClip.play();
    }
    else if ( projectileType === PUMPKIN ) {
      // pumpkinSoundClip.setPlaybackRate( playbackRateForPosition( x ) );
      pumpkinSoundClip.play();
    }
    else if ( projectileType === PIANO ) {
      // pianoSoundClip.setPlaybackRate( playbackRateForPosition( x ) );
      pianoSoundClip.play();
    }
  }
}

projectileDataLab.register( 'LandingSound', LandingSound );
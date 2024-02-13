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
import pdlPianoLandv1_mp3 from '../../../sounds/pdlPianoLandv1_mp3.js';
// eslint-disable-next-line default-import-match-filename
import pdlPumpkinLand001_mp3 from '../../../sounds/pdlPumpkinLand-001_mp3.js';
import { dotRandom } from '../../../../dot/js/imports.js';

const landSoundClip = new SoundClip( landing_mp3, { initialOutputLevel: 1 } );
soundManager.addSoundGenerator( landSoundClip );

// TODO: https://github.com/phetsims/projectile-data-lab/issues/147 The sound levels are not supposed to be balanced until the end.
// However, with initialOutputLevel: 1 here it is impossible to hear the landSoundClip (which conveys the pitch) at all.
const cannonSoundClip = new SoundClip( pdlCannonLandandGeneralThudV1_mp3, { initialOutputLevel: 1 } );
soundManager.addSoundGenerator( cannonSoundClip );

const pianoSoundClip = new SoundClip( pdlPianoLandv1_mp3, { initialOutputLevel: 0.4 } );
soundManager.addSoundGenerator( pianoSoundClip );

const pumpkinSoundClip = new SoundClip( pdlPumpkinLand001_mp3, { initialOutputLevel: 0.4 } );
soundManager.addSoundGenerator( pumpkinSoundClip );

export const playbackRateForPosition = ( x: number ): number => {
  return Utils.linear( 0, 100, 0.5, 3, x );
};

const toPlaybackRate = ( semitones: number ): number => Math.pow( 2, semitones / 12 );

export default class LandingSound {

  public static play( projectileType: ProjectileType, x: number ): void {
    landSoundClip.setPlaybackRate( playbackRateForPosition( x ) );
    landSoundClip.play();

    const random = dotRandom.nextDoubleBetween( -4, 4 );
    const playbackRate = toPlaybackRate( random );
    if ( projectileType === CANNONBALL ) {
      cannonSoundClip.setPlaybackRate( playbackRate );
      cannonSoundClip.play();
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

projectileDataLab.register( 'LandingSound', LandingSound );
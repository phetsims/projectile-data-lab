/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/wav;base64,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';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;
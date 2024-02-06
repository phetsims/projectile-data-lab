/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
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
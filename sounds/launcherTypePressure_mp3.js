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
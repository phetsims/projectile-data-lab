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
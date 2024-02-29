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
/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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qqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqq//tAxMmDxpABIaGEQDAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqr/+0LEroPAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqr/+0LEroPAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+0LEroPAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+0LEroPAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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
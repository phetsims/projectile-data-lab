/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xDE84AFyCVD2cAAAISDaHu0AAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMTsAcM0GUHMYeJgSIKnuZwYFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxPcAQsQXM8xhgGCshOT9nCQdVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xDE6gPE/C8Zh7DE6AAAP8AAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMTWA8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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
/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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aeLf+e///tX//7VMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sgxPUARqRZK+9g4yCmBWW93JhcVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMT5gcWwLUHOayCoZANo+bzgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxPCAw4wZP81jICBhgyh5nDAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xDE/4ADPBk11YAAKT6Spv81AAhVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMT0AAfYZR+ZRoAAAAA0g4AABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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
/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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qqpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqq//tCxK6DwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//tCxK6DwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//tCxK6DwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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
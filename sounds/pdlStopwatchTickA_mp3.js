/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAGAAAE/wAqKioqKioqKioqKioqKioqVVVVVVVVVVVVVVVVVVVVVVWAgICAgICAgICAgICAgICAqqqqqqqqqqqqqqqqqqqqqqrV1dXV1dXV1dXV1dXV1dXV1f////////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAK3QgAAOAAABP+UbXHbAAAAAAD/+0DEAAAE8AM7tAEAAcOgrz8YsAKt1vbaZwEAIi4P2B+IDispDGCAZUGN2/1ghL/nP/y5//ykEP/hj/l2RYVYZpZoVlQ/FGIi0WAyUMtygSEaorAfM0FeIBYGhKgQCSATRzEG5uSDRRFQo+SXduNSXuJkl6x81M9aqTk0lsb5P0nVtj+v3nzjKZNvv5rQNkVz8T7LZmn8R/Httn/8MzgndOf0S7xryFJCe/nEc0qbS2jXa72qxP/7QsQEAAoc3424Y4ARQBltv55QABAIpgIBDwwO69Z/jHx/kGpQw5XV1OHhCIqILzSxcIAB9zhEZ0YaDQsTZFb/zDDv/9SDOYt/3/yAmNGqOK/7gsXidn/5QoAgQEGzOVdVKtgg05HlhoLKXd4qDjVKtOpXLnSdgK1xGiARDhnRWNZZUej9xFjNmMb//RQW136spWGC4qUv+njRyFBQ98RKfiUSu8qGjWRtGunqE3Z5uJmnSislsv/7QsQEgAm401XmFHOAwpUl/BAJwKapgSBk6BK9oLpj8m2OUJe9aFZdbR6rGejqwWXlDorQaK2Qz/o5UlAUOl3/5jW/Lq1dsCiYBDv+sZKuXnhN//WMfz3QWZTJAVgaWoS4R5k0I75d7aM9eYoVH0coYIOX//qjt/+YoMQ7thni2r//62//3WvAoqpMQU1FMy45OS41qqqqqqqqqqqqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqv/7QsQWA8AAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7QsRnA8AAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7QsSug8AAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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
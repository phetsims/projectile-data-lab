/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAADkQBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgICAgICAgICAgICAgICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP////////////////////////////////8AAAA3TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAPrQgAAOAAAA5FJOMW/AAAAAAD/+0DEAAAIbSdR9BKAAS+u7wMCcAAAmHcJdlrAAAA+QMC/MhG1O/U7+/qd/0I0hG/f//Pnf9SEb/9KkJ0ITQjKJh8XIAYHPJ/oQjHDgcYu8oD///LxO8oCH//L47z5Gb5hjVNN9BELEKAXGqjWEvMfabJD3tzELHnnuk6OFRr3PbU9TmLOJDPUw6hf/hoSGMYbhGMkEl2O5EJ/+gu9/9Bov/6DY5WAACSOQgxIlr/6Qwoi08elD//7QsQIgAodh228FQAZXSVs9BYJeFYfKrNtNb9D9CICa/6/0AvFQhHpCcaxx8sY6V6kphoqiY5pLdEdV67cyh7/qSqan//lSU1Zpv/////+ea0mBi+4//9m5Ckk3V95ECFe/A5Kw8cbXr/xYrYYOx7H9ofGQBFlNveaUnJ4eYpm9CIcPkQhEtdVIRGTXRG34UqIAiPrqX/sszms7upS//rKUw7DCU5//6wVFxEql3+sYJJDbsFS3//7QsQFAAoRK2WkoEvQ/ZCm8BMNKOSxMAwIimDWIIqQAsKqUdKqqL5Iem1BS7XKipv9dyqyxjKUpSyl5lm6svp1LlKitdH///UpAJ4Y5ZWVDGRalmM6PUoCw6GhdrZNyT1T5o0WHv62fzqsFCTUFy+b+5rRP7GqtY1VVVjgo4eYYViUYJR9Z1s7XKiL4K8qEnw0t5Go963f///RTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVf/7QsQOA8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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
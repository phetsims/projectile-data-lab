/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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JMVAtIADB8IF5kx5GCt4wIQgoHBQuOY9i51dZjJLMthZXjlm4B2YEHhgMLFYOBoEBQEWBNeyMaT/+0LEXoAIdFUi7XRK8KoD4/aaEAYRpIZoSFbYAZO28ovGWw0ZRKhiYlmgSnd/NNGQX6Sx5j1XgZ/BBYQGwEXGn+f////9Pfs5X6mVXgAIA2UQBw4d5lTVYKLrQMzIu8r4GBkx8cTXF9PoNAz6KkJYlMDCwA5BvCJ1J1SRsi3//OCORSpFS6jlf0cRen//6ACBwAAcKhuWb852fh1hIoAAtMGAWMXQdNkr7PkrLM4jIMjRjMUQ7MX/+0LEeAAQoJFbuc4CEQwMp6u5IAaAqMixiBwNrge6TT4EFDkVP/uUIgVn//68sKAATmH+34OSL16rD0wDwn0XsWa12xfMqY4JNaGeI3f93d7ft6Gu/Rs+7cPto5ouAfq7qhJEAApRwBbgjW6771IGAkIA+BwGgIOfdKf/b///+r/S//9GEC8neSl0tZCIuk/3ggEAAAAAVwjuZ7NRvAgmQA2rgMA5gwCm3x2fntiCEDBkCgQxECD/+0DEZQAINF8abHSq0MqF42h0YNZ5WGsUq4RgYvAoMQacePQjDoFAcPLWAwzZwZ/fhq9TBU4pa7+NwPhbMOIYySWAuPzDA8ZDvGs0+YsZWDGZKNCI4y8EDEgQMAhP25JnVu////1sgIZ/KCAxJUQAAABgYADpxXmWW2GuBFnStsBRVZwYHERkU3Gp78eXOIG3QAa04BlRQNiiXJknWMkf//9JKOoZonkRBUXCTrf/ypLwBuOfbf/7QsR7AATwJRm1MYAyFZEr9znCQvAbSipSOA4bAI2/jLxoENXtD16wzIDL/P3IAcUOQAxqM5Fs9F/+VBaj6v/EX+j/Kkf//kv//QpgCA/H/ATj00IrzO2VXJ07w8HydCrcI8xp9H/0mW+PX//NdAa9Opn67P0bipACd32tuDur8J4QemUECULHzAWchl2AyDZzUrb+37fV+KSX+0f/99H6m1V1JkoAgO2Wp0RRMBR2TMOaOs0GkP/7QsR1gAhkdz+9ygAw8Q2mqF2U5gSk4zHAmUprBg8QsNBs6t1fW57lo+txXR/////9XnlO7w7uqvGAAi0hREIiKEjR2k9N43TmIKFUiT2SaZXC7YCdmQhaMD9BWsPqqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7QsSGgAVoMR7jBeDwsITiKBHonqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7QsSrgEZMNQRjYSjwqwfd/Jewt6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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
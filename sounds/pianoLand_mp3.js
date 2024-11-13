/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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WjdBnRfePfVVACAd4rYUgLMIc1C1l6EdazzHM/XJu8SqDOtjkweoPSIm//tAxFOCSESVLuwwyxEMEqPBhgpYnT7LGjfWQ0L5HZU468RfG991IznUEHMZ//2f6n7v7V0XW6D9RKYWG7BMJWN0FCYYeNiD7wwz9Y1izAaaLeXWA2GlRjrAqWtEosSeVaNXzhcNXsyy+Y83DsHKDK3tko5qjdYAAAXeUp3FtiKQ9Fwmss7RsbQl5bW+hxG6Akp1FMbxZonLm8yDXZGmoluTvoi4VVI3FvaEhtbdWc0Nbm3zvb//+0LEYQNILIEgZ6TNUQYSokGGClj/+lP/+7/9tVmRj0EaGUHEMlvJ8LcX5PLFi2noBiWytAO4esJ1qwiFh4yVUHo2dJv6SWCdYk1Zeu697rVoHZdOqW0Spf8j////0wAUoALPRzA3jMgBVWUMST3Fx0fYupGEo6tZoSVmmkcJbhLHbZYkuInwaOrxN/hQ1/xFv9v/v9gATUkiSNOEgYgmhYHTV76aLrJaZllMQU1FMy45OS41VVX/+0LEcIPIzG8MbD0pEQoOYAGHsGpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVX/+0LEfQBGPFj0Z7DDkGeDn3QTGB9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+0LEqAPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+0LEroPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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
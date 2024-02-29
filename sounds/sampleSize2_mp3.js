/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAKAAAH2gAZGRkZGRkZGRkZMzMzMzMzMzMzM0xMTExMTExMTExmZmZmZmZmZmZmgICAgICAgICAgJmZmZmZmZmZmZmzs7Ozs7Ozs7OzzMzMzMzMzMzMzObm5ubm5ubm5ub///////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAPuQgAAOAAAB9oYZS4oAAAAAAD/+0DEAAABMALzFBCAMg+NpW8/0ABZPwAAUP3RA4Hw2rk4HDGG0AAFMBCAPkQ7EZJYiMGG+CEpg0SLIYDKAWmBXgJZwuCewaaCR6nffbmJlZBNaYAoASLAmB7g2Bg8wG8YGaEZmCXAOFqWGzbDmyqymjgxHMZVU92+aMieYUhyRBmYACayEGAHhh/llw4PCy79BgEQEyaI///8qnYfshQO+AGqAAMKTW9yQhAcwEAFWkwBBww9GP/7QsQJggoETztd14Aw8AVmaaw8zgyTNY2d6I1JFIxhGIw2CdEkucAgGR+fp94FlbESoAdBzIVG9a23/XFoMWE+jHst+r/Q9f6f9W//f/u+v/U97l99F6uoZcZUJQPNEFN/sO3EA9wKUxKPoiQqRjJ4fLFaVDREGwG2jC3Y/gNhppo79W76/9X///+uv8tVAAAti7ffgMRBJhHdVrxK9AAn6qmuxzgJIkwyLuQ9OEkCnpb+vub/Rv/7QsQUAgbYHx9GYSLwvgMiNMfoRvuu+jyLUrS/dlX06E8iSBQs3+wtwU25epCrKmtbdNbrVSAtbwgAyD9g5ZYRvudjUrscwU/s//0f/Z6fd/6KFQAAvdv4G3JgQsYoiQhyogPiUU1LwKAVD9g+d7QKRH+AiQVIsrLNCT6v//7v/r//Yro2PbipmtlutkvHyeIoFCosLXri3RvM9Su+2ujdcnV70f9/snv5L8t7VLcihXHqDUEhPP/7QsQxggaUGxlDPYJwpwDd9PCMBIEaiZwZB4PEaAWhlyVDJlDAwaWWUEDBoHjQ9moWFfyoqLNqF2Oi3FRT/F/6xTizP//VAAAAAJCQjFYsGA3Aww/8rIMLGER/8vtHNRmzF/9i26oKF7wB3FO9nAaABqBc/oWlArE4vvidLu7M/7v93Xu//9//6cBwOjkclm7AwAAAABwDBny4wwCBv3QCEgCGuURgERyp49Eb5eZNGD1BXpgiQP/7QsRTA8a8TKwmJGEAAAA0goAABD+YHmEtGBlgDBpwwH6ZE+BdBgDymOEAFTynXrhHWX7F7TA0Ha5d0PeA1uQ0xxGQFAo+0ndn/C4KmBAIGE4YmCAIUTxSL/1/w7QQO16MkfWz////////2AABCEAlDABQFJhNzMAALMFAZBwImA46GSHaneDgmgp9GVI0GGYCJ+ltVqww16Hq80dCEB4+egr4T///rv////zoAoGgYBIgs5hkAf/7QsSJAAhgWzu5qQQSD4yotz/QApy+n6RBldm8GMOVGaTCU5j3hJmQAMuYJwLht+OaDJqtWSuRtcYlPfVvVgMeDX//////////+VoAAAKAADWySgZsJtXZiAxgAMxtAVhcixJHee9f///y1FP/Sv6P6lu/0I9//QCZJd/994EAACkpJwQ3CIW0e/j3gg/WDhxYP9TogdrH1diYffxn+j/dQkamO3tdParv/6YAAACCzccf8CxUDP/7QsR2gogUNTFd1gAxA4ahjb9gkgkRgBNHRKGp7vEQNfUDJj/9n/6Ny+yZuSpF/2okSXI7VgNVH+QZpWjkTSGngaBoGhKCudlg78GTuV/y1UxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVf/7QMSGggWMGwmsbwJwzYOjdDw8TlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tCxKcARXwVH6CZIjBqARuk8wQEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tCxK6DwAAAAAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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
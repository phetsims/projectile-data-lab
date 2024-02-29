/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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qw7wRFF+EtgMPCEcPhQcNEodWsGSgIEGsZ6NmEJqXUVo4EQnmgkgsFZN//tAxDcCBty5Gu2mYbEoiF4N7Www5e+7kTloZgq1v+z9X///////6Ak4w3CuxtE6HcEx2MHqqMsq3piPQ1CHfTANNeSDqb5lOkQmzcu2u4dlOp700Q7W/39iEf//f+n//0JuOCAE69MEAicUZDzxp2zb0ico3Kkb4DXY/lj35ptxQ8pKgsH+wl9a39PsuW3//N711SU2xAAWxadYB/2LSybQcgdgnCiMMiQDzgoS2yyPga65ZL3/+0LERwMHNDsAbuNAcMYGoQ3E4GbfXuQ5LP9n/+JRq0M1qTSwAFclyEQeF6FmnohAHAkyE/YutsxrgMWideq2pbv7r3b/TUo5ugZyYlowjgBQaA4WkNcx6Vwl/A5BlbKQcQ11rBxiIKgawrmRjcUNMl+F5MYw6BpUwGUFRgaD6xd5VhM5jfaECgUk1EAB5gKUA728xvXqAtsktmcmURrg/NUVayqKt+jidT7KfDDlVh/4sdxKd/H/+0LEYgMF5DUEbiZFMJUG4Y2ytG4n/RUBWA7bqAADkAV/AFZmVm11rW1CCLvg3kD2IsNK0PbR/SAjKwC5IAfgqUKkCVQG2BTs1RSArNAqhKFwLysi29m06TwcGbfkfPo3QU1yagHdsRttsAAAExGRoicClCYLF2CZCl+WQs+tjBtyYqtZiY7VnXY1tjttYFMMHT0WOSQxxiOxicsLzQ2JpKHkhD0J5UO1j7gZTEFNRTMuOTkuNVX/+0LEiIAH5DreD2eDQMkOX6m4DO5VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+0LEoIBEDCr/TSEhcLAI3LWkvG5VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+0LEywDEqCjzphkguIaGUpGHsEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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
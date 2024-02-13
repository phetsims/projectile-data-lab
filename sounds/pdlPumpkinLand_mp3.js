/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAMAAAJSAAVFRUVFRUVFSoqKioqKioqQEBAQEBAQEBVVVVVVVVVVVVqampqampqaoCAgICAgICAlZWVlZWVlZWVqqqqqqqqqqrAwMDAwMDAwNXV1dXV1dXV1erq6urq6urq//////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAPjQgAAOAAACUizspNuAAAAAAD/+0DEAAAEjAFBVDGAEcyi7rcegALlDmWSk1BHsWHy74nHH7g+t9Z/ny7+n/Of/DBQ5z//U7///8P3lsRJkJBkMhkNGERAIdEAVAQeFOyKsk5FUbLx0ITzUnDgUBsSCLJiUAUIw/MGHPaGDKsfBRWI6JaB5Zh9XGj1cvXQuXF4745975dhRdE4dtIKVkhPirmYGn0/zxH8xV36J/ZYoYD4wBrHta//AYoA3T9+pdZCBBAgAAFYSv/7QsQEgAo8P2/dowABPQ+udPYMOAM/DBgBqSg7XZbH5qA5mxVmIawqzRA+wkkStWT5SLjBE82HCYCBYgNeoDLAChUdHDCC4rFy9yWoXip1ap2ntMsch9zU37dKVCj1iTIJKSTTcuIOBVUI2D8R1Q4mZBA+0zZUxeCKEDiCCidMlrla6iAg05NiKmHSAhqg4VLjzL6lNScASRgVWgI+jp1qOjYrday3+2t1d7P1KlYAAABrJkqmRf/7QsQEgYnojW8HpM8BQxPuIPMNsPTzxDVs8TceKTG14laiNmDCyRRGYTTf/6xRgV62QEYxh9GkQEiEKLXdk+kWb76DE9qzR7CAuPeNeAjoVE4PrUXXKWJzJzqDQHKeDQvIgw3IvitEKXZvJ6dyAZQcECltCWu6uCJHqbxpVozlbqKO2+tz1u7gxUKLuGAqXdDqQWYAJYG1MYg9YrUvqoQ7RA0NVfQZZ/yepusmxGFACCt5WKghY//7QsQFgApIjXGGsGOBPhMsYYYZIMAeIYvBDlRmB0cT7TE6YZWl1jDOir2XAmVBQ/FJlI4fMypCjTNavzBhJIBGLTURFWvGuqPQ0sEj1yLnvFCl9lRm9q/7+336wglAAZR8yDbWHnhhy+4LAXoOVw3WJysuPlt22GWDSuMY62zoZj3pp6etbcymP0vbLWUQMLLKzFjth5hFTHi4TF5pxTzDl7VMhmlGSe2ZTFIvSpsgAA1hZi4GYv/7QsQFgAocR2uHpMRJRYwt+LYMeNpxFDTg2JWTAQKNYwysi95zbDZiGEMHjzrE2JIWs/u0mhlEMmub/3naRKXTC3Mtu8oW/es5//k/L21lxG+5uvdZUpyeB6hnUQSsSAstXjpFELYmD4VxLFQgsuqR/EQtnpyiVwP085LVUPjEKSikamQbJzQWoMCx56TwDSSYpzxIRxRVVpulZlbxzwEoqm/I4+oiqN+3+LLqKal4RRMARRMHA//7QsQFAAlAP3HGCSohR5Ks/PYIOPOhYHwNyySjoUNG6iIa00ugQZurKxvsrDQK0OBUEwyAwiqceSiCwUkBwaFm5gzhIxAmyzpEsUoe5kV1u//07xQEl0ZVEAAZSbsM4phbUFiqSBoLTRabcXGS5afZZcfYICAgQoKJQ3RTCpW1CsKdDFZZS/lLLthQnJc6V1PRFK23qv061YsySnZxlDSp0Os7lvvRG2/SYy/EUPFymRDKEMpHuf/7QsQIAAkMS1UHpMMBEgyqLpgwAJGIiiBEmOBpQNV3w3GTyHNgCljroajg6cDuskRJCY6eCQlP9bYqCpZOhGzp9h5swV1PmGIZ/av9YM51rQb4FR9DzhpMQYLCufHY6qVSiADpiwgKMMFvTrBhTGU6mazPMhUFhyZ4q4XOlpUqCab7NBOhW2061yZIUQj7fw1S1v9tuotFw2FotFoYAAGJQ6UttHk4b1CmKiuqt32uqvd6M/oPtP/7QMQSgA2o61+5l4AQpgHhd7QABoxGb/KGGLCbVD/1S0sCPXlK4wf/5xVTPWPyq2yl//7VGy6cI8Xeob63//7NtmbJ1ewS/W8xf///5pnDUG7DaLaDTOoO4MX7OkAAG4f7DUQCmzRn4Shg2IOVLtgqkrnsJunU+n+zx0yJf/3qPf//////ogHwAAAtklMlBBzEElQqxj/////6F3Ue7+nV+n+Kt7ft/+sAuAFA6MaQj/////6F//tCxBeBxEAJB00kQDBiAOCQsQQGdWjV/+r/d+Rt2J66AoAAAAEd0TbYDahSoELHf/+/QphaetTVVww4ABJgp+P9BQBlTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVV//tCxEsBQNADAoEEYDhCgF/0EIgGVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tCxJABwUADAICEQDgGAEAAsAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tCxK6DwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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
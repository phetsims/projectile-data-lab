/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAJAAAICgBhYWFhYWFhYWFhYYqKioqKioqKioqKnp6enp6enp6enp6urq6urq6urq6urr6+vr6+vr6+vr6+z8/Pz8/Pz8/Pz8/f39/f39/f39/f3+/v7+/v7+/v7+/v//////////////8AAABQTEFNRTMuMTAwBLkAAAAAAAAAABUgJAKmQQAB4AAACAo7fFwHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uwxAAAAuwLK7QwACoVEqb/PZBAIAAAF/AAAABxAAAEbAABw/Mf4B4j/AOAAIACAISykyh/fTgMAAAAGBEAYiGeZ9oJrAjFGdZBcYcoBaxknDIKDqMVQA0wMAKEEzaMQMNkHcwaARAEAkgqhfUPWALItaXUoGylk5M2lmwpNNmMEu/N2pYGCBYBqEvYE+fIP7+euNBSLYgvBPfuEknHG73fcPpoekNuX08F2VkfeFyHagAgUp6r/aAAYGo1BwRrDmykVaYSYQhg2AYmAOA8pmleDABwMAEwllr8vqpa1mmtl4ZBJHx8MzA76zFFAT4TUkgdxsiXEwSIcw9h6mqLaRLGQ1j1GFCtFqUWGYtMUfuqZN+l/60Lj8kAAD4qH7gAADAYg08ygJmrMUpDZQ4WtMIkzFj4wUlAAcAQFI9Axv0sVQxtpK4pms4/5CvIIt9dAjgJRMB7w6XICH9FiIK3/LpdSH8W1pRWn//qogAG9/h/aAAAYLSFQGQSI8BjdYQcYE0BfnErBohiZGIAIZFgpZJa5TVe1ymhgoBqCCUjt+Rjn+ouBbAKHKUnBiHEf+0iSaNagACJIenAw6A1jeXkaNOQQIwtwGThDAh+Z4AZMCAhiJiAd3IB7g0ZqVmqDhMhzFLf+aAa6HZotgABVomYC8AAAAwmBPzETl7PNQkxaPjZsGkCgVbiULFxoKzmo/8knu3IWeM/T3ACtW/+gCPwPcCt9TYIxIkiqKwBjGGCgSLB+pp7KkxBTUWqqqoASr79AAAAACAJGP6gYnMzUUbuKQFRluFNBa6bELkQBXvzDg86PvP4DQOA4S9QcFXxEBeBgij/+2DE4AAM5MUvveaAIUqP5HX9wHQGflHVTEFNRTMuMTAwVVVVVVVVAEyf27AAAAAkAs1Igs4sbCAwyIMuIfG+cqIYkOXLN8uMqNWg9ckq5AvQB6/uAAAhBCGeB9TTTSBFEDGTBCBJyqDNNvpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgGbz9AAAAAAUYOlQPA84dhGtAxWNTRrAAZhcEz/9goMlBdYaAC0bgYlPYLy2RVXVUxBTUUzLjEwMFVVVVVVVVVVAbu6AAAAAAAWgclE+3tE3hpkDkNo40/JUEz//d3MVhAIw8NG0TzDDOOE5YT7M+QNRgMgBhP/+yDE+wDI6Hklr+1DoNoK5TntHHQhEsSxLEgwPHHB4YAKTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpAOGh3VwAAAAaJ+1Vk6kxkwjWgBSa9Ox5YZdy7mJAeEo+XZgICFNVMQU1FMy4xMDBVVVVV//sQxPKAxbQpL+9zACByhGk5vDxEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xDE8wHD0BtJzmMAIGqDaLm9YAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMT4AMUwIzvO70AoaINo+bzgBFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxO4Bw1AbRczhgOBSg2j5nDAUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xDE9wDDEBk1zGXiIKOFp3mcMM1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMTpg8TMNSPMMGwgAAA/wAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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
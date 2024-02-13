/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAGAAAE/wAqKioqKioqKioqKioqKioqVVVVVVVVVVVVVVVVVVVVVVWAgICAgICAgICAgICAgICAqqqqqqqqqqqqqqqqqqqqqqrV1dXV1dXV1dXV1dXV1dXV1f////////////////////8AAAA8TEFNRTMuOTlyAZYAAAAAAAAAABQ4JAK3QgAAOAAABP/yXwRxAAAAAAD/+0DEAAAFUANH9BEAIa6eLjcesAJCMiJnaI+kuCMagwJ3k04jPzkMQfPl8uf8o76gQ+IAxD//X//1O+c//+H26pG7JXLHK3G4lEWg0On86gEk3HUr2XECJq0WGaNo81V83MNWfTF6ve95oqqFLFSem8mU/YKZH2JezWfT4+TohHymq3v+rsmMhjNo8mpqpdTbF6mv/OV/+qRFd1qyFYEJn/mqMo29xcCdQ0aqlWhWdmdgdmY01v/7QsQFAApc0ZX4lAARQRrve55QAribUbYEAERJ0VuEiSa1xQYm6+ZJK+7uMpp0cSh+Z+N0IDwLiAYktMTie+3/0G/KRf/Ln1f3rUesuO/9Jx4oUvQMxooZ5zd/6TMs7wzurLqqsZp0mRgyjXaUNWY6MQtifrmV4NUo8YwdBSmxbmMvqVREPGqX/9UM6jS3XZalzO5jIn1LNqXVREqwVb1nf4KrBUTGwMbVLB3qEVUMvLrKq3xiBf/7QsQEAAnxjXHgMEHBOhfsPHYoeNb8EADDMRQDFMoqc6iN2YGXXbAxKBnuoxnKrN+OFFAbJb/36aKxX/KU7vj9PbufhRSZX/wytqhexv/+/zP/9vTb/V9vmeFKkHjZqZmFhwAEh4CgeFwUKB6gFKsxVkk1QnbcvaXQUp2Pyar6qgwGyhVEg44Xtav06PQMBtlf1NMfPO5eko94ZqfZ4dNztP0t3qdEVn//lgmcqaqZbApg7zMwiP/7QsQGAAo9L1vgsUPBIJlp/MEmcUkfgLFEebmKUqiVVQV0cWJUi3MQ3cx1dvSPnlS3/9e7RgA2QOcOF/kQ+6+jco/Hz///p0Ofr/Waxzul0YhNdWRd1mP2fEoLVzWVULiEFexMzpIBqEzKYGtERsTXia00tl8xdavEYvmcvsZROFG//m1bMBagT/Vt1Thi6Pyw7L4XH0u//4dlyn6QLmiqtwoAApRJ0EABt80KTyeXhXFFiFVc5v/7QsQKAwbQxyugjLRAmABTyACIBqtVDARMCp/+XLo4dY4dERX83UrZmzKXDwZ//p/ytnyH6P7QPwv/////FhYSGwkLCweAQsLNf//////FaQKKirDAVFRVIFFRUVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7QsQsg8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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
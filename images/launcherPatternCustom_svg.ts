/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 153.48 67.8"><path d="M153.48 55.47V12.33L37.43.01C18.58-.4 0 8.06 0 33.47s18.58 34.82 37.43 34.31z" style="fill:none;stroke-width:0"/></svg>')}`;
export default image;
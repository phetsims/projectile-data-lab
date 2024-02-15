/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 136.14 136.14"><path d="M0 0h136.14v136.14H0z" style="stroke-width:0;fill:#fff"/><path d="M34.28 119.92h86.68" style="stroke-width:3px;stroke:#848484;fill:none;stroke-miterlimit:10"/><path d="M19.42 120.35v-85.1" style="stroke:#848484;fill:none;stroke-miterlimit:10;stroke-width:2px"/><path d="M14.22 119.55h10.4v1.6h-10.4zm0-85.1h10.4v1.6h-10.4z" style="stroke-width:0;fill:#848484"/><path d="M34.28 35.22h66.28" style="fill:none;stroke-miterlimit:10;stroke:#000;stroke-width:8px"/><path d="m97.06 47.19 20.73-11.97-20.73-11.96z" style="stroke-width:0"/></svg>')}`;
export default image;
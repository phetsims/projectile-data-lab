/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 136.14 136.14"><path d="M0 0h136.14v136.14H0z" style="stroke-width:0;fill:#fff"/><path d="M36.28 119.92h86.68" style="stroke:#919191;stroke-width:4px;fill:none;stroke-miterlimit:10"/><path d="M21.42 119.95v-84.3" style="stroke-width:4px;fill:none;stroke-miterlimit:10;stroke:#595959"/><path d="M13.62 118.75h15.6v2.4h-15.6zm0-84.3h15.6v2.4h-15.6z" style="stroke-width:0;fill:#595959"/><path d="M36.28 35.22h66.28" style="fill:none;stroke-miterlimit:10;stroke:#000;stroke-width:8px"/><path d="m99.06 47.19 20.73-11.97-20.73-11.96z" style="stroke-width:0"/></svg>')}`;
export default image;
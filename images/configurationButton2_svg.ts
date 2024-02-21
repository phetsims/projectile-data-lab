/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 136.14 136.14"><defs><clipPath id="a"><path d="M3 12.47h124.22v107.69H3z" style="fill:none;stroke-width:0"/></clipPath></defs><path d="M0 0h136.14v136.14H0z" style="stroke-width:0;fill:#fff"/><path d="M68.98 120.16c0-13.66-5.53-26.02-14.48-34.97" style="stroke:#595959;stroke-width:4px;stroke-miterlimit:10;fill:#fff"/><g style="clip-path:url(#a)"><path d="m18.44 121.25 57.1-57.21" style="fill:none;stroke-miterlimit:10;stroke:#000;stroke-width:8px"/><path d="m81.54 74.97 6.17-23.12-23.11 6.21z" style="stroke-width:0"/></g><path d="M122.22 119.92H15.64" style="fill:none;stroke-width:4px;stroke-miterlimit:10;stroke:#919191"/></svg>')}`;
export default image;
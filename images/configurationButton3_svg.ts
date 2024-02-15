/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 136.14 136.14"><defs><clipPath id="a"><path d="M16.73 10.39h107.69v111.36H16.73z" style="fill:none;stroke-width:0" transform="rotate(-90 70.57 66.07)"/></clipPath></defs><path d="M0 0h136.14v136.14H0z" style="stroke-width:0;fill:#fff"/><path d="M43.29 77.08c14.78 8.55 24.73 24.53 24.73 42.83H18.56z" style="stroke-width:0;fill:#6fb0dd"/><g style="clip-path:url(#a)"><path d="m11.02 133.21 46.67-82.26" style="fill:none;stroke-miterlimit:10;stroke:#000;stroke-width:8px"/><path d="m66.37 59.91-.18-23.93-20.63 12.11z" style="stroke-width:0"/></g><path d="M14.89 119.92h107.36" style="stroke:#848484;stroke-width:3px;fill:none;stroke-miterlimit:10"/></svg>')}`;
export default image;
/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="152.96" height="68.56" viewBox="0 0 152.96 68.56"><defs><clipPath id="a"><path d="M32.45 68.55C13.6 69.07 0 52.78 0 33.85S13.6-.41 32.45 0l120.5 12.46v43.63L32.44 68.55Z" style="fill:none;stroke-width:0"/></clipPath></defs><g style="clip-path:url(#a)"><path d="m48.55 32.69 3.46 6.96 7.69 1.14-5.56 5.44 1.3 7.67-6.89-3.6-6.89 3.6 1.29-7.67-5.55-5.44 7.69-1.14zm-22.6-17.31 6.06 2.91 5.85-3.31-.89 6.66 4.96 4.54-6.62 1.21-2.78 6.12-3.2-5.91-6.68-.76 4.64-4.87zm39.22 39.44 6.1 2.82 5.8-3.4-.8 6.68 5.03 4.47-6.6 1.3-2.7 6.16-3.28-5.87-6.69-.66 4.57-4.93zm49.13-29.56 6.1 2.82 5.81-3.39-.8 6.67 5.02 4.47-6.6 1.31-2.7 6.16-3.27-5.88-6.69-.66 4.57-4.93zM11.87 29.07l3.63 6.42 7.35.69-4.99 5.44 1.62 7.2-6.72-3.06-6.34 3.76.83-7.33-5.54-4.87 7.23-1.47zM97.74 3.01l3.4 6.98 7.67 1.2-5.6 5.39 1.22 7.67-6.84-3.66-6.92 3.53 1.36-7.64-5.49-5.49 7.69-1.06zm51.51 6.53 3.61 6.34 7.27.65-4.91 5.4 1.63 7.11-6.66-3-6.26 3.75.8-7.26-5.5-4.8 7.15-1.48zM60.97-.56l3.61 6.44 7.35.71-5.01 5.42 1.6 7.21-6.71-3.09-6.36 3.74.86-7.32-5.52-4.9 7.24-1.44zm39.65 39.39 3.61 6.43 7.35.72-5.01 5.42 1.59 7.2-6.7-3.08-6.36 3.74.86-7.33-5.52-4.89 7.23-1.45zM75.17-14.18l6.07 2.94 5.88-3.3-.92 6.68 4.95 4.57-6.64 1.19-2.81 6.13-3.18-5.95-6.7-.79 4.67-4.86zM-.7 62.14l3.38 6.84 7.54 1.13-5.46 5.33 1.25 7.52-6.75-3.55-6.77 3.52 1.29-7.52-5.44-5.35 7.55-1.1zm-9.41-51.32 3.22 8.78 9.05 2.38-7.36 5.78.54 9.34-7.77-5.22-8.72 3.4 2.56-9-5.93-7.24 9.35-.35zm47.39-28.63 3.92 8.45 9.18 1.61-6.82 6.34 1.31 9.23-8.14-4.53-8.37 4.1 1.79-9.15-6.49-6.69 9.25-1.12zM9.22-6.73 12.75.31l7.79 1.12-5.6 5.53 1.35 7.76-7-3.62-6.96 3.68 1.28-7.77-5.65-5.48L5.75.34zM137 42.52l3.53 7.03 7.8 1.12-5.6 5.54 1.34 7.75-6.99-3.61-6.96 3.67 1.27-7.77-5.64-5.48 7.78-1.19zM28.03 50.89l3.87 8.68 9.34 1.79-7.06 6.36 1.19 9.44-8.24-4.75-8.6 4.04 1.97-9.3-6.51-6.93 9.46-1zm49-29.38 3.87 8.69 9.34 1.78-7.06 6.37 1.19 9.43-8.24-4.75-8.6 4.05 1.97-9.3-6.51-6.94 9.46-.99zm49.13-29.9L130.03.3l9.34 1.78-7.06 6.37 1.19 9.43-8.24-4.75-8.6 4.05 1.97-9.3-6.51-6.94 9.46-.99zm-9.75 69.29 3.88 8.68 9.34 1.79-7.07 6.36 1.19 9.44-8.23-4.75-8.61 4.04 1.97-9.3-6.51-6.93 9.46-1z" style="fill:#f4e064;stroke-width:0"/></g></svg>')}`;
export default image;
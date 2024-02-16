/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="Layer_2" viewBox="0 0 152.96 68.56"><defs><clipPath id="clippath"><path d="M32.45 68.55C13.6 69.07 0 52.78 0 33.85S13.6-.41 32.45 0l120.5 12.46v43.63L32.44 68.55Z" class="cls-2"/></clipPath><pattern id="StarsYellow" width="75" height="75" x="0" y="0" patternTransform="rotate(45 -33132.325 -1430.698)scale(2.97)" patternUnits="userSpaceOnUse" viewBox="0 0 75 75"><path d="M0 0h75v75H0z" class="cls-2"/><path d="m67.83 72.22-1.91 1.62-2.35-.66.69 1.82h4.09l-.45-.29zm-18.75 0-1.91 1.62-2.35-.66.69 1.82h4.09l-.45-.29zm-18.75 0-1.91 1.62-2.35-.66.69 1.82h4.09l-.45-.29zm-18.75 0-1.91 1.62-2.35-.66.69 1.82h4.09l-.45-.29zm61.01-16.26-.08-2.49-1.9 1.62-2.35-.66.88 2.32-1.38 2.09 2.45-.19 1.5 1.94.63-2.42 2.31-.89zm1.33 11.78-1.54 2.11 2.62-.02v-3.92l-1.98-.68zm-6.26-2.35-1.38-1.81-.55 2.21-2.1.76 1.88 1.25.09 2.29 1.72-1.44 2.14.65-.82-2.14 1.24-1.88zm-13.82-9.43-.08-2.49-1.9 1.62-2.35-.66.88 2.32-1.38 2.09 2.45-.19 1.5 1.94.63-2.42 2.31-.89zm5.04 8.57-2.09 1.57-2.52-.87.9 2.51-1.54 2.11 2.64-.02L57.85 72l.73-2.52 2.5-.76-2.18-1.55zm5-6.23.2-3.2-2.63 1.85-2.93-1.11.86 3.06-2.01 2.52 3.15.04 1.7 2.67 1.08-3.04 3.07-.87zm-14.97 7.09-1.38-1.81-.55 2.21-2.1.76 1.88 1.25.09 2.29 1.72-1.44 2.14.65-.82-2.14 1.24-1.88zm-13.82-9.43-.08-2.49-1.9 1.62-2.35-.66.88 2.32-1.38 2.09 2.45-.19 1.5 1.94.63-2.42 2.31-.89zm5.03 8.57-2.08 1.57-2.52-.87.9 2.51-1.54 2.11 2.64-.02L39.1 72l.73-2.52 2.5-.76-2.18-1.55zm5.01-6.23.2-3.2-2.63 1.85-2.93-1.11.86 3.06-2.01 2.52 3.16.04 1.69 2.67 1.08-3.04 3.07-.87zm-14.97 7.09-1.38-1.81-.55 2.21-2.1.76 1.88 1.25.09 2.29 1.72-1.44 2.14.65-.82-2.14 1.25-1.88zm-13.82-9.43-.07-2.49-1.91 1.62-2.35-.66.88 2.32-1.38 2.09 2.45-.19 1.5 1.94.63-2.42 2.31-.89zm5.03 8.57-2.08 1.57-2.52-.87.9 2.51-1.54 2.11 2.64-.02L20.35 72l.73-2.52 2.51-.76-2.19-1.55zm5.01-6.23.2-3.2-2.63 1.85-2.93-1.11.86 3.06-2.01 2.52 3.15.04 1.7 2.67 1.08-3.04 3.07-.87zm-14.97 7.09-1.38-1.81-.55 2.21-2.1.76 1.88 1.25.09 2.29 1.72-1.44 2.14.65-.82-2.14 1.25-1.88zm-8.79-.86L.54 66.1 0 65.91v3.92h.02L1.6 72l.73-2.52 2.51-.76-2.19-1.55zm5.01-6.23.2-3.2-2.63 1.85-2.93-1.11.86 3.06-2.01 2.52 3.15.04 1.7 2.67 1.08-3.04 3.07-.87zM73.83 38l-1.38 2.09 2.45-.19.1.13v-3.78l-2.06-.57zm-1.48 8.64-1.38-1.81-.56 2.21-2.09.76 1.88 1.25.08 2.29L72 49.9l2.15.65-.82-2.14 1.24-1.88zm-14.7-4.8.63-2.42 2.31-.89-2.06-1.32-.08-2.49-1.9 1.62-2.36-.65.89 2.31-1.38 2.09 2.45-.19zm3.31 9.24 1.57 2.17.74-2.52 2.5-.76-2.19-1.55-.02-2.64-2.08 1.57-2.52-.87.9 2.51-1.54 2.11zm7.03-8.74 3.06-.87-2.48-1.92.2-3.2-2.63 1.85-2.94-1.11.87 3.06-2.02 2.52 3.16.04 1.7 2.67zm-14.39 4.3-1.38-1.81-.56 2.21-2.09.76 1.88 1.25.08 2.29 1.72-1.44 2.15.65-.82-2.14 1.24-1.88zm-14.7-4.8.63-2.42 2.31-.89-2.06-1.32-.08-2.49-1.9 1.62-2.36-.65.89 2.31-1.38 2.09 2.45-.19zm3.31 9.24 1.57 2.17.74-2.52 2.5-.76-2.19-1.55-.02-2.64-2.08 1.57-2.52-.87.9 2.51-1.54 2.11zm7.03-8.74 3.06-.87-2.48-1.92.19-3.2-2.62 1.85-2.94-1.11.87 3.06-2.02 2.52 3.16.04 1.7 2.67zm-14.39 4.3-1.38-1.81-.56 2.21-2.09.76 1.88 1.25.08 2.29 1.72-1.44 2.15.65-.82-2.14 1.24-1.88zm-14.7-4.8.63-2.42 2.31-.89-2.06-1.32-.08-2.49-1.9 1.62-2.36-.65.89 2.31-1.38 2.09 2.45-.19zm3.31 9.24 1.57 2.17.74-2.52 2.5-.76-2.19-1.55-.02-2.64-2.08 1.57-2.52-.87.9 2.51-1.54 2.11zm7.03-8.74 3.06-.87-2.48-1.92.2-3.2-2.63 1.85-2.94-1.11.87 3.06-2.02 2.52 3.16.04 1.7 2.67zm-14.39 4.3-1.38-1.81-.56 2.21-2.09.76 1.88 1.25.08 2.29 1.72-1.44 2.15.65-.82-2.14 1.24-1.88zM2.28 37.21l-.08-2.49-1.9 1.62-.3-.09v3.78l1.4 1.81.63-2.42 2.31-.89zm2.43 13.87 1.57 2.17.74-2.52 2.5-.76-2.19-1.55-.02-2.64-2.08 1.57-2.52-.87.9 2.51-1.54 2.11zm7.03-8.74 3.06-.87-2.48-1.92.2-3.2-2.63 1.85-2.94-1.11.87 3.06-2.02 2.52 3.16.04 1.7 2.67zM74.89 30.3l.08 2.29.03-.03v-4.24l-1.99.73zm-14.05-9.15 1.5 1.94.62-2.42 2.31-.89-2.06-1.32-.07-2.49-1.9 1.62-2.36-.66.89 2.32-1.39 2.09zm4.81 11.18 1.57 2.17.73-2.52 2.51-.76-2.19-1.55-.02-2.64-2.09 1.57-2.52-.87.9 2.51-1.53 2.11zm4.25-8.37 1.69 2.67 1.09-3.04 2.32-.66v-.78l-1.75-1.35.2-3.2-2.62 1.85-2.94-1.11.86 3.06-2.01 2.52zm-12.99 2.12-.56 2.21-2.09.76 1.88 1.25.08 2.29 1.72-1.44 2.15.65-.82-2.14 1.24-1.88-2.23.11zm-14.82-4.93 1.5 1.94.62-2.42 2.31-.89-2.06-1.32-.07-2.49-1.9 1.62-2.36-.66.89 2.32-1.39 2.09zm2.8 6.58.9 2.51-1.53 2.11 2.64-.02 1.57 2.17.73-2.52 2.51-.76-2.19-1.55-.02-2.64-2.09 1.57zm6.26-3.77 1.69 2.67 1.09-3.04 3.06-.87-2.49-1.92.2-3.2-2.62 1.85-2.94-1.11.86 3.06-2.01 2.52zm-12.99 2.12-.56 2.21-2.09.76 1.88 1.25.08 2.29 1.72-1.44 2.15.65-.82-2.14 1.24-1.88-2.23.11zm-14.82-4.93 1.5 1.94.62-2.42 2.31-.89-2.06-1.32-.07-2.49-1.9 1.62-2.36-.66.89 2.32-1.39 2.09zm2.8 6.58.9 2.51-1.53 2.11 2.64-.02 1.57 2.17.73-2.52 2.51-.76-2.19-1.55-.02-2.64-2.09 1.57zm6.26-3.77 1.69 2.67 1.09-3.04 3.06-.87-2.49-1.92.2-3.2-2.62 1.85-2.94-1.11.86 3.06-2.01 2.52zm-12.99 2.12-.56 2.21-2.09.76 1.88 1.25.08 2.29 1.72-1.44 2.15.65-.82-2.14 1.24-1.88-2.23.11zM4.59 21.15l1.5 1.94.62-2.42 2.31-.89-2.06-1.32-.07-2.49-1.9 1.62-2.36-.66.89 2.32-1.39 2.09zm2.8 6.58.9 2.51-1.53 2.11 2.64-.02 1.57 2.17.73-2.52 2.51-.76-2.19-1.55-.02-2.64-2.09 1.57zm6.26-3.77 1.69 2.67 1.09-3.04 3.06-.87L17 20.8l.2-3.2-2.62 1.85-2.94-1.11.86 3.06-2.01 2.52zM3.84 31.8l-.82-2.14 1.24-1.88-2.23.11-1.37-1.81-.56 2.21-.1.03v4.24l1.69-1.41zM0 22.15v.78l.74-.21zM65.52 2.4l1.5 1.94.63-2.42 2.31-.89L68.35 0h-4.09l.2.5-1.39 2.09zm7.42 5.88-2.09 1.57-2.52-.87.9 2.51-1.54 2.11 2.65-.02 1.57 2.17.73-2.52 2.36-.72v-.15l-2.04-1.44zm-11.9 1.26-2.1.76 1.89 1.25.08 2.29 1.72-1.44 2.14.65-.82-2.14 1.25-1.88-2.23.11-1.38-1.81zM46.77 2.4l1.5 1.94.63-2.42 2.31-.89L49.6 0h-4.09l.2.5-1.39 2.09zm3.71 9.09-1.54 2.11 2.65-.02 1.57 2.17.73-2.52 2.51-.76-2.19-1.55-.02-2.64-2.09 1.57-2.52-.87zm-8.19-1.95-2.1.76 1.89 1.25.08 2.29 1.72-1.44 2.14.65-.82-2.14 1.25-1.88-2.23.11-1.38-1.81zM28.02 2.4l1.5 1.94.63-2.42 2.31-.89L30.85 0h-4.09l.2.5-1.39 2.09zm3.71 9.09-1.54 2.11 2.65-.02 1.57 2.17.73-2.52 2.51-.76-2.19-1.55-.02-2.64-2.09 1.57-2.52-.87zm-8.19-1.95-2.1.76 1.89 1.25.08 2.29 1.72-1.44 2.14.65-.82-2.14 1.25-1.88-2.23.11-1.37-1.81zM9.27 2.4l1.5 1.94.63-2.42 2.31-.89L12.1 0H8.01l.2.5-1.39 2.09zm3.71 9.09-1.54 2.11 2.65-.02 1.57 2.17.73-2.52 2.51-.76-2.19-1.55-.02-2.64-2.09 1.57-2.52-.87zM4.79 9.54l-2.1.76 1.89 1.25.08 2.29 1.72-1.44 2.14.65-.82-2.14 1.25-1.88-2.23.11-1.37-1.81zM55.9 5.22l1.71 2.66 1.07-3.05 3.06-.88-2.5-1.91.12-2.04h-1.57l-.98.7-1.89-.7h-.94l.77 2.67-2 2.53zm-18.75 0 1.71 2.66 1.07-3.05 3.06-.88-2.5-1.91.12-2.04h-1.57l-.98.7-1.89-.7h-.94L36 2.67 34 5.2zm-18.75 0 1.71 2.66 1.07-3.05 3.06-.88-2.5-1.91.12-2.04h-1.57l-.98.7-1.89-.7h-.94l.77 2.67-2 2.53zM59.36 75l.06-1.16L57.79 75zm-18.75 0 .06-1.16L39.04 75zm-18.75 0 .06-1.16L20.29 75zM2.99 75l.07-1.16L1.42 75zM2.32 4.83l3.05-.88-2.49-1.91L2.99 0H1.42L.44.7 0 .54v5.4l1.25 1.94zM73.55 0h-.94l.77 2.67-2 2.53 3.16.02.46.72V.54z" style="stroke-width:0;fill:#f4e064"/></pattern><style>.cls-2{fill:none;stroke-width:0}</style></defs><g style="clip-path:url(#clippath)"><path id="Layer_1-2" d="M152.96 78.94V-2.94L-6.71-6.27v85.21z" style="stroke-width:0;fill:url(#StarsYellow)"/></g></svg>')}`;
export default image;
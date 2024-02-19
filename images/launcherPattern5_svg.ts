/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="Layer_2" viewBox="0 0 152.96 68.56"><defs><clipPath id="clippath"><path d="M32.45 68.55C13.6 69.07 0 52.78 0 33.85S13.6-.41 32.45 0l120.5 12.46v43.63L32.44 68.55Z" class="cls-2"/></clipPath><pattern id="CheckerSmall" width="75" height="75" x="0" y="0" patternTransform="matrix(4.78781 4.72967 -4.78733 4.73085 -166.38 123.21)" patternUnits="userSpaceOnUse" viewBox="0 0 75 75"><path d="M0 0h75v75H0z" class="cls-2"/><path d="M67.5 0h3.75v3.75H67.5zm3.75 3.75H75V7.5h-3.75zM67.5 7.5h3.75v3.75H67.5zm3.75 3.75H75V15h-3.75zM67.5 15h3.75v3.75H67.5zm3.75 3.75H75v3.75h-3.75zM67.5 22.5h3.75v3.75H67.5zm3.75 3.75H75V30h-3.75zM67.5 30h3.75v3.75H67.5zm3.75 3.75H75v3.75h-3.75zM67.5 37.5h3.75v3.75H67.5zm3.75 3.75H75V45h-3.75zM67.5 45h3.75v3.75H67.5zm3.75 3.75H75v3.75h-3.75zM67.5 52.5h3.75v3.75H67.5zm3.75 3.75H75V60h-3.75zM67.5 60h3.75v3.75H67.5zm3.75 3.75H75v3.75h-3.75zM67.5 67.5h3.75v3.75H67.5zm3.75 3.75H75V75h-3.75zM60 0h3.75v3.75H60zm3.75 3.75h3.75V7.5h-3.75zM60 7.5h3.75v3.75H60zm3.75 3.75h3.75V15h-3.75zM60 15h3.75v3.75H60zm3.75 3.75h3.75v3.75h-3.75zM60 22.5h3.75v3.75H60zm3.75 3.75h3.75V30h-3.75zM60 30h3.75v3.75H60zm3.75 3.75h3.75v3.75h-3.75zM60 37.5h3.75v3.75H60zm3.75 3.75h3.75V45h-3.75zM60 45h3.75v3.75H60zm3.75 3.75h3.75v3.75h-3.75zM60 52.5h3.75v3.75H60zm3.75 3.75h3.75V60h-3.75zM60 60h3.75v3.75H60zm3.75 3.75h3.75v3.75h-3.75zM60 67.5h3.75v3.75H60zm3.75 3.75h3.75V75h-3.75zM52.5 0h3.75v3.75H52.5zm3.75 3.75H60V7.5h-3.75zM52.5 7.5h3.75v3.75H52.5zm3.75 3.75H60V15h-3.75zM52.5 15h3.75v3.75H52.5zm3.75 3.75H60v3.75h-3.75zM52.5 22.5h3.75v3.75H52.5zm3.75 3.75H60V30h-3.75zM52.5 30h3.75v3.75H52.5zm3.75 3.75H60v3.75h-3.75zM52.5 37.5h3.75v3.75H52.5zm3.75 3.75H60V45h-3.75zM52.5 45h3.75v3.75H52.5zm3.75 3.75H60v3.75h-3.75zM52.5 52.5h3.75v3.75H52.5zm3.75 3.75H60V60h-3.75zM52.5 60h3.75v3.75H52.5zm3.75 3.75H60v3.75h-3.75zM52.5 67.5h3.75v3.75H52.5zm3.75 3.75H60V75h-3.75zM45 0h3.75v3.75H45zm3.75 3.75h3.75V7.5h-3.75zM45 7.5h3.75v3.75H45zm3.75 3.75h3.75V15h-3.75zM45 15h3.75v3.75H45zm3.75 3.75h3.75v3.75h-3.75zM45 22.5h3.75v3.75H45zm3.75 3.75h3.75V30h-3.75zM45 30h3.75v3.75H45zm3.75 3.75h3.75v3.75h-3.75zM45 37.5h3.75v3.75H45zm3.75 3.75h3.75V45h-3.75zM45 45h3.75v3.75H45zm3.75 3.75h3.75v3.75h-3.75zM45 52.5h3.75v3.75H45zm3.75 3.75h3.75V60h-3.75zM45 60h3.75v3.75H45zm3.75 3.75h3.75v3.75h-3.75zM45 67.5h3.75v3.75H45zm3.75 3.75h3.75V75h-3.75zM37.5 0h3.75v3.75H37.5zm3.75 3.75H45V7.5h-3.75zM37.5 7.5h3.75v3.75H37.5zm3.75 3.75H45V15h-3.75zM37.5 15h3.75v3.75H37.5zm3.75 3.75H45v3.75h-3.75zM37.5 22.5h3.75v3.75H37.5zm3.75 3.75H45V30h-3.75zM37.5 30h3.75v3.75H37.5zm3.75 3.75H45v3.75h-3.75zM37.5 37.5h3.75v3.75H37.5zm3.75 3.75H45V45h-3.75zM37.5 45h3.75v3.75H37.5zm3.75 3.75H45v3.75h-3.75zM37.5 52.5h3.75v3.75H37.5zm3.75 3.75H45V60h-3.75zM37.5 60h3.75v3.75H37.5zm3.75 3.75H45v3.75h-3.75zM37.5 67.5h3.75v3.75H37.5zm3.75 3.75H45V75h-3.75zM30 0h3.75v3.75H30zm3.75 3.75h3.75V7.5h-3.75zM30 7.5h3.75v3.75H30zm3.75 3.75h3.75V15h-3.75zM30 15h3.75v3.75H30zm3.75 3.75h3.75v3.75h-3.75zM30 22.5h3.75v3.75H30zm3.75 3.75h3.75V30h-3.75zM30 30h3.75v3.75H30zm3.75 3.75h3.75v3.75h-3.75zM30 37.5h3.75v3.75H30zm3.75 3.75h3.75V45h-3.75zM30 45h3.75v3.75H30zm3.75 3.75h3.75v3.75h-3.75zM30 52.5h3.75v3.75H30zm3.75 3.75h3.75V60h-3.75zM30 60h3.75v3.75H30zm3.75 3.75h3.75v3.75h-3.75zM30 67.5h3.75v3.75H30zm3.75 3.75h3.75V75h-3.75zM22.5 0h3.75v3.75H22.5zm3.75 3.75H30V7.5h-3.75zM22.5 7.5h3.75v3.75H22.5zm3.75 3.75H30V15h-3.75zM22.5 15h3.75v3.75H22.5zm3.75 3.75H30v3.75h-3.75zM22.5 22.5h3.75v3.75H22.5zm3.75 3.75H30V30h-3.75zM22.5 30h3.75v3.75H22.5zm3.75 3.75H30v3.75h-3.75zM22.5 37.5h3.75v3.75H22.5zm3.75 3.75H30V45h-3.75zM22.5 45h3.75v3.75H22.5zm3.75 3.75H30v3.75h-3.75zM22.5 52.5h3.75v3.75H22.5zm3.75 3.75H30V60h-3.75zM22.5 60h3.75v3.75H22.5zm3.75 3.75H30v3.75h-3.75zM22.5 67.5h3.75v3.75H22.5zm3.75 3.75H30V75h-3.75zM15 0h3.75v3.75H15zm3.75 3.75h3.75V7.5h-3.75zM15 7.5h3.75v3.75H15zm3.75 3.75h3.75V15h-3.75zM15 15h3.75v3.75H15zm3.75 3.75h3.75v3.75h-3.75zM15 22.5h3.75v3.75H15zm3.75 3.75h3.75V30h-3.75zM15 30h3.75v3.75H15zm3.75 3.75h3.75v3.75h-3.75zM15 37.5h3.75v3.75H15zm3.75 3.75h3.75V45h-3.75zM15 45h3.75v3.75H15zm3.75 3.75h3.75v3.75h-3.75zM15 52.5h3.75v3.75H15zm3.75 3.75h3.75V60h-3.75zM15 60h3.75v3.75H15zm3.75 3.75h3.75v3.75h-3.75zM15 67.5h3.75v3.75H15zm3.75 3.75h3.75V75h-3.75zM7.5 0h3.75v3.75H7.5zm3.75 3.75H15V7.5h-3.75zM7.5 7.5h3.75v3.75H7.5zm3.75 3.75H15V15h-3.75zM7.5 15h3.75v3.75H7.5zm3.75 3.75H15v3.75h-3.75zM7.5 22.5h3.75v3.75H7.5zm3.75 3.75H15V30h-3.75zM7.5 30h3.75v3.75H7.5zm3.75 3.75H15v3.75h-3.75zM7.5 37.5h3.75v3.75H7.5zm3.75 3.75H15V45h-3.75zM7.5 45h3.75v3.75H7.5zm3.75 3.75H15v3.75h-3.75zM7.5 52.5h3.75v3.75H7.5zm3.75 3.75H15V60h-3.75zM7.5 60h3.75v3.75H7.5zm3.75 3.75H15v3.75h-3.75zM7.5 67.5h3.75v3.75H7.5zm3.75 3.75H15V75h-3.75zM0 0h3.75v3.75H0zm3.75 3.75H7.5V7.5H3.75zM0 7.5h3.75v3.75H0zm3.75 3.75H7.5V15H3.75zM0 15h3.75v3.75H0zm3.75 3.75H7.5v3.75H3.75zM0 22.5h3.75v3.75H0zm3.75 3.75H7.5V30H3.75zM0 30h3.75v3.75H0zm3.75 3.75H7.5v3.75H3.75zM0 37.5h3.75v3.75H0zm3.75 3.75H7.5V45H3.75zM0 45h3.75v3.75H0zm3.75 3.75H7.5v3.75H3.75zM0 52.5h3.75v3.75H0zm3.75 3.75H7.5V60H3.75zM0 60h3.75v3.75H0zm3.75 3.75H7.5v3.75H3.75zM0 67.5h3.75v3.75H0zm3.75 3.75H7.5V75H3.75z" style="stroke-width:0"/></pattern><style>.cls-2{stroke-width:0;fill:none}</style></defs><g style="opacity:.75"><g style="clip-path:url(#clippath)"><path id="Layer_1-2" d="m152.96 78.94-.21-81.21-159.46-4v85.21z" style="fill:url(#CheckerSmall);opacity:.8;stroke-width:0"/></g></g></svg>')}`;
export default image;
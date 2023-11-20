// Copyright 2023, University of Colorado Boulder

/**
 * Defines the colors for this sim.
 *
 * All simulations should have a Colors.js file, see https://github.com/phetsims/scenery-phet/issues/642.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Edit" mode.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import projectileDataLab from '../projectileDataLab.js';

const PDLColors = {

  // Background color for screens in this sim
  screenBackgroundTopColorProperty: new ProfileColorProperty( projectileDataLab, 'backgroundTop', {
    default: '#15AFFF'
  } ),

  screenBackgroundBottomColorProperty: new ProfileColorProperty( projectileDataLab, 'backgroundBottom', {
    default: '#B6D2FF'
  } ),

  fieldFillColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldFill', {
    default: '#1A974E'
  } ),

  fieldBorderStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldBorderStroke', {
    default: '#FFFFFF'
  } ),

  fieldLineStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldLineStroke', {
    default: '#70D1A4'
  } ),

  launcherFillColorProperties: [
    new ProfileColorProperty( projectileDataLab, 'launcher1Fill', {
      default: '#908C99'
    } ),

    new ProfileColorProperty( projectileDataLab, 'launcher2Fill', {
      default: '#E82126'
    } ),

    new ProfileColorProperty( projectileDataLab, 'launcher3Fill', {
      default: '#6D16C1'
    } ),

    new ProfileColorProperty( projectileDataLab, 'launcher4Fill', {
      default: '#D424E2'
    } ),

    new ProfileColorProperty( projectileDataLab, 'launcher5Fill', {
      default: '#237BE5'
    } ),

    new ProfileColorProperty( projectileDataLab, 'launcher6Fill', {
      default: '#E88A1A'
    } )
  ],

  launcherStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'launcherStroke', {
    default: '#111111'
  } ),

  launcherEndFillColorProperty: new ProfileColorProperty( projectileDataLab, 'launcherEndFill', {
    default: '#706C79'
  } )
};

projectileDataLab.register( 'PDLColors', PDLColors );
export default PDLColors;
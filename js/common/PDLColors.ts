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

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import projectileDataLab from '../projectileDataLab.js';

const PDLColors = {

  // Background color for screens in this sim
  screenBackgroundTopColorProperty: new ProfileColorProperty( projectileDataLab, 'backgroundTop', {
    default: '#15AFFF'
  } ),

  screenBackgroundBottomColorProperty: new ProfileColorProperty( projectileDataLab, 'backgroundBottom', {
    default: '#B6D2FF'
  } ),

  panelColorProperty: new ProfileColorProperty( projectileDataLab, 'panelFill', {
    default: 'rgb(243,243,243)'
  } ),

  launchButtonColorProperty: new ProfileColorProperty( projectileDataLab, 'launchButtonFill', {
    default: '#ea2621'
  } ),

  fieldFillColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldFill', {
    default: '#1A974E'
  } ),

  fieldBorderStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldBorderStroke', {
    default: '#FFFFFF'
  } ),

  pathStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'pathStroke', {
    default: new Color( 0x701AC3, 0.15 )
  } ),

  pathStrokeMostRecentProjectileColorProperty: new ProfileColorProperty( projectileDataLab, 'pathStrokeMostRecentProjectile', {
    default: new Color( 0xCC4DE7, 1 )
  } ),

  fieldLineStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldLineStroke', {
    default: '#70D1A4'
  } ),

  launcherFillColorProperties: [
    new ProfileColorProperty( projectileDataLab, 'launcher1Fill', {
      default: '#908C99'
    } ),

    new ProfileColorProperty( projectileDataLab, 'launcher2Fill', {
      default: '#ffca3a'
    } ),

    new ProfileColorProperty( projectileDataLab, 'launcher3Fill', {
      default: '#ff494e'
    } ),

    new ProfileColorProperty( projectileDataLab, 'launcher4Fill', {
      default: '#7ad926'
    } ),

    new ProfileColorProperty( projectileDataLab, 'launcher5Fill', {
      default: '#1992d4'
    } ),

    new ProfileColorProperty( projectileDataLab, 'launcher6Fill', {
      default: '#b77dee'
    } )
  ],

  launcherStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'launcherStroke', {
    default: '#111111'
  } ),

  launcherFrameBackgroundColorProperty: new ProfileColorProperty( projectileDataLab, 'launcherFrameBackground', {
    default: new Color( 0xffffff, 0.35 )
  } ),

  launcherGuideBoltInnerColorProperty: new ProfileColorProperty( projectileDataLab, 'launcherGuideBoltInner', {
    default: '#888888'
  } ),

  launcherGuideBoltOuterColorProperty: new ProfileColorProperty( projectileDataLab, 'launcherGuideBoltOuter', {
    default: '#aaaaaa'
  } ),

  fieldSignColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldSignFill', {
    default: '#E5C49C'
  } ),

  heatMapColorProperty: new ProfileColorProperty( projectileDataLab, 'heatMap', {
    default: '#EE6102'
  } ),

  heatMapBodyFillColorProperty: new ProfileColorProperty( projectileDataLab, 'heatMapBodyFill', {
    default: '#EEEEEE'
  } ),

  heatMapBodyStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'heatMapBodyStroke', {
    default: '#111111'
  } ),

  heatMapNeedleFillColorProperty: new ProfileColorProperty( projectileDataLab, 'heatMapNeedleFill', {
    default: '#EE6102'
  } ),

  heatMapNeedleStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'heatMapNeedleStroke', {
    default: '#111111'
  } ),

  speedToolConnectorColorProperty: new ProfileColorProperty( projectileDataLab, 'speedToolConnector', {
    default: '#363F82'
  } ),

  histogramBarFillColorProperty: new ProfileColorProperty( projectileDataLab, 'histogramBarFill', {
    default: '#D22D32'
  } ),

  histogramBarStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'histogramBarStroke', {
    default: '#EC6F5E'
  } )
};

projectileDataLab.register( 'PDLColors', PDLColors );
export default PDLColors;
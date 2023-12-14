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
    default: '#29b5ff'
  } ),

  screenBackgroundBottomColorProperty: new ProfileColorProperty( projectileDataLab, 'backgroundBottom', {
    default: '#c3d7ff'
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

  pathStrokeAirborneColorProperty: new ProfileColorProperty( projectileDataLab, 'pathStrokeAirborne', {
    default: new Color( 0x701AC3, 0.8 )
  } ),

  pathStrokeLandedColorProperty: new ProfileColorProperty( projectileDataLab, 'pathStrokeLandedInitial', {
    default: new Color( 0xFFFFFF, 0.1 )
  } ),

  pathStrokeHighlightedColorProperty: new ProfileColorProperty( projectileDataLab, 'pathStrokeHighlighted', {
    default: new Color( 0xc926df, 0.8 )
  } ),

  fieldLineStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldLineStroke', {
    default: '#70D1A4'
  } ),

  launcherFillColorProperties: [
    {
      primary: new ProfileColorProperty( projectileDataLab, 'launcher1Primary', { default: '#908C99' } ),
      secondary: new ProfileColorProperty( projectileDataLab, 'launcher1Secondary', { default: '#828089' } )
    },
    {
      primary: new ProfileColorProperty( projectileDataLab, 'launcher2Primary', { default: '#de0e0e' } ),
      secondary: new ProfileColorProperty( projectileDataLab, 'launcher2Secondary', { default: '#d53b07' } )
    },
    {
      primary: new ProfileColorProperty( projectileDataLab, 'launcher3Primary', { default: '#ffcf08' } ),
      secondary: new ProfileColorProperty( projectileDataLab, 'launcher3Secondary', { default: '#ff9900' } )
    },
    {
      primary: new ProfileColorProperty( projectileDataLab, 'launcher4Primary', { default: '#9EC62A' } ),
      secondary: new ProfileColorProperty( projectileDataLab, 'launcher4Secondary', { default: '#44902f' } )
    },
    {
      primary: new ProfileColorProperty( projectileDataLab, 'launcher5Primary', { default: '#4d93d9' } ),
      secondary: new ProfileColorProperty( projectileDataLab, 'launcher5Secondary', { default: '#349cb6' } )
    },
    {
      primary: new ProfileColorProperty( projectileDataLab, 'launcher6Primary', { default: '#c369d0' } ),
      secondary: new ProfileColorProperty( projectileDataLab, 'launcher6Secondary', { default: '#a4399e' } )
    }
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

  histogramDataFillColorProperty: new ProfileColorProperty( projectileDataLab, 'histogramDataFill', {
    default: '#D22D32'
  } ),

  histogramDataStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'histogramDataStroke', {
    default: '#EE8B5E'
  } ),

  meanMarkerFillProperty: new ProfileColorProperty( projectileDataLab, 'meanMarkerFill', {
    default: '#E300AD'
  } ),
  meanMarkerStrokeProperty: new ProfileColorProperty( projectileDataLab, 'meanMarkerStroke', {
    default: 'black'
  } ),

  histogramIntervalToolFillColorProperty: new ProfileColorProperty( projectileDataLab, 'histogramIntervalToolFill', {
    default: new Color( 'yellow' ).withAlpha( 0.3 )
  } )
};

projectileDataLab.register( 'PDLColors', PDLColors );
export default PDLColors;
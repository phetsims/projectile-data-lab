// Copyright 2023-2024, University of Colorado Boulder

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

  screenIconFillProperty: new ProfileColorProperty( projectileDataLab, 'screenIconFill', {
    default: '#f7f7f7'
  } ),

  skyTopProperty: new ProfileColorProperty( projectileDataLab, 'skyTop', {
    default: '#42a4ff'
  } ),

  skyBottomProperty: new ProfileColorProperty( projectileDataLab, 'skyBottom', {
    default: '#a9c2ff'
  } ),

  panelFillProperty: new ProfileColorProperty( projectileDataLab, 'panelFill', {
    default: 'rgb(243,243,243)'
  } ),

  panelStrokeProperty: new ProfileColorProperty( projectileDataLab, 'panelStroke', {
    default: 'rgb(131,131,131)'
  } ),

  launchButtonFillProperty: new ProfileColorProperty( projectileDataLab, 'launchButtonFill', {
    default: '#e33e3c'
  } ),

  launchButtonDisabledFillProperty: new ProfileColorProperty( projectileDataLab, 'launchButtonDisabledFill', {
    default: '#de4e4d'
  } ),

  fieldFillLightProperty: new ProfileColorProperty( projectileDataLab, 'fieldFillLight', {
    default: '#38bb70'
  } ),

  fieldFillDarkProperty: new ProfileColorProperty( projectileDataLab, 'fieldFillDark', {
    default: '#098548'
  } ),

  fieldLineFillProperty: new ProfileColorProperty( projectileDataLab, 'fieldLineFill', {
    default: new Color( 0xFFFFFF, 0.5 )
  } ),

  fieldBorderFillProperty: new ProfileColorProperty( projectileDataLab, 'fieldBorderFill', {
    default: '#FFFFFF'
  } ),

  pathAirborneStrokeProperty: new ProfileColorProperty( projectileDataLab, 'pathAirborneStroke', {
    default: new Color( 0x701AC3, 0.65 )
  } ),

  pathLandedInitialStrokeProperty: new ProfileColorProperty( projectileDataLab, 'pathLandedInitialStroke', {
    default: new Color( 0xFFFFFF, 0.4 )
  } ),

  pathLandedFinalStrokeProperty: new ProfileColorProperty( projectileDataLab, 'pathLandedFinalStroke', {
    default: new Color( 0xFFFFFF, 0.06 )
  } ),

  pathHighlightedStrokeProperty: new ProfileColorProperty( projectileDataLab, 'pathHighlightedStroke', {
    default: new Color( 0x5B2194, 1 )
  } ),

  pathSamplingStrokeProperty: new ProfileColorProperty( projectileDataLab, 'pathSamplingStroke', {
    default: new Color( 0xFFFFFF, 0.2 )
  } ),

  mysteryLauncherFillColorProperties: [
    {
      barrelFillProperty: new ProfileColorProperty( projectileDataLab, 'barrelFill1', { default: '#CC3333' } ),
      nozzleFillProperty: new ProfileColorProperty( projectileDataLab, 'nozzleFill1', { default: '#FFE300' } ),
      frameFillProperty: new ProfileColorProperty( projectileDataLab, 'frameFill1', { default: '#bb2e2e' } ),
      labelPanelFillProperty: new ProfileColorProperty( projectileDataLab, 'labelPanelFill1', { default: '#F5B8B8' } )
    },
    {
      barrelFillProperty: new ProfileColorProperty( projectileDataLab, 'barrelFill2', { default: '#588C7C' } ),
      nozzleFillProperty: new ProfileColorProperty( projectileDataLab, 'nozzleFill2', { default: '#406357' } ),
      frameFillProperty: new ProfileColorProperty( projectileDataLab, 'frameFill2', { default: '#4a7365' } ),
      labelPanelFillProperty: new ProfileColorProperty( projectileDataLab, 'labelPanelFill2', { default: '#E0F1EB' } )
    },
    {
      barrelFillProperty: new ProfileColorProperty( projectileDataLab, 'barrelFill3', { default: '#FFE300' } ),
      nozzleFillProperty: new ProfileColorProperty( projectileDataLab, 'nozzleFill3', { default: '#E5C400' } ),
      frameFillProperty: new ProfileColorProperty( projectileDataLab, 'frameFill3', { default: '#f1d400' } ),
      labelPanelFillProperty: new ProfileColorProperty( projectileDataLab, 'labelPanelFill3', { default: '#FFF7B8' } )
    },
    {
      barrelFillProperty: new ProfileColorProperty( projectileDataLab, 'barrelFill4', { default: '#009EFF' } ),
      nozzleFillProperty: new ProfileColorProperty( projectileDataLab, 'nozzleFill4', { default: '#006ABA' } ),
      frameFillProperty: new ProfileColorProperty( projectileDataLab, 'frameFill4', { default: '#0077d2' } ),
      labelPanelFillProperty: new ProfileColorProperty( projectileDataLab, 'labelPanelFill4', { default: '#B8E4FF' } )
    },
    {
      barrelFillProperty: new ProfileColorProperty( projectileDataLab, 'barrelFill5', { default: '#ffffff' } ),
      nozzleFillProperty: new ProfileColorProperty( projectileDataLab, 'nozzleFill5', { default: '#626262' } ),
      frameFillProperty: new ProfileColorProperty( projectileDataLab, 'frameFill5', { default: '#808080' } ),
      labelPanelFillProperty: new ProfileColorProperty( projectileDataLab, 'labelPanelFill5', { default: '#f5f5f5' } )
    },
    {
      barrelFillProperty: new ProfileColorProperty( projectileDataLab, 'barrelFill6', { default: '#9470CE' } ),
      nozzleFillProperty: new ProfileColorProperty( projectileDataLab, 'nozzleFill6', { default: '#7158A0' } ),
      frameFillProperty: new ProfileColorProperty( projectileDataLab, 'frameFill6', { default: '#9470CE' } ),
      labelPanelFillProperty: new ProfileColorProperty( projectileDataLab, 'labelPanelFill6', { default: '#E3D8F3' } )
    },
    {
      barrelFillProperty: new ProfileColorProperty( projectileDataLab, 'barrelFillCustom', { default: '#adadad' } ),
      nozzleFillProperty: new ProfileColorProperty( projectileDataLab, 'nozzleFillCustom', { default: '#8d8d8d' } ),
      frameFillProperty: new ProfileColorProperty( projectileDataLab, 'frameFillCustom', { default: '#919191' } ),
      labelPanelFillProperty: new ProfileColorProperty( projectileDataLab, 'labelPanelFillCustom', { default: '#ffffff' } )
    }
  ],

  launcherStrokeProperty: new ProfileColorProperty( projectileDataLab, 'launcherStroke', {
    default: '#111111'
  } ),

  launcherBackFillProperty: new ProfileColorProperty( projectileDataLab, 'launcherBackFill', {
    default: new Color( 0xffffff, 0.35 )
  } ),

  fieldSignTextFillProperty: new ProfileColorProperty( projectileDataLab, 'fieldSignTextFill', {
    default: '#ffffff'
  } ),

  fieldSignPostFillProperty: new ProfileColorProperty( projectileDataLab, 'fieldSignPostFill', {
    default: '#c4bcbc'
  } ),

  heatMapDisplayFillProperty: new ProfileColorProperty( projectileDataLab, 'heatMapDisplayFill', {
    default: '#FCFCFC'
  } ),

  heatNodeFillProperty: new ProfileColorProperty( projectileDataLab, 'heatNodeFill', {
    default: '#EE6102'
  } ),

  heatMapDisplayStrokeProperty: new ProfileColorProperty( projectileDataLab, 'heatMapDisplayStroke', {
    default: '#111111'
  } ),

  heatMapNeedleFillProperty: new ProfileColorProperty( projectileDataLab, 'heatMapNeedleFill', {
    default: '#EE6102'
  } ),

  heatMapNeedleStrokeProperty: new ProfileColorProperty( projectileDataLab, 'heatMapNeedleStroke', {
    default: '#111111'
  } ),

  speedToolConnectorStrokeProperty: new ProfileColorProperty( projectileDataLab, 'speedToolConnectorStroke', {
    default: '#363F82'
  } ),

  histogramDataFillProperty: new ProfileColorProperty( projectileDataLab, 'histogramDataFill', {
    default: '#D22D32'
  } ),

  histogramDataStrokeProperty: new ProfileColorProperty( projectileDataLab, 'histogramDataStroke', {
    default: '#EE8B5E'
  } ),

  meanMarkerFillProperty: new ProfileColorProperty( projectileDataLab, 'meanMarkerFill', {
    default: '#8500bd'
  } ),

  meanMarkerStrokeProperty: new ProfileColorProperty( projectileDataLab, 'meanMarkerStroke', {
    default: '#000000'
  } ),

  intervalToolSphereFillProperty: new ProfileColorProperty( projectileDataLab, 'intervalToolSphereFill', {
    default: '#ffc537'
  } ),

  intervalToolLineStrokeProperty: new ProfileColorProperty( projectileDataLab, 'intervalToolLineStroke', {
    default: '#8f8f8f'
  } ),

  histogramIntervalToolFillProperty: new ProfileColorProperty( projectileDataLab, 'histogramIntervalToolFill', {
    default: new Color( 'yellow' ).withAlpha( 0.3 )
  } )
};

projectileDataLab.register( 'PDLColors', PDLColors );
export default PDLColors;
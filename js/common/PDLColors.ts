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

  // Background color for screen icons in this sim
  screenIconBackgroundColorProperty: new ProfileColorProperty( projectileDataLab, 'iconBackground', {
    default: '#f7f7f7'
  } ),

  // Background color for screens in this sim
  screenBackgroundTopColorProperty: new ProfileColorProperty( projectileDataLab, 'backgroundTop', {
    default: '#42a4ff'
  } ),

  screenBackgroundBottomColorProperty: new ProfileColorProperty( projectileDataLab, 'backgroundBottom', {
    default: '#a9c2ff'
  } ),

  panelColorProperty: new ProfileColorProperty( projectileDataLab, 'panelFill', {
    default: 'rgb(243,243,243)'
  } ),

  panelStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'panelStroke', {
    default: 'rgb(131,131,131)'
  } ),

  launchButtonColorProperty: new ProfileColorProperty( projectileDataLab, 'launchButtonFill', {
    default: '#e33e3c'
  } ),

  launchButtonDisabledColorProperty: new ProfileColorProperty( projectileDataLab, 'launchButtonDisabledFill', {
    default: '#de4e4d'
  } ),

  timerDisplayColorProperty: new ProfileColorProperty( projectileDataLab, 'timerDisplayFill', {
    default: '#5082e6'
  } ),

  fieldFill1ColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldFill1', {
    default: '#03ab46'
  } ),

  fieldFill2ColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldFill2', {
    default: '#026e2c'
  } ),

  fieldLineColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldLine', {
    default: new Color( 0xFFFFFF, 0.5 )
  } ),

  fieldBorderColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldBorder', {
    default: '#FFFFFF'
  } ),

  pathStrokeAirborneColorProperty: new ProfileColorProperty( projectileDataLab, 'pathStrokeAirborne', {
    default: new Color( 0x701AC3, 0.65 )
  } ),

  pathStrokeLandedInitialColorProperty: new ProfileColorProperty( projectileDataLab, 'pathStrokeLandedInitial', {
    default: new Color( 0xFFFFFF, 0.4 )
  } ),

  pathStrokeLandedFinalColorProperty: new ProfileColorProperty( projectileDataLab, 'pathStrokeLandedFinal', {
    default: new Color( 0xFFFFFF, 0.06 )
  } ),

  pathStrokeHighlightedColorProperty: new ProfileColorProperty( projectileDataLab, 'pathStrokeHighlighted', {
    default: new Color( 0x5B2194, 1 )
  } ),

  pathStrokeSamplingColorProperty: new ProfileColorProperty( projectileDataLab, 'pathStrokeSampling', {
    default: new Color( 0xFFFFFF, 0.2 )
  } ),

  mysteryLauncherFillColorProperties: [
    {
      barrel: new ProfileColorProperty( projectileDataLab, 'launcherBarrel1', { default: '#CC3333' } ),
      nozzle: new ProfileColorProperty( projectileDataLab, 'launcherNozzle1', { default: '#FFE300' } ),
      frame: new ProfileColorProperty( projectileDataLab, 'launcherFrame1', { default: '#bb2e2e' } ),
      labelPanel: new ProfileColorProperty( projectileDataLab, 'launcherLabelPanel1', { default: '#F5B8B8' } )
    },
    {
      barrel: new ProfileColorProperty( projectileDataLab, 'launcherBarrel2', { default: '#588C7C' } ),
      nozzle: new ProfileColorProperty( projectileDataLab, 'launcherNozzle2', { default: '#406357' } ),
      frame: new ProfileColorProperty( projectileDataLab, 'launcherFrame2', { default: '#4a7365' } ),
      labelPanel: new ProfileColorProperty( projectileDataLab, 'launcherLabelPanel2', { default: '#E0F1EB' } )
    },
    {
      barrel: new ProfileColorProperty( projectileDataLab, 'launcherBarrel3', { default: '#FFE300' } ),
      nozzle: new ProfileColorProperty( projectileDataLab, 'launcherNozzle3', { default: '#E5C400' } ),
      frame: new ProfileColorProperty( projectileDataLab, 'launcherFrame3', { default: '#f1d400' } ),
      labelPanel: new ProfileColorProperty( projectileDataLab, 'launcherLabelPanel3', { default: '#FFF7B8' } )
    },
    {
      barrel: new ProfileColorProperty( projectileDataLab, 'launcherBarrel4', { default: '#009EFF' } ),
      nozzle: new ProfileColorProperty( projectileDataLab, 'launcherNozzle4', { default: '#006ABA' } ),
      frame: new ProfileColorProperty( projectileDataLab, 'launcherFrame4', { default: '#0077d2' } ),
      labelPanel: new ProfileColorProperty( projectileDataLab, 'launcherLabelPanel4', { default: '#B8E4FF' } )
    },
    {
      barrel: new ProfileColorProperty( projectileDataLab, 'launcherBarrel5', { default: '#ffffff' } ),
      nozzle: new ProfileColorProperty( projectileDataLab, 'launcherNozzle5', { default: '#626262' } ),
      frame: new ProfileColorProperty( projectileDataLab, 'launcherFrame5', { default: '#808080' } ),
      labelPanel: new ProfileColorProperty( projectileDataLab, 'launcherLabelPanel5', { default: '#f5f5f5' } )
    },
    {
      barrel: new ProfileColorProperty( projectileDataLab, 'launcherBarrel6', { default: '#9470CE' } ),
      nozzle: new ProfileColorProperty( projectileDataLab, 'launcherNozzle6', { default: '#7158A0' } ),
      frame: new ProfileColorProperty( projectileDataLab, 'launcherFrame6', { default: '#9470CE' } ),
      labelPanel: new ProfileColorProperty( projectileDataLab, 'launcherLabelPanel6', { default: '#E3D8F3' } )
    },
    {
      barrel: new ProfileColorProperty( projectileDataLab, 'launcherBarrelCustom', { default: '#adadad' } ),
      nozzle: new ProfileColorProperty( projectileDataLab, 'launcherNozzleCustom', { default: '#8d8d8d' } ),
      frame: new ProfileColorProperty( projectileDataLab, 'launcherFrameCustom', { default: '#919191' } ),
      labelPanel: new ProfileColorProperty( projectileDataLab, 'launcherLabelPanelCustom', { default: '#ffffff' } )
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

  fieldSignFillColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldSignFill', {
    default: '#349380'
  } ),

  fieldSignStrokeColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldSignStroke', {
    default: '#105b52'
  } ),

  fieldSignTextColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldSignText', {
    default: '#ffffff'
  } ),

  fieldSignPostColorProperty: new ProfileColorProperty( projectileDataLab, 'fieldSignPost', {
    default: '#c7baba'
  } ),

  heatMapColorProperty: new ProfileColorProperty( projectileDataLab, 'heatMap', {
    default: '#EE6102'
  } ),

  heatMapBodyFillColorProperty: new ProfileColorProperty( projectileDataLab, 'heatMapBodyFill', {
    default: '#FCFCFC'
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
    default: '#8500bd'
  } ),

  meanMarkerStrokeProperty: new ProfileColorProperty( projectileDataLab, 'meanMarkerStroke', {
    default: '#000000'
  } ),

  intervalToolSphereColorProperty: new ProfileColorProperty( projectileDataLab, 'intervalToolSphere', {
    default: '#ffc537'
  } ),

  intervalToolLineColorProperty: new ProfileColorProperty( projectileDataLab, 'intervalToolLine', {
    default: '#8f8f8f'
  } ),

  histogramIntervalToolFillColorProperty: new ProfileColorProperty( projectileDataLab, 'histogramIntervalToolFill', {
    default: new Color( 'yellow' ).withAlpha( 0.3 )
  } )
};

projectileDataLab.register( 'PDLColors', PDLColors );
export default PDLColors;
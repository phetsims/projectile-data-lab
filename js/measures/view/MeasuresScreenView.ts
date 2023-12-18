// Copyright 2023, University of Colorado Boulder

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import MeasuresModel from '../model/MeasuresModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VSMScreenView from '../../common-vsm/view/VSMScreenView.js';
import MeasuresStaticToolPanel from './MeasuresStaticToolPanel.js';
import MeasuresInteractiveToolPanel from './MeasuresInteractiveToolPanel.js';
import MeasuresLaunchPanel from './MeasuresLaunchPanel.js';
import CustomLauncherNode from '../../common-vsm/view/CustomLauncherNode.js';
import MeasuresField from '../model/MeasuresField.js';
import DataMeasuresOverlay from './DataMeasuresOverlay.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import MeasuresHistogramNode from './MeasuresHistogramNode.js';
import IntervalToolNode from './IntervalToolNode.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class MeasuresScreenView extends VSMScreenView<MeasuresField> {

  protected readonly launcherNode: CustomLauncherNode;

  public constructor( model: MeasuresModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    const launchPanel = new MeasuresLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty,
      model.isLauncherCustomProperty, model.mysteryLauncherProperty, model.customLauncherTypeProperty, model.angleStabilizerProperty, {
        tandem: options.tandem.createTandem( 'launchPanel' )
      } );

    const staticToolPanel = new MeasuresStaticToolPanel( model.isPathsVisibleProperty, model.isLaunchAngleVisibleProperty,
      model.isLaunchSpeedVisibleProperty,
      model.isDataMeasuresVisibleProperty, {
        tandem: options.tandem.createTandem( 'staticToolPanel' )
      } );
    const interactiveToolPanel = new MeasuresInteractiveToolPanel(
      model.isMeasuringTapeVisibleProperty,
      model.isStopwatchVisibleProperty,
      model.isIntervalToolVisibleProperty, {
        tandem: options.tandem.createTandem( 'interactiveToolPanel' )
      } );

    const histogramNode = new MeasuresHistogramNode(
      model.fieldProperty,
      model.fields,
      model.binWidthProperty,
      model.histogramRepresentationProperty,
      ProjectileDataLabStrings.distanceStringProperty,
      model.isDataMeasuresVisibleProperty,
      model.landedDistanceAverageProperty,
      model.landedDistanceStandardDeviationProperty,
      model.intervalTool,
      model.isIntervalToolVisibleProperty, {
        tandem: options.tandem.createTandem( 'histogramNode' )
      } );

    super( model, launchPanel, staticToolPanel, interactiveToolPanel, histogramNode, options );

    this.launcherNode = new CustomLauncherNode(
      this.modelViewTransform,
      model.launcherConfigurationProperty,
      model.meanLaunchAngleProperty,
      model.launcherHeightProperty,
      model.isLauncherCustomProperty,
      model.mysteryLauncherProperty,
      model.customLauncherTypeProperty,
      model.angleStabilizerProperty,
      model.latestLaunchSpeedProperty,
      {}
    );

    this.launcherLayer.addChild( this.launcherNode );

    const intervalToolNode = new IntervalToolNode( model.intervalTool, this.modelViewTransform, model.isIntervalToolVisibleProperty, {
      tandem: options.tandem.createTandem( 'intervalToolNode' )
    } );

    const dataMeasuresFieldOverlay = new DataMeasuresOverlay( this.modelViewTransform,
      model.landedDistanceAverageProperty, model.landedDistanceStandardDeviationProperty, 50, model.isDataMeasuresVisibleProperty, {
        tandem: options.tandem.createTandem( 'dataMeasuresFieldOverlay' )
      } );

    this.toolsLayer.addChild( intervalToolNode );
    this.toolsLayer.addChild( dataMeasuresFieldOverlay );

    // Keyboard order. TODO: How to eliminate duplication with the parent class? See https://github.com/phetsims/projectile-data-lab/issues/7
    this.pdomControlAreaNode.pdomOrder = [
      this.launchPanel,
      this.launchButton,
      this.launchControlRadioButtonGroup,
      this.fieldSelectorPanel,
      this.projectileSelectorPanel,
      intervalToolNode, // this one is added
      this.timeControlNode,
      this.resetAllButton,
      this.eraserButton,
      staticToolPanel,
      interactiveToolPanel
    ];
  }
}

projectileDataLab.register( 'MeasuresScreenView', MeasuresScreenView );
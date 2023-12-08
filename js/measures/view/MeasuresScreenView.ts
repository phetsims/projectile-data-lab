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
import DataMeasuresFieldOverlay from './DataMeasuresFieldOverlay.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class MeasuresScreenView extends VSMScreenView<MeasuresField> {

  protected readonly launcherNode: CustomLauncherNode;

  public constructor( model: MeasuresModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    const launchPanel = new MeasuresLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty,
      model.isLauncherCustomProperty, model.presetLauncherProperty, model.customLauncherTypeProperty, model.angleStabilizerProperty, {
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

    super( model, launchPanel, staticToolPanel, interactiveToolPanel, options );

    this.launcherNode = new CustomLauncherNode(
      this.modelViewTransform,
      model.launcherConfigurationProperty,
      model.launcherAngleProperty,
      model.launcherHeightProperty,
      model.isLauncherCustomProperty,
      model.presetLauncherProperty,
      model.customLauncherTypeProperty,
      model.angleStabilizerProperty,
      {}
    );

    this.launcherLayer.addChild( this.launcherNode );

    const dataMeasuresFieldOverlay = new DataMeasuresFieldOverlay(
      this.modelViewTransform, model.landedDistanceAverageProperty, model.landedDistanceStandardDeviationProperty, {
        visibleProperty: model.isDataMeasuresVisibleProperty,
        tandem: options.tandem.createTandem( 'dataMeasuresFieldOverlay' )
      } );

    this.toolsLayer.addChild( dataMeasuresFieldOverlay );
    dataMeasuresFieldOverlay.moveToBack();
  }
}

projectileDataLab.register( 'MeasuresScreenView', MeasuresScreenView );
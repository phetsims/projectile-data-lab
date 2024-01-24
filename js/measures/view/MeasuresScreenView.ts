// Copyright 2023-2024, University of Colorado Boulder

/**
 * The MeasuresScreenView is the view for the Measures screen.
 *
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
import CustomizableLauncherNode from '../../common-vsm/view/CustomizableLauncherNode.js';
import MeasuresField from '../model/MeasuresField.js';
import DataMeasuresOverlay from './DataMeasuresOverlay.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import MeasuresHistogramNode from './MeasuresHistogramNode.js';
import IntervalToolNode from './IntervalToolNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import { accordionBoxTandemName } from '../../common/view/PDLAccordionBox.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class MeasuresScreenView extends VSMScreenView<MeasuresField> {

  protected readonly launcherNode: CustomizableLauncherNode;

  public constructor( model: MeasuresModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    const launchPanel = new MeasuresLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty,
      model.mysteryOrCustomProperty, model.mysteryLauncherProperty, model.customLauncherMechanismProperty, model.standardDeviationAngleProperty, {
        tandem: options.tandem.createTandem( 'launchPanel' )
      } );

    const staticToolPanel = new MeasuresStaticToolPanel(
      model.isPathsVisibleProperty,
      model.isLaunchAngleVisibleProperty,
      model.isLaunchSpeedVisibleProperty,
      model.isMeanVisibleProperty,
      model.isStandardDeviationVisibleProperty,
      model.isValuesVisibleProperty, {
        tandem: options.tandem.createTandem( 'staticToolPanel' )
      } );
    const interactiveToolPanel = new MeasuresInteractiveToolPanel(
      model.isMeasuringTapeVisibleProperty,
      model.isStopwatchVisibleProperty,
      model.isIntervalToolVisibleProperty, {
        tandem: options.tandem.createTandem( 'interactiveToolPanel' )
      } );

    const createHistogramNode = ( comboBoxParent: Node ) => new MeasuresHistogramNode(
      model.fieldProperty,
      model.fields,
      model.binWidthProperty,
      model.histogramRepresentationProperty,
      ProjectileDataLabStrings.distanceStringProperty,
      model.isMeanVisibleProperty,
      model.isStandardDeviationVisibleProperty,
      model.isValuesVisibleProperty,
      model.meanDistanceProperty,
      model.standardDeviationDistanceProperty,
      model.standardErrorDistanceProperty,
      model.intervalTool,
      model.isIntervalToolVisibleProperty,
      model.selectedBinWidthProperty,
      model.selectedTotalBinsProperty,
      comboBoxParent, {
        tandem: options.tandem.createTandem( accordionBoxTandemName ).createTandem( 'histogramNode' )
      } );

    super( model, launchPanel, staticToolPanel, interactiveToolPanel, createHistogramNode, options );

    this.launcherNode = new CustomizableLauncherNode(
      this.modelViewTransform,
      model.launcherConfigurationProperty,
      model.meanLaunchAngleProperty,
      model.launcherHeightProperty,
      model.mysteryOrCustomProperty,
      model.mysteryLauncherProperty,
      model.customLauncherMechanismProperty,
      model.standardDeviationAngleProperty,
      model.latestLaunchSpeedProperty,
      model.fieldProperty,
      {}
    );

    this.launcherLayer.addChild( this.launcherNode );

    const intervalToolNode = new IntervalToolNode( model.intervalTool, this.modelViewTransform, model.isIntervalToolVisibleProperty, {
      tandem: options.tandem.createTandem( 'intervalToolNode' )
    } );

    const dataMeasuresFieldOverlay = new DataMeasuresOverlay(
      this.modelViewTransform,
      model.meanDistanceProperty,
      model.standardDeviationDistanceProperty,
      model.isMeanVisibleProperty,
      model.isStandardDeviationVisibleProperty,
      model.isValuesVisibleProperty,
      75, {
        context: 'field',
        tandem: options.tandem.createTandem( 'dataMeasuresFieldOverlay' )
      } );

    this.toolsLayer.addChild( intervalToolNode );
    this.toolsLayer.addChild( dataMeasuresFieldOverlay );

    // Keyboard order.
    this.setVSMPDOMOrder( staticToolPanel, interactiveToolPanel, intervalToolNode );
  }
}

projectileDataLab.register( 'MeasuresScreenView', MeasuresScreenView );
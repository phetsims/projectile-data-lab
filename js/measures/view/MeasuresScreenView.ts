// Copyright 2023-2024, University of Colorado Boulder

/**
 * The MeasuresScreenView is the view for the Measures screen.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import MeasuresModel from '../model/MeasuresModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VSMScreenView, { VSMScreenViewOptions } from '../../common-vsm/view/VSMScreenView.js';
import MeasuresStaticToolPanel from './MeasuresStaticToolPanel.js';
import MeasuresInteractiveToolPanel from './MeasuresInteractiveToolPanel.js';
import MeasuresLaunchPanel from './MeasuresLaunchPanel.js';
import CustomLauncherNode from '../../common-vsm/view/CustomLauncherNode.js';
import MeasuresField from '../model/MeasuresField.js';
import DataMeasuresOverlay from './DataMeasuresOverlay.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import MeasuresHistogramNode from './MeasuresHistogramNode.js';
import IntervalToolNode from './IntervalToolNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import { histogramAccordionBoxTandemName } from '../../common/view/HistogramAccordionBox.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;

type MeasuresScreenViewOptions = SelfOptions & StrictOmit<VSMScreenViewOptions, 'createLauncherNode'>;

export default class MeasuresScreenView extends VSMScreenView<MeasuresField> {

  public constructor( model: MeasuresModel, providedOptions: MeasuresScreenViewOptions ) {
    const options = optionize<MeasuresScreenViewOptions, SelfOptions, VSMScreenViewOptions>()( {
      createLauncherNode: modelViewTransform => new CustomLauncherNode(
        modelViewTransform,
        model.launcherConfigurationProperty,
        model.meanLaunchAngleProperty,
        model.launcherHeightProperty,
        model.mysteryOrCustomProperty,
        model.mysteryLauncherProperty,
        model.customLauncherMechanismProperty,
        model.standardDeviationAngleProperty,
        model.latestLaunchSpeedProperty,
        model.fieldProperty
      )
    }, providedOptions );

    const launchPanel = new MeasuresLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty,
      model.mysteryOrCustomProperty, model.mysteryLauncherProperty, model.customLauncherMechanismProperty, model.angleStabilizerProperty, {
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
      model.stopwatch.isVisibleProperty,
      model.isIntervalToolVisibleProperty, {
        tandem: options.tandem.createTandem( 'interactiveToolPanel' )
      } );

    const createHistogramNode = ( comboBoxParent: Node ) => new MeasuresHistogramNode(
      model.fieldProperty,
      model.fields,
      model.totalProjectileCountProperty,
      model.numberOfLandedProjectilesProperty,
      model.histogram,
      ProjectileDataLabStrings.distanceStringProperty,
      model.isMeanVisibleProperty,
      model.isStandardDeviationVisibleProperty,
      model.isValuesVisibleProperty,
      model.meanDistanceProperty,
      model.standardDeviationDistanceProperty,
      model.standardErrorDistanceProperty,
      model.intervalTool,
      model.isIntervalToolVisibleProperty,
      comboBoxParent, {
        tandem: options.tandem.createTandem( histogramAccordionBoxTandemName ).createTandem( 'histogramNode' )
      } );

    super( model, launchPanel, staticToolPanel, interactiveToolPanel, createHistogramNode, options );

    const intervalToolNode = new IntervalToolNode( model.intervalTool, this.modelViewTransform, {
      isIcon: false,
      visibleProperty: model.isIntervalToolVisibleProperty,
      tandem: options.tandem.createTandem( 'intervalToolNode' )
    } );

    const dataMeasuresFieldOverlay = new DataMeasuresOverlay(
      this.modelViewTransform,
      model.meanDistanceProperty,
      model.standardDeviationDistanceProperty,
      model.isMeanVisibleProperty,
      model.isStandardDeviationVisibleProperty,
      model.isValuesVisibleProperty,
      62,
      null, {
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
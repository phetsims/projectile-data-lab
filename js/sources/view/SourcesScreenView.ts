// Copyright 2023-2024, University of Colorado Boulder

/**
 * The SourcesScreenView for Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import SourcesModel from '../model/SourcesModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SourcesLaunchPanel from './SourcesLaunchPanel.js';
import VSMScreenView from '../../common-vsm/view/VSMScreenView.js';
import StaticToolPanel from '../../common-vsm/view/StaticToolPanel.js';
import InteractiveToolPanel from '../../common-vsm/view/InteractiveToolPanel.js';
import Property from '../../../../axon/js/Property.js';
import CustomLauncherNode from '../../common-vsm/view/CustomLauncherNode.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { Node } from '../../../../scenery/js/imports.js';
import HistogramNode from '../../common/view/HistogramNode.js';
import PDLColors from '../../common/PDLColors.js';
import { histogramAccordionBoxTandemName } from '../../common/view/HistogramAccordionBox.js';
import SMField from '../../common-sm/model/SMField.js';

type SelfOptions = EmptySelfOptions;
type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SourcesScreenView extends VSMScreenView<SMField> {

  protected readonly launcherNode: CustomLauncherNode;

  public constructor( model: SourcesModel,
                      providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    const launchPanel = new SourcesLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty,
      model.customLauncherMechanismProperty, model.angleStabilizerProperty, {
        tandem: options.tandem.createTandem( 'launchPanel' )
      } );

    const staticToolPanel = new StaticToolPanel( model.isPathsVisibleProperty, model.isLaunchAngleVisibleProperty, model.isLaunchSpeedVisibleProperty, {
      tandem: options.tandem.createTandem( 'staticToolPanel' )
    } );
    const interactiveToolPanel = new InteractiveToolPanel(
      model.isMeasuringTapeVisibleProperty,
      model.stopwatch.isVisibleProperty, {
        tandem: options.tandem.createTandem( 'interactiveToolPanel' )
      } );

    const createHistogramNode = ( node: Node ) => new HistogramNode(
      model.fieldProperty,
      model.fields,
      model.histogram.zoomProperty,
      model.histogram.binWidthProperty,
      model.histogram.representationProperty,
      ProjectileDataLabStrings.distanceStringProperty,
      model.histogram.selectedBinWidthProperty,
      model.histogram.selectedTotalBinsProperty,
      node,
      PDLColors.histogramDataFillColorProperty,
      PDLColors.histogramDataStrokeColorProperty, {
        tandem: options.tandem.createTandem( histogramAccordionBoxTandemName ).createTandem( 'histogramNode' )
      } );

    super( model, launchPanel, staticToolPanel, interactiveToolPanel, createHistogramNode, options );

    const launcher = model.launcherProperty.value;
    assert && assert( launcher.mysteryOrCustom === 'custom', 'The launcher should be custom' );

    this.launcherNode = new CustomLauncherNode(
      this.modelViewTransform,
      model.launcherConfigurationProperty,
      model.meanLaunchAngleProperty,
      model.launcherHeightProperty,
      new Property( 'custom' ),
      new Property( launcher ),
      model.customLauncherMechanismProperty,
      model.standardDeviationAngleProperty,
      model.latestLaunchSpeedProperty,
      model.fieldProperty,
      {}
    );

    this.launcherLayer.addChild( this.launcherNode );
  }
}

projectileDataLab.register( 'SourcesScreenView', SourcesScreenView );
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
import CustomizableLauncherNode from '../../common-vsm/view/CustomizableLauncherNode.js';
import VSMField from '../../common-vsm/model/VSMField.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { Node } from '../../../../scenery/js/imports.js';
import HistogramNode from '../../common/view/HistogramNode.js';
import PDLColors from '../../common/PDLColors.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SourcesScreenView extends VSMScreenView<VSMField> {

  protected readonly launcherNode: CustomizableLauncherNode;

  public constructor( model: SourcesModel,
                      providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    const launchPanel = new SourcesLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty,
      model.customLauncherMechanismProperty, model.standardDeviationAngleProperty, {
        tandem: options.tandem.createTandem( 'launchPanel' )
      } );

    const staticToolPanel = new StaticToolPanel( model.isPathsVisibleProperty, model.isLaunchAngleVisibleProperty, model.isLaunchSpeedVisibleProperty, {
      tandem: options.tandem.createTandem( 'staticToolPanel' )
    } );
    const interactiveToolPanel = new InteractiveToolPanel(
      model.isMeasuringTapeVisibleProperty,
      model.isStopwatchVisibleProperty, {
        tandem: options.tandem.createTandem( 'interactiveToolPanel' )
      } );

    const createHistogramNode = ( node: Node ) => new HistogramNode(
      model.fieldProperty,
      model.fields,
      model.binWidthProperty,
      model.histogramRepresentationProperty,
      ProjectileDataLabStrings.distanceStringProperty,
      model.selectedBinWidthProperty,
      model.selectedTotalBinsProperty,
      node,
      PDLColors.histogramDataFillColorProperty,
      PDLColors.histogramDataStrokeColorProperty, {
        tandem: options.tandem.createTandem( 'accordionBox' ).createTandem( 'histogramNode' )
      } );

    super( model, launchPanel, staticToolPanel, interactiveToolPanel, createHistogramNode, options );

    const launcher = model.launcherProperty.value;
    assert && assert( launcher.mysteryOrCustom === 'custom', 'The launcher should be custom' );

    this.launcherNode = new CustomizableLauncherNode(
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
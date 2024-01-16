// Copyright 2023-2024, University of Colorado Boulder

/**
 * The VariabilityScreenView represents the view for the Variability Screen.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import VariabilityModel from '../model/VariabilityModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VariabilityLaunchPanel from './VariabilityLaunchPanel.js';
import VSMScreenView from '../../common-vsm/view/VSMScreenView.js';
import StaticToolPanel from '../../common-vsm/view/StaticToolPanel.js';
import InteractiveToolPanel from '../../common-vsm/view/InteractiveToolPanel.js';
import LauncherNode from '../../common/view/LauncherNode.js';
import VSMField from '../../common-vsm/model/VSMField.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { Node } from '../../../../scenery/js/imports.js';
import VSMHistogramNode from '../../common-vsm/view/VSMHistogramNode.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class VariabilityScreenView extends VSMScreenView<VSMField> {

  protected readonly launcherNode: LauncherNode;

  public constructor( model: VariabilityModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    const launchPanel = new VariabilityLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty, model.mysteryLauncherNumberProperty, {
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

    const createHistogramNode = ( node: Node ) => new VSMHistogramNode(
      model.fieldProperty,
      model.fields,
      model.binWidthProperty,
      model.histogramRepresentationProperty,
      ProjectileDataLabStrings.distanceStringProperty,
      model.selectedBinWidthProperty,
      model.selectedTotalBinsProperty,
      node, {
        tandem: options.tandem.createTandem( 'histogramNode' )
      } );

    super( model, launchPanel, staticToolPanel, interactiveToolPanel, createHistogramNode, options );

    this.launcherNode = new LauncherNode(
      this.modelViewTransform,
      model.meanLaunchAngleProperty,
      model.launcherHeightProperty,
      model.mysteryLauncherNumberProperty,
      {}
    );

    this.launcherLayer.addChild( this.launcherNode );
  }
}
projectileDataLab.register( 'VariabilityScreenView', VariabilityScreenView );
// Copyright 2023-2024, University of Colorado Boulder

/**
 * The SourcesScreenView for Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import SourcesModel from '../model/SourcesModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SourcesLaunchPanel from './SourcesLaunchPanel.js';
import VSMScreenView, { VSMScreenViewOptions } from '../../common-vsm/view/VSMScreenView.js';
import StaticToolPanel from '../../common-vsm/view/StaticToolPanel.js';
import InteractiveToolPanel from '../../common-vsm/view/InteractiveToolPanel.js';
import Property from '../../../../axon/js/Property.js';
import CustomLauncherNode from '../../common-vsm/view/CustomLauncherNode.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { Node } from '../../../../scenery/js/imports.js';

import PDLColors from '../../common/PDLColors.js';
import { histogramAccordionBoxTandemName } from '../../common/view/HistogramAccordionBox.js';
import SMField from '../../common-sm/model/SMField.js';
import VSMHistogramNode from '../../common-vsm/view/VSMHistogramNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;
type SourcesScreenViewOptions = SelfOptions & StrictOmit<VSMScreenViewOptions, 'createLauncherNode'>;

export default class SourcesScreenView extends VSMScreenView<SMField> {

  public constructor( model: SourcesModel, providedOptions: SourcesScreenViewOptions ) {

    const launcher = model.launcherProperty.value;
    assert && assert( launcher.mysteryOrCustom === 'custom', 'The launcher should be custom' );

    const options = optionize<SourcesScreenViewOptions, SelfOptions, VSMScreenViewOptions>()( {

      createLauncherNode: modelViewTransform => new CustomLauncherNode(
        modelViewTransform,
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
      )
    }, providedOptions );

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

    const createHistogramNode = ( node: Node ) => new VSMHistogramNode(
      model.fieldProperty,
      model.fields,
      model.totalProjectileCountProperty,
      model.numberOfLandedProjectilesProperty,
      ProjectileDataLabStrings.distanceStringProperty,
      model.histogram,
      node,
      PDLColors.histogramDataFillProperty,
      PDLColors.histogramDataStrokeProperty, {
        tandem: options.tandem.createTandem( histogramAccordionBoxTandemName ).createTandem( 'histogramNode' )
      } );

    super( model, launchPanel, staticToolPanel, interactiveToolPanel, createHistogramNode, options );
  }
}

projectileDataLab.register( 'SourcesScreenView', SourcesScreenView );
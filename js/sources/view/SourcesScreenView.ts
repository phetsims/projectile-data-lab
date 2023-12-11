// Copyright 2023, University of Colorado Boulder

/**
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
import VSMField from '../../common-vsm/model/VSMField.js';
import HistogramNode from '../../common/view/HistogramNode.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SourcesScreenView extends VSMScreenView<VSMField> {

  protected readonly launcherNode: CustomLauncherNode;

  public constructor( model: SourcesModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    const launchPanel = new SourcesLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty,
      model.customLauncherTypeProperty, model.angleStabilizerProperty, { tandem: options.tandem.createTandem( 'launchPanel' ) } );

    const staticToolPanel = new StaticToolPanel( model.isPathsVisibleProperty, model.isLaunchAngleVisibleProperty, model.isLaunchSpeedVisibleProperty, {
      tandem: options.tandem.createTandem( 'staticToolPanel' )
    } );
    const interactiveToolPanel = new InteractiveToolPanel(
      model.isMeasuringTapeVisibleProperty,
      model.isStopwatchVisibleProperty, {
        tandem: options.tandem.createTandem( 'interactiveToolPanel' )
      } );

    const histogramNode = new HistogramNode( model.fieldProperty, model.fields, model.binWidthProperty,
      model.histogramRepresentationProperty, ProjectileDataLabStrings.distanceStringProperty, {
        tandem: options.tandem.createTandem( 'histogramNode' )
      } );

    super( model, launchPanel, staticToolPanel, interactiveToolPanel, histogramNode, options );

    this.launcherNode = new CustomLauncherNode(
      this.modelViewTransform,
      model.launcherConfigurationProperty,
      model.launcherAngleProperty,
      model.launcherHeightProperty,
      new Property( true ),
      new Property( 1 ),
      model.customLauncherTypeProperty,
      model.angleStabilizerProperty,
      {}
    );

    this.launcherLayer.addChild( this.launcherNode );

    model.fields.forEach( field => {
      field.projectileLaunchedEmitter.addListener( projectile => {
        if ( model.fieldProperty.value === field ) {
          // TODO: (Also in measures screen) Update the pressure gauge - see https://github.com/phetsims/projectile-data-lab/issues/7
          // this.launcherNode.setLaunchSpeed( projectile.launchSpeed );
        }
      } );
    } );
  }
}

projectileDataLab.register( 'SourcesScreenView', SourcesScreenView );
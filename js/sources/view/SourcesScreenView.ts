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
import VSMFieldPanel from '../../common-vsm/view/VSMFieldPanel.js';
import { ManualConstraint, VBox } from '../../../../scenery/js/imports.js';
import VSMScreenView from '../../common-vsm/view/VSMScreenView.js';
import StaticToolPanel from '../../common-vsm/view/StaticToolPanel.js';
import PDLConstants from '../../common/PDLConstants.js';
import InteractiveToolPanel from '../../common-vsm/view/InteractiveToolPanel.js';
import Property from '../../../../axon/js/Property.js';
import CustomLauncherNode from '../../common-vsm/view/CustomLauncherNode.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SourcesScreenView extends VSMScreenView {

  protected readonly launcherNode: CustomLauncherNode;
  protected readonly launchPanel: SourcesLaunchPanel;

  public constructor( model: SourcesModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

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

    this.launchPanel = new SourcesLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty,
      model.customLauncherTypeProperty, model.angleStabilizerProperty, { tandem: options.tandem.createTandem( 'launchPanel' ) } );
    this.addChild( this.launchPanel );

    const fieldPanel = new VSMFieldPanel( model.fieldProperty, {
      tandem: options.tandem.createTandem( 'fieldPanel' )
    } );
    const staticToolPanel = new StaticToolPanel( model.isPathsVisibleProperty, model.isLaunchAngleVisibleProperty, model.isLaunchSpeedVisibleProperty, {
      tandem: options.tandem.createTandem( 'staticToolPanel' )
    } );
    const interactiveToolPanel = new InteractiveToolPanel(
      model.isTargetVisibleProperty,
      model.isMeasuringTapeVisibleProperty,
      model.isStopwatchVisibleProperty, {
        tandem: options.tandem.createTandem( 'interactiveToolPanel' )
      } );
    const rightVBox = new VBox( {
      stretch: true,
      top: this.layoutBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN,
      right: this.layoutBounds.right - PDLConstants.SCREEN_VIEW_X_MARGIN,
      spacing: PDLConstants.INTER_PANEL_SPACING,
      children: [ staticToolPanel, interactiveToolPanel, fieldPanel, this.projectileSelectorPanel ]
    } );
    this.addChild( rightVBox );

    this.toolsLayer.moveToFront();

    // TODO: Don't repeat this in each screen view - see https://github.com/phetsims/projectile-data-lab/issues/7
    ManualConstraint.create(
      this,
      [ this.accordionBox, this.launchPanel, rightVBox ],
      ( accordionBoxProxy, launchPanelProxy, rightVBoxProxy ) => {
        accordionBoxProxy.left = launchPanelProxy.right + PDLConstants.INTER_PANEL_SPACING;
        const accordionBoxWidth = rightVBoxProxy.left - launchPanelProxy.right - 2 * PDLConstants.INTER_PANEL_SPACING;
        accordionBoxProxy.maxWidth = accordionBoxWidth;
        accordionBoxProxy.preferredWidth = accordionBoxWidth;
      } );

    this.visibleBoundsProperty.link( visibleBounds => {
      this.launchPanel.top = visibleBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN;
      rightVBox.top = visibleBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    this.pdomControlAreaNode.pdomOrder = [
      this.launchPanel,
      this.launchButton,
      this.launchControlRadioButtonGroup,
      this.timeControlNode,
      rightVBox,
      fieldPanel,
      this.eraserButton,
      this.resetAllButton
    ];
  }
}

projectileDataLab.register( 'SourcesScreenView', SourcesScreenView );
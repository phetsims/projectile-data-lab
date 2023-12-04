// Copyright 2023, University of Colorado Boulder

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import MeasuresModel from '../model/MeasuresModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VSMFieldPanel from '../../common-vsm/view/VSMFieldPanel.js';
import { ManualConstraint, VBox } from '../../../../scenery/js/imports.js';
import VSMScreenView from '../../common-vsm/view/VSMScreenView.js';
import PDLConstants from '../../common/PDLConstants.js';
import MeasuresStaticToolPanel from './MeasuresStaticToolPanel.js';
import MeasuresInteractiveToolPanel from './MeasuresInteractiveToolPanel.js';
import MeasuresLaunchPanel from './MeasuresLaunchPanel.js';
import CustomLauncherNode from '../../common-vsm/view/CustomLauncherNode.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class MeasuresScreenView extends VSMScreenView {

  protected readonly launcherNode: CustomLauncherNode;
  protected readonly launchPanel: MeasuresLaunchPanel;

  public constructor( model: MeasuresModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

    this.launcherNode = new CustomLauncherNode(
      this.modelViewTransform,
      model.launcherAngleProperty,
      model.launcherHeightProperty,
      model.isLauncherCustomProperty,
      model.presetLauncherProperty,
      model.customLauncherTypeProperty,
      model.angleStabilizerProperty,
      {}
    );

    this.launcherLayer.addChild( this.launcherNode );

    this.launchPanel = new MeasuresLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty,
      model.isLauncherCustomProperty, model.presetLauncherProperty, model.customLauncherTypeProperty, model.angleStabilizerProperty, {
        tandem: options.tandem.createTandem( 'launchPanel' )
      } );
    this.addChild( this.launchPanel );

    const fieldPanel = new VSMFieldPanel( model.fieldProperty, {
      tandem: options.tandem.createTandem( 'fieldPanel' )
    } );

    const staticToolPanel = new MeasuresStaticToolPanel( model.isPathsVisibleProperty, model.isLaunchAngleVisibleProperty,
      model.isLaunchSpeedVisibleProperty,
      model.isDataMeasuresVisibleProperty, {
        tandem: options.tandem.createTandem( 'staticToolPanel' )
      } );
    const interactiveToolPanel = new MeasuresInteractiveToolPanel(
      model.isTargetVisibleProperty,
      model.isMeasuringTapeVisibleProperty,
      model.isStopwatchVisibleProperty,
      model.isIntervalToolVisibleProperty, {
        tandem: options.tandem.createTandem( 'interactiveToolPanel' )
      } );
    const rightVBox = new VBox( {
      stretch: true,
      top: this.layoutBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN,
      right: this.layoutBounds.right - PDLConstants.SCREEN_VIEW_X_MARGIN,
      spacing: PDLConstants.INTER_PANEL_SPACING,
      children: [ staticToolPanel, interactiveToolPanel, fieldPanel ]
    } );
    this.addChild( rightVBox );

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


    // Keyboard order
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

projectileDataLab.register( 'MeasuresScreenView', MeasuresScreenView );
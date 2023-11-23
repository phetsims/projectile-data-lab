// Copyright 2023, University of Colorado Boulder

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import VariabilityModel from '../model/VariabilityModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VariabilityLaunchPanel from './VariabilityLaunchPanel.js';
import FieldPanel from '../../common/view/panels/FieldPanel.js';
import { ManualConstraint, VBox } from '../../../../scenery/js/imports.js';
import { VSMScreenView } from '../../common-vsm/view/VSMScreenView.js';
import StaticToolPanel from '../../common-vsm/view/StaticToolPanel.js';
import PDLConstants from '../../common/PDLConstants.js';
import InteractiveToolPanel from '../../common-vsm/view/InteractiveToolPanel.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class VariabilityScreenView extends VSMScreenView {

  public constructor( model: VariabilityModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

    const variabilityLaunchPanel = new VariabilityLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty, model.launcherTypeProperty, {
      tandem: options.tandem.createTandem( 'variabilityLaunchPanel' )
    } );
    this.addChild( variabilityLaunchPanel );

    const fieldPanel = new FieldPanel( model.fieldProperty, {
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
      spacing: PDLConstants.INTER_PANEL_VERTICAL_SPACING,
      children: [ staticToolPanel, interactiveToolPanel, fieldPanel ]
    } );
    this.addChild( rightVBox );

    // Layout
    ManualConstraint.create( this, [ rightVBox ], rightVBoxProxy => {
      rightVBoxProxy.right = this.layoutBounds.right - PDLConstants.SCREEN_VIEW_X_MARGIN;
      rightVBoxProxy.top = this.layoutBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    this.pdomControlAreaNode.pdomOrder = [
      variabilityLaunchPanel,
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
projectileDataLab.register( 'VariabilityScreenView', VariabilityScreenView );
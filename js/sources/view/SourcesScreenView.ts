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
import { VBox } from '../../../../scenery/js/imports.js';
import { VSMScreenView } from '../../common-vsm/view/VSMScreenView.js';
import StaticToolPanel from '../../common-vsm/view/StaticToolPanel.js';
import PDLConstants from '../../common/PDLConstants.js';
import InteractiveToolPanel from '../../common-vsm/view/InteractiveToolPanel.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SourcesScreenView extends VSMScreenView {

  public constructor( model: SourcesModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

    const sourcesLaunchPanel = new SourcesLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty,
      model.customLauncherTypeProperty, model.angleStabilizerProperty, { tandem: options.tandem.createTandem( 'sourcesLaunchPanel' ) } );
    this.addChild( sourcesLaunchPanel );

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
      spacing: PDLConstants.INTER_PANEL_VERTICAL_SPACING,
      children: [ staticToolPanel, interactiveToolPanel, fieldPanel ]
    } );
    this.addChild( rightVBox );

    this.pdomControlAreaNode.pdomOrder = [
      sourcesLaunchPanel,
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
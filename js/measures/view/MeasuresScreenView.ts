// Copyright 2023, University of Colorado Boulder

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import MeasuresModel from '../model/MeasuresModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SourcesLaunchPanel from '../../sources/view/SourcesLaunchPanel.js';
import FieldPanel from '../../common/view/panels/FieldPanel.js';
import { ManualConstraint, VBox } from '../../../../scenery/js/imports.js';
import { VSMScreenView } from '../../common-vsm/view/VSMScreenView.js';
import PDLConstants from '../../common/PDLConstants.js';
import MeasuresStaticToolPanel from './MeasuresStaticToolPanel.js';
import MeasuresInteractiveToolPanel from './MeasuresInteractiveToolPanel.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class MeasuresScreenView extends VSMScreenView {

  public constructor( model: MeasuresModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

    const measuresLaunchPanel = new SourcesLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty, model.launcherTypeProperty, {
      tandem: options.tandem.createTandem( 'measuresLaunchPanel' )
    } );
    this.addChild( measuresLaunchPanel );

    const fieldPanel = new FieldPanel( model.fieldProperty, {
      tandem: options.tandem.createTandem( 'fieldPanel' )
    } );

    const staticToolPanel = new MeasuresStaticToolPanel( model.isPathsVisibleProperty, model.isLaunchAngleVisibleProperty,
      model.isLaunchSpeedVisibleProperty,
      model.isDataMeasuresVisibleProperty,
      model.isIdealDistributionVisibleProperty, {
        tandem: options.tandem.createTandem( 'staticToolPanel' )
      } );
    const interactiveToolPanel = new MeasuresInteractiveToolPanel(
      model.isTargetVisibleProperty,
      model.isTapeMeasureVisibleProperty,
      model.isStopwatchVisibleProperty,
      model.isIntervalToolVisibleProperty, {
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
      rightVBoxProxy.top = this.layoutBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN;
      rightVBoxProxy.right = this.layoutBounds.right - PDLConstants.SCREEN_VIEW_X_MARGIN;
    } );

    // Keyboard order
    this.pdomControlAreaNode.pdomOrder = [ measuresLaunchPanel, this.launchButton, this.launchControlRadioButtonGroup, this.timeControlNode, staticToolPanel, fieldPanel, this.resetAllButton ];
  }
}

projectileDataLab.register( 'MeasuresScreenView', MeasuresScreenView );
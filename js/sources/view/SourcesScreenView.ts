// Copyright 2023, University of Colorado Boulder

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import SourcesModel from '../model/SourcesModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SourcesLaunchPanel from './SourcesLaunchPanel.js';
import FieldPanel from '../../common/view/panels/FieldPanel.js';
import { ManualConstraint, VBox } from '../../../../scenery/js/imports.js';
import { VSMScreenView } from '../../common-vsm/view/VSMScreenView.js';
import StaticToolPanel from '../../common-vsm/view/StaticToolPanel.js';
import PDLConstants from '../../common/PDLConstants.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SourcesScreenView extends VSMScreenView {

  public constructor( model: SourcesModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

    const sourcesLaunchPanel = new SourcesLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty, model.launcherTypeProperty, {
      tandem: options.tandem.createTandem( 'sourcesLaunchPanel' )
    } );
    this.addChild( sourcesLaunchPanel );

    const fieldPanel = new FieldPanel( model.fieldProperty, {
      tandem: options.tandem.createTandem( 'fieldPanel' )
    } );
    const staticToolPanel = new StaticToolPanel( {
      tandem: options.tandem.createTandem( 'staticToolPanel' )
    } );
    const rightVBox = new VBox( {
      stretch: true,
      spacing: PDLConstants.INTER_PANEL_VERTICAL_SPACING,
      children: [ staticToolPanel, fieldPanel ]
    } );
    this.addChild( rightVBox );

    // Layout
    ManualConstraint.create( this, [ rightVBox ], rightVBoxProxy => {
      rightVBoxProxy.top = this.layoutBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN;
      rightVBoxProxy.right = this.layoutBounds.right - PDLConstants.SCREEN_VIEW_X_MARGIN;
    } );

    this.pdomControlAreaNode.pdomOrder = [ sourcesLaunchPanel, this.launchButton, this.launchControlRadioButtonGroup, this.timeControlNode, staticToolPanel, fieldPanel, this.resetAllButton ];
  }
}

projectileDataLab.register( 'SourcesScreenView', SourcesScreenView );
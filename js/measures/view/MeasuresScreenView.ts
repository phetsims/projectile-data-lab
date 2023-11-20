// Copyright 2023, University of Colorado Boulder

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import MeasuresModel from '../model/MeasuresModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SourcesLaunchPanel from '../../sources/view/SourcesLaunchPanel.js';
import FieldPanel from '../../common/view/FieldPanel.js';
import { ManualConstraint } from '../../../../scenery/js/imports.js';
import { VSMScreenView } from '../../common/view/VSMScreenView.js';

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

    const fieldPanel = new FieldPanel( {
      tandem: options.tandem.createTandem( 'fieldPanel' )
    } );
    this.addChild( fieldPanel );

    // Layout
    ManualConstraint.create( this, [ fieldPanel ], fieldPanelProxy => {
      fieldPanelProxy.right = this.layoutBounds.right;
    } );

    // Keyboard order
    this.pdomControlAreaNode.pdomOrder = [ measuresLaunchPanel, fieldPanel, this.resetAllButton ];
  }
}

projectileDataLab.register( 'MeasuresScreenView', MeasuresScreenView );
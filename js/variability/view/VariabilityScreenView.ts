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
import { ManualConstraint } from '../../../../scenery/js/imports.js';
import { VSMScreenView } from '../../common/view/VSMScreenView.js';

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

    const fieldPanel = new FieldPanel( {
      tandem: options.tandem.createTandem( 'fieldPanel' )
    } );
    this.addChild( fieldPanel );

    // Layout
    ManualConstraint.create( this, [ fieldPanel ], fieldPanelProxy => {
      fieldPanelProxy.right = this.layoutBounds.right;
    } );

    this.pdomControlAreaNode.pdomOrder = [ variabilityLaunchPanel, fieldPanel, this.timeControlNode, this.resetAllButton ];
  }
}
projectileDataLab.register( 'VariabilityScreenView', VariabilityScreenView );
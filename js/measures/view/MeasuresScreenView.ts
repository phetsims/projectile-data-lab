// Copyright 2023, University of Colorado Boulder

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import MeasuresModel from '../model/MeasuresModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { PDLScreenView } from '../../common/view/PDLScreenView.js';
import SourcesLaunchPanel from '../../sources/view/SourcesLaunchPanel.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class MeasuresScreenView extends PDLScreenView {

  public constructor( model: MeasuresModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

    const measuresLaunchPanel = new SourcesLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty, {
      tandem: options.tandem.createTandem( 'measuresLaunchPanel' )
    } );
    this.addChild( measuresLaunchPanel );

    this.pdomControlAreaNode.pdomOrder = [ measuresLaunchPanel, this.resetAllButton ];
  }
}

projectileDataLab.register( 'MeasuresScreenView', MeasuresScreenView );
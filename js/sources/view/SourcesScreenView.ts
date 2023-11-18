// Copyright 2023, University of Colorado Boulder

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import SourcesModel from '../model/SourcesModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { PDLScreenView } from '../../common/view/PDLScreenView.js';
import SourcesLaunchPanel from './SourcesLaunchPanel.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SourcesScreenView extends PDLScreenView {

  public constructor( model: SourcesModel, providedOptions: ProjectileDataLabScreenViewOptions ) {
    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

    const sourcesLaunchPanel = new SourcesLaunchPanel( model.launcherConfigurationProperty, model.projectileTypeProperty, {
      tandem: options.tandem.createTandem( 'sourcesLaunchPanel' )
    } );
    this.addChild( sourcesLaunchPanel );

    this.pdomControlAreaNode.pdomOrder = [ sourcesLaunchPanel, this.resetAllButton ];
  }
}

projectileDataLab.register( 'SourcesScreenView', SourcesScreenView );
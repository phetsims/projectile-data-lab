// Copyright 2023-2024, University of Colorado Boulder

/**
 * The Sources Screen for Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import projectileDataLab from '../projectileDataLab.js';
import SourcesModel from './model/SourcesModel.js';
import SourcesScreenView from './view/SourcesScreenView.js';
import ProjectileDataLabStrings from '../ProjectileDataLabStrings.js';
import PDLScreenIconFactory from '../common/view/PDLScreenIconFactory.js';
import PDLKeyboardHelpNode from '../common/view/PDLKeyboardHelpNode.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenOptions = SelfOptions & ScreenOptions;

export default class SourcesScreen extends Screen<SourcesModel, SourcesScreenView> {

  public constructor( providedOptions: ProjectileDataLabScreenOptions ) {

    const options = optionize<ProjectileDataLabScreenOptions, SelfOptions, ScreenOptions>()( {
      name: ProjectileDataLabStrings.screen.sourcesStringProperty,
      homeScreenIcon: PDLScreenIconFactory.createSourcesScreenIcon(),
      createKeyboardHelpNode: () => new PDLKeyboardHelpNode()
    }, providedOptions );

    super(
      () => new SourcesModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new SourcesScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

projectileDataLab.register( 'SourcesScreen', SourcesScreen );
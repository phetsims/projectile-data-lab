// Copyright 2023-2024, University of Colorado Boulder

/**
 * The Variability Screen for Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import projectileDataLab from '../projectileDataLab.js';
import VariabilityModel from './model/VariabilityModel.js';
import VariabilityScreenView from './view/VariabilityScreenView.js';
import ProjectileDataLabStrings from '../ProjectileDataLabStrings.js';
import PDLScreenIconFactory from '../common/view/PDLScreenIconFactory.js';
import PDLKeyboardHelpNode from '../common/view/PDLKeyboardHelpNode.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenOptions = SelfOptions & ScreenOptions;

export default class VariabilityScreen extends Screen<VariabilityModel, VariabilityScreenView> {

  public constructor( providedOptions: ProjectileDataLabScreenOptions ) {

    const options = optionize<ProjectileDataLabScreenOptions, SelfOptions, ScreenOptions>()( {
      name: ProjectileDataLabStrings.screen.variabilityStringProperty,
      homeScreenIcon: PDLScreenIconFactory.createVariabilityScreenIcon(),
      createKeyboardHelpNode: () => new PDLKeyboardHelpNode()
    }, providedOptions );

    super(
      () => new VariabilityModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new VariabilityScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

projectileDataLab.register( 'VariabilityScreen', VariabilityScreen );
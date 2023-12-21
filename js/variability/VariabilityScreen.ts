// Copyright 2023, University of Colorado Boulder

/**
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import projectileDataLab from '../projectileDataLab.js';
import VariabilityModel from './model/VariabilityModel.js';
import VariabilityScreenView from './view/VariabilityScreenView.js';
import ProjectileDataLabStrings from '../ProjectileDataLabStrings.js';
import VariabilityKeyboardHelpNode from './view/VariabilityKeyboardHelpNode.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenOptions = SelfOptions & ScreenOptions;

export default class VariabilityScreen extends Screen<VariabilityModel, VariabilityScreenView> {

  public constructor( providedOptions: ProjectileDataLabScreenOptions ) {

    const options = optionize<ProjectileDataLabScreenOptions, SelfOptions, ScreenOptions>()( {
      name: ProjectileDataLabStrings.screen.variabilityStringProperty,
      createKeyboardHelpNode: () => new VariabilityKeyboardHelpNode()
    }, providedOptions );

    super(
      () => new VariabilityModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new VariabilityScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

projectileDataLab.register( 'VariabilityScreen', VariabilityScreen );
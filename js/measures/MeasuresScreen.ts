// Copyright 2023-2024, University of Colorado Boulder

/**
 * The Measures Screen for Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import projectileDataLab from '../projectileDataLab.js';
import MeasuresModel from './model/MeasuresModel.js';
import MeasuresScreenView from './view/MeasuresScreenView.js';
import ProjectileDataLabStrings from '../ProjectileDataLabStrings.js';
import MeasuresKeyboardHelpNode from './view/MeasuresKeyboardHelpNode.js';
import PDLScreenIconFactory from '../common/view/PDLScreenIconFactory.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenOptions = SelfOptions & ScreenOptions;

export default class MeasuresScreen extends Screen<MeasuresModel, MeasuresScreenView> {

  public constructor( providedOptions: ProjectileDataLabScreenOptions ) {

    const options = optionize<ProjectileDataLabScreenOptions, SelfOptions, ScreenOptions>()( {
      name: ProjectileDataLabStrings.screen.measuresStringProperty,
      homeScreenIcon: PDLScreenIconFactory.createMeasuresScreenIcon(),
      createKeyboardHelpNode: () => new MeasuresKeyboardHelpNode()
    }, providedOptions );

    super(
      () => new MeasuresModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new MeasuresScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

projectileDataLab.register( 'MeasuresScreen', MeasuresScreen );
// Copyright 2023, University of Colorado Boulder

/**
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ProjectileDataLabColors from '../common/ProjectileDataLabColors.js';
import projectileDataLab from '../projectileDataLab.js';
import ProjectileDataLabModel from './model/ProjectileDataLabModel.js';
import ProjectileDataLabScreenView from './view/ProjectileDataLabScreenView.js';
import ProjectileDataLabStrings from '../ProjectileDataLabStrings.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenOptions = SelfOptions & ScreenOptions;

export default class ProjectileDataLabScreen extends Screen<ProjectileDataLabModel, ProjectileDataLabScreenView> {

  public constructor( providedOptions: ProjectileDataLabScreenOptions ) {

    const options = optionize<ProjectileDataLabScreenOptions, SelfOptions, ScreenOptions>()( {
      name: ProjectileDataLabStrings.screen.nameStringProperty,
      backgroundColorProperty: ProjectileDataLabColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new ProjectileDataLabModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new ProjectileDataLabScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

projectileDataLab.register( 'ProjectileDataLabScreen', ProjectileDataLabScreen );
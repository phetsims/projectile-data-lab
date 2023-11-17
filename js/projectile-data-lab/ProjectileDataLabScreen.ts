// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import ProjectileDataLabColors from '../common/ProjectileDataLabColors.js';
import projectileDataLab from '../projectileDataLab.js';
import ProjectileDataLabModel from './model/ProjectileDataLabModel.js';
import ProjectileDataLabScreenView from './view/ProjectileDataLabScreenView.js';
import ProjectileDataLabStrings from '../ProjectileDataLabStrings.js';

type SelfOptions = {
  //TODO add options that are specific to ProjectileDataLabScreen here
};

type ProjectileDataLabScreenOptions = SelfOptions & ScreenOptions;

export default class ProjectileDataLabScreen extends Screen<ProjectileDataLabModel, ProjectileDataLabScreenView> {

  public constructor( providedOptions: ProjectileDataLabScreenOptions ) {

    const options = optionize<ProjectileDataLabScreenOptions, SelfOptions, ScreenOptions>()( {
      name: ProjectileDataLabStrings.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
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
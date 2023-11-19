// Copyright 2023, University of Colorado Boulder

/**
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import projectileDataLab from '../projectileDataLab.js';
import SamplingModel from './model/SamplingModel.js';
import SamplingScreenView from './view/SamplingScreenView.js';
import ProjectileDataLabStrings from '../ProjectileDataLabStrings.js';

type SelfOptions = EmptySelfOptions;

type ProjectileDataLabScreenOptions = SelfOptions & ScreenOptions;

export default class SamplingScreen extends Screen<SamplingModel, SamplingScreenView> {

  public constructor( providedOptions: ProjectileDataLabScreenOptions ) {

    const options = optionize<ProjectileDataLabScreenOptions, SelfOptions, ScreenOptions>()( {
      name: ProjectileDataLabStrings.screen.samplingStringProperty
    }, providedOptions );

    super(
      () => new SamplingModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new SamplingScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

projectileDataLab.register( 'SamplingScreen', SamplingScreen );
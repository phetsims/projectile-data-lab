// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ProjectileDataLabConstants from '../../common/ProjectileDataLabConstants.js';
import projectileDataLab from '../../projectileDataLab.js';
import ProjectileDataLabModel from '../model/ProjectileDataLabModel.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
 //TODO add options that are specific to ProjectileDataLabScreenView here
};

type ProjectileDataLabScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class ProjectileDataLabScreenView extends ScreenView {

  public constructor( model: ProjectileDataLabModel, providedOptions: ProjectileDataLabScreenViewOptions ) {

    const options = optionize<ProjectileDataLabScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( options );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - ProjectileDataLabConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - ProjectileDataLabConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //TODO
  }
}

projectileDataLab.register( 'ProjectileDataLabScreenView', ProjectileDataLabScreenView );
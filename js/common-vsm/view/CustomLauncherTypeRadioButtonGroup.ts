// Copyright 2023, University of Colorado Boulder

/**
 * CustomLauncherTypeRadioButtonGroup is a group of radio buttons for selecting between mystery and custom launchers
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Image } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { LauncherMechanism } from '../model/LauncherMechanism.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import projectileDataLab from '../../projectileDataLab.js';
import spring_png from '../../../images/spring_png.js';
import pressureWithNeedle_png from '../../../images/pressureWithNeedle_png.js';
import explosion_png from '../../../images/explosion_png.js';

type SelfOptions = EmptySelfOptions;
type CustomLauncherTypeRadioButtonGroupOptions = SelfOptions & WithRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class CustomLauncherTypeRadioButtonGroup extends RectangularRadioButtonGroup<LauncherMechanism> {
  public constructor( customLauncherTypeProperty: PhetioProperty<LauncherMechanism>, providedOptions: CustomLauncherTypeRadioButtonGroupOptions ) {

    const items: RectangularRadioButtonGroupItem<LauncherMechanism>[] = [
      {
        value: 'spring' as const,
        tandemName: 'springRadioButton',
        createNode: () => new Image( spring_png, { scale: 0.14 } )
      }, {
        value: 'pressure' as const,
        tandemName: 'pressureRadioButton',
        createNode: () => new Image( pressureWithNeedle_png, { scale: 0.18 } )
      }, {
        value: 'explosion' as const,
        tandemName: 'explosionRadioButton',
        createNode: () => new Image( explosion_png, { scale: -0.18 } )
      } ];

    super( customLauncherTypeProperty, items, {
      tandem: providedOptions.tandem.createTandem( 'customLauncherTypeRadioButtonGroup' ),
      orientation: 'horizontal',
      align: 'center',
      radioButtonOptions: {
        baseColor: 'white'
      }
    } );
  }
}

projectileDataLab.register( 'CustomLauncherTypeRadioButtonGroup', CustomLauncherTypeRadioButtonGroup );

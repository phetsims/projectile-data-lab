// Copyright 2023, University of Colorado Boulder

/**
 * CustomLauncherTypeRadioButtonGroup is a group of radio buttons for selecting between preset and custom launchers
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Text } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { CustomLauncherType } from '../model/CustomLauncherType.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import projectileDataLab from '../../projectileDataLab.js';

type SelfOptions = EmptySelfOptions;
type CustomLauncherTypeRadioButtonGroupOptions = SelfOptions & WithRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class CustomLauncherTypeRadioButtonGroup extends RectangularRadioButtonGroup<CustomLauncherType> {
  public constructor( customLauncherTypeProperty: PhetioProperty<CustomLauncherType>, providedOptions:CustomLauncherTypeRadioButtonGroupOptions ) {

    const items: RectangularRadioButtonGroupItem<CustomLauncherType>[] = [
      {
        value: 'SPRING' as const,
        tandemName: 'springRadioButton',
        createNode: () => new Text( 'Spring' )
      }, {
        value: 'PRESSURE' as const,
        tandemName: 'pressureRadioButton',
        createNode: () => new Text( 'Pressure' )
      }, {
        value: 'EXPLOSION' as const,
        tandemName: 'explosionRadioButton',
        createNode: () => new Text( 'Explosion' )
      } ];

    super( customLauncherTypeProperty, items, {
      tandem: providedOptions.tandem.createTandem( 'customLauncherTypeRadioButtonGroup' ),
      orientation: 'horizontal'
  } );
  }
}

projectileDataLab.register( 'CustomLauncherTypeRadioButtonGroup', CustomLauncherTypeRadioButtonGroup );

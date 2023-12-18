// Copyright 2023, University of Colorado Boulder
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import Panel from '../../../../sun/js/Panel.js';
import PDLText from './PDLText.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

export default class LauncherRadioButtonGroupWrapper extends Node {
  public constructor( mysteryLauncherProperty: PhetioProperty<number>, providedOptions: WithRequired<NodeOptions, 'tandem'> ) {
    // TODO: be explicit in passing the validValues through as a separate option, see https://github.com/phetsims/projectile-data-lab/issues/7
    const mysteryLauncherRadioButtonGroupItems = _.range( 1, 7 ).map( mysteryLauncher => {
      return {
        value: mysteryLauncher,
        tandemName: `mysteryLauncher${mysteryLauncher}RadioButton`,

        // The Panel provides larger bounds around the text, for making the button the size we want.
        createNode: () => new Panel( new PDLText( mysteryLauncher.toString(), {
            fontSize: 14
          } ), {
            fill: null,
            stroke: null,
            xMargin: 10,
            yMargin: 2
          }
        )
      };
    } );

    const mysteryLauncherRadioButtonGroup = new RectangularRadioButtonGroup( mysteryLauncherProperty, mysteryLauncherRadioButtonGroupItems, {
      tandem: providedOptions.tandem.createTandem( 'mysteryLauncherRadioButtonGroup' ),
      orientation: 'horizontal',
      preferredWidth: 130,
      lineSpacing: 3,
      spacing: 3,
      wrap: true,
      radioButtonOptions: {
        baseColor: 'white'
      }
    } );
    super( {
      children: [ mysteryLauncherRadioButtonGroup ]
    } );
  }
}

projectileDataLab.register( 'LauncherRadioButtonGroupWrapper', LauncherRadioButtonGroupWrapper );
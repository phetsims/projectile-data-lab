// Copyright 2023, University of Colorado Boulder
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import Panel from '../../../../sun/js/Panel.js';
import PDLText from './PDLText.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

export default class LauncherRadioButtonGroupWrapper extends Node {
  public constructor( presetLauncherProperty: PhetioProperty<number>, providedOptions: WithRequired<NodeOptions, 'tandem'> ) {
    // TODO: be explicit in passing the validValues through as a separate option, see https://github.com/phetsims/projectile-data-lab/issues/7
    const presetLauncherRadioButtonGroupItems = _.range( 1, 7 ).map( presetLauncher => {
      return {
        value: presetLauncher,
        tandemName: `presetLauncher${presetLauncher}RadioButton`,

        // The Panel provides larger bounds around the text, for making the button the size we want.
        createNode: () => new Panel( new PDLText( presetLauncher.toString(), {
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

    const presetLauncherRadioButtonGroup = new RectangularRadioButtonGroup( presetLauncherProperty, presetLauncherRadioButtonGroupItems, {
      tandem: providedOptions.tandem.createTandem( 'presetLauncherRadioButtonGroup' ),
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
      children: [ presetLauncherRadioButtonGroup ]
    } );
  }
}

projectileDataLab.register( 'LauncherRadioButtonGroupWrapper', LauncherRadioButtonGroupWrapper );
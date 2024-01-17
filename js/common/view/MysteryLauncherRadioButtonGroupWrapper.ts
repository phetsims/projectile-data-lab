// Copyright 2023-2024, University of Colorado Boulder
import { KeyboardListener, Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PDLText from './PDLText.js';
import { Shape } from '../../../../kite/js/imports.js';
import { MysteryLauncherIcon } from './MysteryLauncherIcon.js';

const LAUNCHER_BUTTON_CORNER_RADIUS = 5;

/**
 * MysteryLauncherRadioButtonGroupWrapper is a control that shows the radio buttons that choose between the different
 * mystery launchers. A wrapper is needed to help the layout wrap.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
export default class MysteryLauncherRadioButtonGroupWrapper extends Node {
  public constructor( mysteryLauncherNumberProperty: PhetioProperty<number>, providedOptions: WithRequired<NodeOptions, 'tandem'> ) {

    const mysteryLauncherRadioButtonGroupItems = _.range( 1, 7 ).map( mysteryLauncher => {
      return {
        value: mysteryLauncher,
        tandemName: `mysteryLauncher${mysteryLauncher}RadioButton`,

        // The Panel provides larger bounds around the text, for making the button the size we want.
        createNode: () => {
          const launcherIcon = new MysteryLauncherIcon( mysteryLauncher );
          const launcherIconPaddingX = 7;
          const launcherIconPaddingTopY = 1;

          const launcherIconBoundsWithPadding = launcherIcon.bounds.dilatedX( launcherIconPaddingX ).dilatedY( launcherIconPaddingTopY ).shiftY( -launcherIconPaddingTopY );

          const numberLabel = new PDLText( mysteryLauncher.toString(), { fontSize: 14 } );

          const numberLabelBounds = numberLabel.bounds;

          const numberLabelBackgroundShape = Shape.roundedRectangleWithRadii(
            numberLabelBounds.x,
            numberLabelBounds.y,
            numberLabelBounds.width + 8,
            numberLabelBounds.height + 2,
            {
              topLeft: LAUNCHER_BUTTON_CORNER_RADIUS,
              topRight: 0,
              bottomRight: LAUNCHER_BUTTON_CORNER_RADIUS,
              bottomLeft: 0
            } );

          const numberLabelBackground = new Path( numberLabelBackgroundShape, {
            top: 0,
            left: 0,
            fill: '#FCFCFC',
            stroke: 'black',
            lineWidth: 0.5
          } );

          numberLabel.center = numberLabelBackground.center;

          const numberLabelContainer = new Node( { children: [ numberLabelBackground, numberLabel ], pickable: false } );

          const launcherIconContainer = new Rectangle( launcherIconBoundsWithPadding, {
            children: [ launcherIcon, numberLabelContainer ]
          } );

          numberLabelContainer.top = launcherIconContainer.top;
          numberLabelContainer.left = launcherIconContainer.left;
          launcherIcon.centerX = launcherIconContainer.centerX;

          return launcherIconContainer;
        }
      };
    } );

    const mysteryLauncherRadioButtonGroup = new RectangularRadioButtonGroup( mysteryLauncherNumberProperty, mysteryLauncherRadioButtonGroupItems, {
      tandem: providedOptions.tandem.createTandem( 'mysteryLauncherRadioButtonGroup' ),
      phetioFeatured: true,
      orientation: 'horizontal',
      preferredWidth: 160,
      lineSpacing: 3,
      spacing: 4,
      wrap: true,
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 0,
        yMargin: 0,
        cornerRadius: LAUNCHER_BUTTON_CORNER_RADIUS
      }
    } );

    // a listener that selects a field based on the keystroke, regardless of where focus is in the document
    mysteryLauncherRadioButtonGroup.addInputListener( new KeyboardListener( {
      keys: [ '1', '2', '3', '4', '5', '6', '7', '8' ] as const,
      callback: ( event, keysPressed ) => {
        const key = parseInt( keysPressed, 10 );
        mysteryLauncherNumberProperty.value = key;

        // Move focus to the radio button that was selected. Without this line, focus would incorrectly remain
        // on the previous button.
        mysteryLauncherRadioButtonGroup.getButtonForValue( key ).focus();
      }
    } ) );

    super( {
      children: [ mysteryLauncherRadioButtonGroup ],
      layoutOptions: {
        align: 'center'
      }
    } );
  }
}

projectileDataLab.register( 'MysteryLauncherRadioButtonGroupWrapper', MysteryLauncherRadioButtonGroupWrapper );
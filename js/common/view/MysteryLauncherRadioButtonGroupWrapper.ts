// Copyright 2023-2024, University of Colorado Boulder
import { KeyboardListener, Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PDLText from './PDLText.js';
import { Shape } from '../../../../kite/js/imports.js';
import { MysteryLauncherIcon } from './MysteryLauncherIcon.js';
import Launcher, { MYSTERY_LAUNCHERS } from '../model/Launcher.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import PDLRectangularRadioButtonGroup from './PDLRectangularRadioButtonGroup.js';

const LAUNCHER_BUTTON_CORNER_RADIUS = 2;

/**
 * MysteryLauncherRadioButtonGroupWrapper is a control that shows the radio buttons that choose between the different
 * mystery launchers. A wrapper is needed to help the layout wrap.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
export default class MysteryLauncherRadioButtonGroupWrapper extends Node {
  public constructor( launcherProperty: PhetioProperty<Launcher>, providedOptions: WithRequired<NodeOptions, 'tandem'> ) {

    const mysteryLauncherRadioButtonGroupItems = MYSTERY_LAUNCHERS.map( mysteryLauncher => {
      return {
        value: mysteryLauncher,
        tandemName: `mysteryLauncher${mysteryLauncher.launcherNumber}RadioButton`,

        // The Panel provides larger bounds around the text, for making the button the size we want.
        createNode: () => {
          const launcherIcon = new MysteryLauncherIcon( mysteryLauncher );
          const launcherIconPaddingX = 6;
          const launcherIconPaddingTopY = 1;

          const launcherIconBoundsWithPadding = launcherIcon.bounds.dilatedX( launcherIconPaddingX ).dilatedY( launcherIconPaddingTopY ).shiftY( -launcherIconPaddingTopY );

          const numberLabel = new PDLText( mysteryLauncher.launcherNumber.toString(), { fontSize: 14 } );

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
            lineWidth: 1
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

    const mysteryLauncherRadioButtonGroup = new PDLRectangularRadioButtonGroup( launcherProperty, mysteryLauncherRadioButtonGroupItems, {
      tandem: providedOptions.tandem.createTandem( 'mysteryLauncherRadioButtonGroup' ),
      phetioFeatured: true,
      orientation: 'horizontal',
      preferredWidth: 160,
      lineSpacing: 6,
      wrap: true,
      phetioVisiblePropertyInstrumented: false, // As the only UI control in the panel, the visibility is controlled by the parent panel
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 0,
        yMargin: 0,
        cornerRadius: LAUNCHER_BUTTON_CORNER_RADIUS
      }
    } );

    // a listener that selects a field based on the keystroke, regardless of where focus is in the document
    mysteryLauncherRadioButtonGroup.addInputListener( new KeyboardListener( {
      keys: [ '1', '2', '3', '4', '5', '6' ] as const,
      callback: ( event, keysPressed ) => {
        const key = parseInt( keysPressed, 10 );

        const launcher = MYSTERY_LAUNCHERS.find( launcher => launcher.launcherNumber === key )!;
        launcherProperty.value = launcher;

        // Move focus to the radio button that was selected. Without this line, focus would incorrectly remain
        // on the previous button.
        mysteryLauncherRadioButtonGroup.getButtonForValue( launcher ).focus();
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
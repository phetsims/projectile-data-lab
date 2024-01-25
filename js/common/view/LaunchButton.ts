// Copyright 2024, University of Colorado Boulder

import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import projectileDataLab from '../../projectileDataLab.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import { Image, KeyboardListener, Node, Rectangle } from '../../../../scenery/js/imports.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PDLColors from '../PDLColors.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import launchButtonSingle_png from '../../../images/launchButtonSingle_png.js';
import launchButtonContinuous_png from '../../../images/launchButtonContinuous_png.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { SingleOrContinuous } from '../model/SingleOrContinuous.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

/**
 * Launch button for the projectile data lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type LaunchButtonOptions = SelfOptions & RectangularPushButtonOptions;

export default class LaunchButton extends RectangularPushButton {
  public constructor(
    isContinuousLaunchingProperty: TReadOnlyProperty<boolean>,
    launchModeProperty: TReadOnlyProperty<SingleOrContinuous>,
    launchButtonPressed: () => void,
    providedOptions: LaunchButtonOptions ) {

    const launchIconToggleNode = new ToggleNode<'single' | 'continuous', Image>( launchModeProperty, [ {
      value: 'single',
      createNode: () => new Image( launchButtonSingle_png )
    }, {
      value: 'continuous',
      createNode: () => new Image( launchButtonContinuous_png )
    } ], {} );

    const launchButtonToggleNode = new ToggleNode<boolean, Node>( new DerivedProperty( [
      isContinuousLaunchingProperty,
      launchModeProperty
    ], ( isContinuousLaunching, launchMode ) => isContinuousLaunching && launchMode === 'continuous' ), [ {
      value: false,
      createNode: () => launchIconToggleNode
    }, {
      value: true,
      createNode: () => new Rectangle( 0, 0, 50, 50, {
        fill: 'black',
        stroke: 'white',
        lineWidth: 2,
        cornerRadius: 5,
        opacity: 0.75 // Adjusts the color of the icon to look more like part of the button
      } )
    } ], {} );

    const options = optionize<LaunchButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {
      content: launchButtonToggleNode,
      baseColor: PDLColors.launchButtonColorProperty,
      disabledColor: PDLColors.launchButtonDisabledColorProperty,
      size: new Dimension2( 85, 45 ),
      yMargin: 5,
      phetioFeatured: true,
      listener: launchButtonPressed
    }, providedOptions );

    super( options );

    // a listener that presses the button based on the keystroke, regardless of where focus is in the document
    this.addInputListener( new KeyboardListener( {
      keys: [ 'alt+l' ] as const,
      global: true,
      callback: launchButtonPressed
    } ) );
  }
}

projectileDataLab.register( 'LaunchButton', LaunchButton );
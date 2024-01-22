// Copyright 2024, University of Colorado Boulder

import { Node } from '../../../../scenery/js/imports.js';
import LauncherNode from './LauncherNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Property from '../../../../axon/js/Property.js';
import Launcher from '../model/Launcher.js';

const LAUNCHER_ICON_WIDTH = 35;

/**
 * MysteryLauncherIcon shows the icon for a mystery launcher.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
export class MysteryLauncherIcon extends Node {
  public constructor( mysteryLauncher: Launcher ) {

    const mysteryLauncherIcon = new LauncherNode( ModelViewTransform2.createIdentity(), new Property( 45 ), new Property( 0 ),
      new Property( mysteryLauncher ), null, { isIcon: true } ).rasterized( {
      resolution: 1.25
    } );
    super( {
      children: [ mysteryLauncherIcon ],
      pickable: false,
      maxWidth: LAUNCHER_ICON_WIDTH,
      top: 0,
      left: 0
    } );
  }
}
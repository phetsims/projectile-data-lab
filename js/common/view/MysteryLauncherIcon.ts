// Copyright 2023-2024, University of Colorado Boulder

import { Node } from '../../../../scenery/js/imports.js';
import LauncherNode from './LauncherNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Property from '../../../../axon/js/Property.js';

const LAUNCHER_ICON_WIDTH = 35;

export class MysteryLauncherIcon extends Node {
  public constructor( mysteryLauncherNumber: number ) {

    const mysteryLauncherIcon = new LauncherNode( ModelViewTransform2.createIdentity(), new Property( 45 ), new Property( 0 ),
      new Property( mysteryLauncherNumber ), { isIcon: true } ).rasterized( {
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
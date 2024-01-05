// Copyright 2024, University of Colorado Boulder

/**
 * PDLScreenIconFactory is a collection of factory methods for creating dynamic ScreenIcons.
 * See https://github.com/phetsims/projectile-data-lab/issues/40 for design history.
 *
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PDLColors from '../PDLColors.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import { Image, Node, Path } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import cannonball_png from '../../../images/cannonball_png.js';
import spring_png from '../../../images/spring_png.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';

const PDLScreenIconFactory = {

  /**
   * Creates the ScreenIcon for the 'Variability' screen.
   */
  createVariabilityScreenIcon(): ScreenIcon {

    const projectileNodes: Node[] = [];

    const projectileInfo = [
      { x: -20, y: -100, lineDx: -230, lineDy: 180, bezierX: -120, bezierY: 60 }, // top left
      { x: 250, y: -60, lineDx: -500, lineDy: 240, bezierX: -240, bezierY: 50 }, // top right
      { x: 100, y: 110, lineDx: -210, lineDy: 80, bezierX: -100, bezierY: 20 } // bottom middle
    ];

    // For each projectile info, create a projectile node with path, and add it to the icon node.
    projectileInfo.forEach( info => {
      const projectileNode = new Node( {
        children: [
          new Path(
            new Shape().moveTo( info.x, info.y ).quadraticCurveToPointRelative( new Vector2( info.bezierX, info.bezierY ), new Vector2( info.lineDx, info.lineDy ) ),
            {
            stroke: PDLColors.pathStrokeAirborneColorProperty,
            lineWidth: 6
          } ),
          new Image( cannonball_png, { centerX: info.x, centerY: info.y } )
        ]
      } );
      projectileNodes.push( projectileNode );
    } );

    const iconNode = new Node( {
      children: [ ...projectileNodes ]
    } );

    return new ScreenIcon( iconNode, {
      fill: PDLColors.screenIconBackgroundColorProperty
    } );
  },

  /**
   * Creates the ScreenIcon for the 'Sources' screen.
   */
  createSourcesScreenIcon(): ScreenIcon {

    const springNode = new Image( spring_png );

    return new ScreenIcon( springNode, {
      fill: PDLColors.screenIconBackgroundColorProperty
    } );
  }
};

projectileDataLab.register( 'PDLScreenIconFactory', PDLScreenIconFactory );
export default PDLScreenIconFactory;
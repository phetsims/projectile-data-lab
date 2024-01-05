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
import { Circle, Image, Node, Path, Rectangle } from '../../../../scenery/js/imports.js';
import projectileDataLab from '../../projectileDataLab.js';
import cannonball_png from '../../../images/cannonball_png.js';
import spring_png from '../../../images/spring_png.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MeanIndicatorNode from './MeanIndicatorNode.js';

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
  },

  /**
   * Creates the ScreenIcon for the 'Measures' screen.
   */
  createMeasuresScreenIcon(): ScreenIcon {

    // The heights of the columns of data blocks in the histogram.
    const columnHeights = [ 2, 1, 1, 4, 2, 6, 4, 8, 7, 1, 4, 2, 0, 1 ];

    // The index of the column whose top data block should be highlighted.
    const highlightTopBlockOfColumnIndex = 8;

    // The size of each data block in the histogram.
    const dataBlockSize = 10;

    const dataBlockNodes: Node[] = [];

    // For each column, create a column of data blocks.
    for ( let i = 0; i < columnHeights.length; i++ ) {

      const columnHeight = columnHeights[ i ];
      const columnNode = new Node( {
        children: []
      } );

      // For each data block in the column, create a data block node and add it to the column node.
      for ( let j = 0; j < columnHeight; j++ ) {
        const dataBlockNode = new Rectangle( 0, 0, dataBlockSize, dataBlockSize, {
          centerX: i * dataBlockSize,
          centerY: -j * dataBlockSize,
          fill: PDLColors.histogramDataFillColorProperty,
          stroke: PDLColors.histogramDataStrokeColorProperty,
          lineWidth: 1.5
        } );

        columnNode.addChild( dataBlockNode );

        // If this is the top data block of the highlighted column, add a highlight circle to the data block.
        if ( i === highlightTopBlockOfColumnIndex && j === columnHeight - 1 ) {

          const dataHighlight = new Circle( 3, {
            centerX: i * dataBlockSize,
            centerY: -j * dataBlockSize,
            fill: 'white'
          } );

          columnNode.addChild( dataHighlight );
        }
      }

      dataBlockNodes.push( columnNode );
    }

    const iconNode = new Node( { children: dataBlockNodes } );

    return new ScreenIcon( iconNode, {
      fill: PDLColors.screenIconBackgroundColorProperty
    } );
  },

  /**
   * Creates the ScreenIcon for the 'Sampling' screen.
   */
  createSamplingScreenIcon(): ScreenIcon {

    // The x values of the projectiles in the icon, with the leftmost projectile at x = 0.
    const projectileXValues = [ 0, 140, 280, 420 ];

    const projectileImages: Image[] = [];

    projectileXValues.forEach( x => {
      const projectileImage = new Image( cannonball_png, { centerX: x, centerY: 0 } );
      projectileImages.push( projectileImage );
    } );

    // Take the average of the x values to get the center x value of the icon node.
    const averageX = _.mean( projectileXValues );

    const meanIndicatorNode = new MeanIndicatorNode( 60, {
      centerX: averageX,
      bottom: 0,
      lineWidth: 4
    } );

    const iconNode = new Node( { children: [ ...projectileImages, meanIndicatorNode ] } );

    return new ScreenIcon( iconNode, {
      fill: PDLColors.screenIconBackgroundColorProperty
    } );
  }
};

projectileDataLab.register( 'PDLScreenIconFactory', PDLScreenIconFactory );
export default PDLScreenIconFactory;
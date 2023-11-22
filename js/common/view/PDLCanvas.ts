// Copyright 2023, University of Colorado Boulder

/**
 * Render the paths and projectiles for the Projectile Data Lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import { CanvasNode, CanvasNodeOptions } from '../../../../scenery/js/imports.js';
import Field from '../model/Field.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PDLColors from '../PDLColors.js';
import Projectile from '../model/Projectile.js';

type SelfOptions = EmptySelfOptions;
type PDLCanvasOptions = SelfOptions & CanvasNodeOptions;

export default class PDLCanvas extends CanvasNode {
  public constructor(
    private readonly fieldProperty: Property<Field>,
    private readonly isPathsVisibleProperty: Property<boolean>,
    private readonly modelViewTransform: ModelViewTransform2,
    providedOptions: PDLCanvasOptions ) {

    const options = optionize<PDLCanvasOptions, SelfOptions, CanvasNodeOptions>()( {
      layerSplit: true // ensure we're on our own layer
    }, providedOptions );

    super( options );

    this.fieldProperty = fieldProperty;

    const myBoundListener = () => this.invalidatePaint();
    this.fieldProperty.link( ( newField, oldField ) => {
      if ( oldField ) {
        oldField.projectilesChangedEmitter.removeListener( myBoundListener );
      }
      newField.projectilesChangedEmitter.addListener( myBoundListener );
      this.invalidatePaint();
    } );

    // When the path color changes, repaint
    PDLColors.pathStrokeColorProperty.link( myBoundListener );
    isPathsVisibleProperty.link( myBoundListener );

    this.modelViewTransform = modelViewTransform;
  }

  /**
   * Draws into the canvas.
   */
  public override paintCanvas( context: CanvasRenderingContext2D ): void {

    const projectiles = this.fieldProperty.value.projectiles;

    const strokeStyle = PDLColors.pathStrokeColorProperty.value.toCSS();

    // Render the paths. Draw a purple line from the projectile t=0 to the current position.
    // REVIEW: If performance is a problem, use a persistent canvas and just add on to it (for the paths layer)
    if ( this.isPathsVisibleProperty.value ) {
      for ( let i = 0; i < projectiles.length; i++ ) {
        const projectile = projectiles[ i ];

        context.beginPath();
        let pathStarted = false;

        const drawLineToProjectileAtTime = ( t: number ): void => {
          const pathX = Projectile.getProjectileX( projectile.launchSpeed!, projectile.launchAngle!, t );
          const pathY = Projectile.getProjectileY( projectile.launchSpeed!, projectile.launchAngle!, projectile.launchHeight!, t );
          const viewPoint = this.modelViewTransform.modelToViewXY( pathX, pathY );

          if ( !pathStarted ) {
            context.moveTo( viewPoint.x, viewPoint.y );
            pathStarted = true;
          }

          context.lineTo( viewPoint.x, viewPoint.y );
        };

        for ( let t = 0; t < projectile.timeAirborne; t += 0.01 ) {
          drawLineToProjectileAtTime( t );
        }

        drawLineToProjectileAtTime( projectile.timeAirborne );

        context.strokeStyle = strokeStyle;
        context.lineWidth = 2;
        context.stroke();
      }
    }

    // Render the projectiles
    for ( let i = 0; i < projectiles.length; i++ ) {
      const projectile = projectiles[ i ];
      context.beginPath();
      const viewPoint = this.modelViewTransform.modelToViewXY( projectile.x, projectile.y );

      // Draw a black circle
      context.beginPath();
      context.arc( viewPoint.x, viewPoint.y, 5, 0, 2 * Math.PI );
      context.fillStyle = 'black';
      context.fill();

      // Draw a highlight glint on the circle
      context.beginPath();
      context.arc( viewPoint.x + 1.5, viewPoint.y - 1.5, 2, 0, 2 * Math.PI );
      context.fillStyle = 'white';
      context.fill();
    }
  }
}

projectileDataLab.register( 'PDLCanvas', PDLCanvas );
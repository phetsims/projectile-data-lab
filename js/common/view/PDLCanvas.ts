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
import PDLUtils from '../PDLUtils.js';

type SelfOptions = EmptySelfOptions;
type PDLCanvasOptions = SelfOptions & CanvasNodeOptions;

export default class PDLCanvas extends CanvasNode {
  private readonly fieldProperty: Property<Field>;
  private readonly modelViewTransform: ModelViewTransform2;

  public constructor( fieldProperty: Property<Field>, modelViewTransform: ModelViewTransform2, providedOptions: PDLCanvasOptions ) {

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

    this.modelViewTransform = modelViewTransform;
  }

  /**
   * Draws into the canvas.
   */
  public override paintCanvas( context: CanvasRenderingContext2D ): void {

    const projectiles = this.fieldProperty.value.projectiles;

    // Render the paths. Draw a purple line from the projectile t=0 to the current position.
    // REVIEW: If performance is a problem, use a persistent canvas and just add on to it (for the paths layer)
    for ( let i = 0; i < projectiles.length; i++ ) {
      const projectile = projectiles[ i ];
      context.beginPath();
      let pathStarted = false;

      // TODO: Fine tune the time step.  Too large and it will look angular, too small and it will run slowly. See https://github.com/phetsims/projectile-data-lab/issues/7
      for ( let t = 0; t < projectile.timeAirborne; t += 0.001 ) {
        const pathX = PDLUtils.getProjectileX( projectile.launchSpeed!, projectile.launchAngle!, t );
        const pathY = PDLUtils.getProjectileY( projectile.launchSpeed!, projectile.launchAngle!, projectile.launchHeight!, t );
        const viewPoint = this.modelViewTransform.modelToViewXY( pathX, pathY );

        if ( !pathStarted ) {
          context.moveTo( viewPoint.x, viewPoint.y );
          pathStarted = true;
        }

        context.lineTo( viewPoint.x, viewPoint.y );
      }

      context.strokeStyle = 'rgb(112,26,195)';
      context.lineWidth = 2;
      context.stroke();
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
      context.arc( viewPoint.x - 2, viewPoint.y - 2, 2, 0, 2 * Math.PI );
      context.fillStyle = 'white';
      context.fill();
    }
  }
}

projectileDataLab.register( 'PDLCanvas', PDLCanvas );
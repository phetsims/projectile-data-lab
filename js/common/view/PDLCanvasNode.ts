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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import cannonball_png from '../../../images/cannonball_png.js';
import pumpkin_png from '../../../images/pumpkin_png.js';
import piano_png from '../../../images/piano_png.js';
import pumpkinLanded1_png from '../../../images/pumpkinLanded1_png.js';
import pumpkinLanded2_png from '../../../images/pumpkinLanded2_png.js';
import pumpkinLanded3_png from '../../../images/pumpkinLanded3_png.js';
import pianoLanded_png from '../../../images/pianoLanded_png.js';

type SelfOptions = EmptySelfOptions;
type PDLCanvasOptions = SelfOptions & CanvasNodeOptions;

const PUMPKIN_LANDED_IMAGES = [ pumpkinLanded1_png, pumpkinLanded2_png, pumpkinLanded3_png ];

export default class PDLCanvasNode<T extends Field> extends CanvasNode {
  public constructor(
    private readonly fieldProperty: Property<T>,
    private readonly isPathsVisibleProperty: Property<boolean>,
    private readonly modelViewTransform: ModelViewTransform2,
    private readonly selectedSampleProperty: TReadOnlyProperty<number>,
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
    selectedSampleProperty.link( myBoundListener );

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

        if ( projectile.sampleNumber === this.selectedSampleProperty.value ) {

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

          for ( let t = 0; t < projectile.timeAirborne; t += 0.02 ) {
            drawLineToProjectileAtTime( t );
          }

          drawLineToProjectileAtTime( projectile.timeAirborne );

          context.strokeStyle = strokeStyle;
          context.lineWidth = 2;
          context.stroke();
        }
      }
    }

    // Render the projectiles
    for ( let i = 0; i < projectiles.length; i++ ) {
      const projectile = projectiles[ i ];

      if ( projectile.sampleNumber === this.selectedSampleProperty.value ) {

        this.drawProjectile( context, projectile );
      }
    }
  }

  private drawProjectile( context: CanvasRenderingContext2D, projectile: Projectile ): void {

    const viewPoint = this.modelViewTransform.modelToViewXY( projectile.x, projectile.y );

    const isLanded = projectile.phase === 'LANDED';

    let image: HTMLImageElement;

    switch( projectile.type ) {
      case 'PUMPKIN':
        image = isLanded ? PUMPKIN_LANDED_IMAGES[ projectile.landedImageIndex ] : pumpkin_png;
        break;
      case 'TOY_PIANO':
        image = isLanded ? pianoLanded_png : piano_png;
        break;
      default:
        image = cannonball_png;
        break;
    }

    // Save the current state of the canvas
    context.save();

    // Move to the center of where we want to draw our image
    context.translate( viewPoint.x, viewPoint.y );

    // Scale context horizontally by -1; this flips the context horizontally
    context.scale( projectile.scaleX, 1 );

    // Draw the image on the flipped context
    // Since the context is flipped, adjust the position by negating half of the width
    context.drawImage( image, -image.width / 2, -image.height / 2 );

    // Restore the context to its original state
    context.restore();

  }
}

projectileDataLab.register( 'PDLCanvasNode', PDLCanvasNode );
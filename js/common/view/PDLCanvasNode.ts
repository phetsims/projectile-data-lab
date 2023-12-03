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
import cannonballDark_png from '../../../images/cannonballDark_png.js';
import pumpkinLanded1Dark_png from '../../../images/pumpkinLanded1Dark_png.js';
import pumpkinLanded2Dark_png from '../../../images/pumpkinLanded2Dark_png.js';
import pumpkinLanded3Dark_png from '../../../images/pumpkinLanded3Dark_png.js';
import pianoLandedDark_png from '../../../images/pianoLandedDark_png.js';
import PDLConstants from '../PDLConstants.js';

type SelfOptions = EmptySelfOptions;
type PDLCanvasOptions = SelfOptions & CanvasNodeOptions;

const PUMPKIN_LANDED_IMAGES = [ pumpkinLanded1_png, pumpkinLanded2_png, pumpkinLanded3_png ];
const PUMPKIN_LANDED_DARK_IMAGES = [ pumpkinLanded1Dark_png, pumpkinLanded2Dark_png, pumpkinLanded3Dark_png ];

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
    // REVIEW: If performance is a problem, use a persistent canvas and just add on to it (for the paths layer)

    // Order of drawing:
    // 1: Trajectories that are not for the most recent landed projectile (if paths are visible)
    // 2: Landed projectiles that are not the most recent
    // 3: Trajectory for most recent landed projectile (if paths are visible)
    // 4: Flying projectiles
    // 5: Most recent landed projectile

    const drawPathForProjectile = ( projectile: Projectile ) => {
      context.beginPath();
      let pathStarted = false;

      const drawLineToProjectileAtTime = ( t: number ): void => {
        const pathX = Projectile.getProjectileX( projectile.launchSpeed, projectile.launchAngle, t );
        const pathY = Projectile.getProjectileY( projectile.launchSpeed, projectile.launchAngle, projectile.launchHeight, t );
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
      context.stroke();
    };

    const projectiles = this.fieldProperty.value.getProjectilesInCurrentSample();
    const mostRecentLandedProjectile: Projectile | null = projectiles.find( projectile => projectile.isMostRecentLanded ) || null;

    // Render the paths for the projectiles that are not the most recent landed projectile
    if ( this.isPathsVisibleProperty.value ) {
      context.lineWidth = 2;
      context.strokeStyle = PDLColors.pathStrokeColorProperty.value.toCSS();

      for ( let i = 0; i < projectiles.length; i++ ) {
        const projectile = projectiles[ i ];
        if ( !projectile.isMostRecentLanded ) {
          drawPathForProjectile( projectile );
        }
      }
    }

    // Draw the projectiles that have landed, but are not the most recent
    for ( let i = 0; i < projectiles.length; i++ ) {
      const projectile = projectiles[ i ];
      if ( projectile.phase === 'LANDED' && !projectile.isMostRecentLanded ) {
        this.drawProjectile( context, projectile );
      }
    }

    // Draw the path for the most recent landed projectile
    if ( this.isPathsVisibleProperty.value && mostRecentLandedProjectile ) {
      context.strokeStyle = PDLColors.pathStrokeMostRecentProjectileColorProperty.value.toCSS();
      drawPathForProjectile( mostRecentLandedProjectile );
    }

    // Draw the flying projectiles
    for ( let i = 0; i < projectiles.length; i++ ) {
      const projectile = projectiles[ i ];
      if ( projectile.phase === 'AIRBORNE' || projectile.phase === 'AIRBORNE_BELOW_FIELD' ) {
        this.drawProjectile( context, projectile );
      }
    }

    // Draw the most recent landed projectile
    if ( mostRecentLandedProjectile ) {
      this.drawProjectile( context, mostRecentLandedProjectile );
    }
  }

  private drawProjectile( context: CanvasRenderingContext2D, projectile: Projectile ): void {

    const viewPoint = this.modelViewTransform.modelToViewXY( projectile.x, projectile.y );

    const isLanded = projectile.phase === 'LANDED';

    // Use dark image for landed projectiles, except for the most recent one
    const isMostRecentLanded = projectile.isMostRecentLanded;

    let image: HTMLImageElement;

    switch( projectile.type ) {
      case 'PUMPKIN':
        if ( isLanded ) {
          image = isMostRecentLanded ? PUMPKIN_LANDED_IMAGES[ projectile.landedImageIndex ] : PUMPKIN_LANDED_DARK_IMAGES[ projectile.landedImageIndex ];
        }
        else {
          image = pumpkin_png;
        }
        break;
      case 'PIANO':
        image = isLanded ? ( isMostRecentLanded ? pianoLanded_png : pianoLandedDark_png ) : piano_png;
        break;
      default:
        image = isLanded && !isMostRecentLanded ? cannonballDark_png : cannonball_png;
        break;
    }

    // Save the current state of the canvas
    context.save();

    // Move to the center of where we want to draw our image
    context.translate( viewPoint.x, viewPoint.y );

    const imageScaleX = projectile.isFlippedHorizontally ? -1 : 1;
    context.scale( imageScaleX * PDLConstants.PROJECTILE_IMAGE_SCALE_FACTOR, PDLConstants.PROJECTILE_IMAGE_SCALE_FACTOR );

    // Draw the image on the flipped context
    // Since the context is flipped, adjust the position by negating half of the width
    context.drawImage( image, -image.width / 2, -image.height / 2 );

    // Restore the context to its original state
    context.restore();
  }
}

projectileDataLab.register( 'PDLCanvasNode', PDLCanvasNode );
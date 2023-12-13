// Copyright 2023, University of Colorado Boulder

import Property from '../../../../axon/js/Property.js';
import VSMField from '../model/VSMField.js';
import PDLCanvasNode, { PDLCanvasNodeOptions } from '../../common/view/PDLCanvasNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLColors from '../../common/PDLColors.js';
import Projectile from '../../common/model/Projectile.js';

/**
 * Render the paths and projectiles for the Variability, Sources and Measures screens of Projectile Data Lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VSMCanvasNodeOptions = SelfOptions & PDLCanvasNodeOptions;

export default class VSMCanvasNode<T extends VSMField> extends PDLCanvasNode<T> {
  public constructor( fieldProperty: Property<T>, isPathsVisibleProperty: Property<boolean>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: VSMCanvasNodeOptions ) {

    const options = optionize<VSMCanvasNodeOptions, SelfOptions, PDLCanvasNodeOptions>()( {}, providedOptions );

    super( fieldProperty, isPathsVisibleProperty, modelViewTransform, null, options );
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    // REVIEW: If performance is a problem, use a persistent canvas and just add on to it (for the paths layer)

    // Order of drawing:
    // 1. Force field graphics for landed outliers
    // 2: Trajectories that are not for the most recent landed projectile (if paths are visible)
    // 3: Landed projectiles that are not the most recent
    // 4: Trajectory for most recent landed projectile (if paths are visible)
    // 5: Flying projectiles
    // 6: Most recent landed projectile

    const landedProjectiles = this.fieldProperty.value.landedProjectiles;
    const airborneProjectiles = this.fieldProperty.value.airborneProjectiles;
    const highlightedProjectile: Projectile | null = this.fieldProperty.value.selectedProjectileProperty.value;

    // 1. Force field graphics for landed outliers are drawn in PDLCanvasNode
    super.drawOutlierGraphicsForLandedProjectiles( landedProjectiles, context );

    // 2. Landed trajectories that are not for the most recent landed projectile (if paths are visible)
    if ( this.isPathsVisibleProperty.value ) {
      context.lineWidth = 1.5;
      context.strokeStyle = PDLColors.pathStrokeLandedInitialColorProperty.value.toCSS();

      const numLandedProjectiles = landedProjectiles.length;
      landedProjectiles.forEach( ( projectile, index ) => {
        if ( projectile !== highlightedProjectile ) {

          const NUM_LANDED_PATHS_TO_SHOW = 20;
          const ratio = Math.min( 1, ( numLandedProjectiles - index ) / ( NUM_LANDED_PATHS_TO_SHOW + 1 ) );
          const color = PDLColors.pathStrokeLandedInitialColorProperty.value.blend( PDLColors.pathStrokeLandedFinalColorProperty.value, ratio );
          context.strokeStyle = color.toCSS();

          this.drawPathForProjectile( context, projectile );
        }
      } );

      context.strokeStyle = PDLColors.pathStrokeAirborneColorProperty.value.toCSS();

      airborneProjectiles.forEach( projectile => {
        this.drawPathForProjectile( context, projectile );
      } );
    }

    // 3: Landed projectiles that are not the most recent
    landedProjectiles.forEach( projectile => {
      if ( projectile !== highlightedProjectile ) {
        this.drawProjectile( context, projectile, true, true );
      }
    } );

    // 4: Trajectory for most recent landed projectile (if paths are visible)
    if ( this.isPathsVisibleProperty.value && highlightedProjectile ) {
      context.strokeStyle = PDLColors.pathStrokeHighlightedColorProperty.value.toCSS();
      this.drawPathForProjectile( context, highlightedProjectile );
    }

    // 5: Flying projectiles
    for ( let i = 0; i < airborneProjectiles.length; i++ ) {
      this.drawProjectile( context, airborneProjectiles[ i ], false, false );
    }

    // 6: Most recent landed projectile
    if ( highlightedProjectile ) {
      this.drawProjectile( context, highlightedProjectile, true, false );
    }
  }
}

projectileDataLab.register( 'VSMCanvasNode', VSMCanvasNode );
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
    // 2: Trajectories for landed projectile that are not the most recent (if paths are visible)
    // 3: Landed projectiles that are not the most recent
    // 4: Trajectory for most recent landed projectile (if paths are visible)
    // 5: Trajectories for flying projectiles (if paths are visible)
    // 6: Flying projectiles
    // 7: Most recent landed projectile

    const landedProjectiles = this.fieldProperty.value.landedProjectiles;
    const airborneProjectiles = this.fieldProperty.value.airborneProjectiles;
    const highlightedProjectile: Projectile | null = this.fieldProperty.value.selectedProjectileProperty.value;

    // 1. Force field graphics for landed outliers are drawn in PDLCanvasNode
    super.drawOutlierGraphicsForLandedProjectiles( landedProjectiles, context );

    // 2: Trajectories for landed projectile that are not the most recent (if paths are visible)
    if ( this.isPathsVisibleProperty.value ) {
      context.lineWidth = 1;
      context.strokeStyle = PDLColors.pathStrokeLandedColorProperty.value.toCSS();

      landedProjectiles.forEach( projectile => {
        if ( projectile !== highlightedProjectile ) {
          this.drawPathForProjectile( context, projectile );
        }
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

    // 5: Trajectories for flying projectiles (if paths are visible)
    if ( this.isPathsVisibleProperty.value ) {
      context.strokeStyle = PDLColors.pathStrokeAirborneColorProperty.value.toCSS();
      airborneProjectiles.forEach( projectile => {
        this.drawPathForProjectile( context, projectile );
      } );
    }

    // 6: Flying projectiles
    for ( let i = 0; i < airborneProjectiles.length; i++ ) {
      this.drawProjectile( context, airborneProjectiles[ i ], false, false );
    }

    // 7: Most recent landed projectile
    if ( highlightedProjectile ) {
      this.drawProjectile( context, highlightedProjectile, true, false );
    }
  }
}

projectileDataLab.register( 'VSMCanvasNode', VSMCanvasNode );
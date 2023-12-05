// Copyright 2023, University of Colorado Boulder

import Property from '../../../../axon/js/Property.js';
import VSMField from '../model/VSMField.js';
import PDLCanvasNode, { PDLCanvasNodeOptions } from '../../common/view/PDLCanvasNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLColors from '../../common/PDLColors.js';
import Projectile from '../../common/model/Projectile.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

/**
 * Render the paths and projectiles for the Variability, Sources and Measures screens of Projectile Data Lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type VSMCanvasNodeOptions = SelfOptions & PDLCanvasNodeOptions;

export default class VSMCanvasNode extends PDLCanvasNode<VSMField> {
  public constructor( fieldProperty: Property<VSMField>, isPathsVisibleProperty: Property<boolean>,
                      modelViewTransform: ModelViewTransform2, selectedSampleProperty: TReadOnlyProperty<number>,
                      providedOptions: VSMCanvasNodeOptions ) {

    const options = optionize<VSMCanvasNodeOptions, SelfOptions, PDLCanvasNodeOptions>()( {}, providedOptions );

    super( fieldProperty, isPathsVisibleProperty, modelViewTransform, selectedSampleProperty, options );
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    // REVIEW: If performance is a problem, use a persistent canvas and just add on to it (for the paths layer)

    // Order of drawing:
    // 1: Trajectories that are not for the most recent landed projectile (if paths are visible)
    // 2: Landed projectiles that are not the most recent
    // 3: Trajectory for most recent landed projectile (if paths are visible)
    // 4: Flying projectiles
    // 5: Most recent landed projectile

    const projectiles = this.fieldProperty.value.projectiles;
    const highlightedProjectile: Projectile | null = this.fieldProperty.value.highlightedProjectileProperty.value;

    // Render the paths for the projectiles that are not the most recent landed projectile
    if ( this.isPathsVisibleProperty.value ) {
      context.lineWidth = 2;
      context.strokeStyle = PDLColors.pathStrokeColorProperty.value.toCSS();

      projectiles.forEach( projectile => {
        if ( projectile !== highlightedProjectile ) {
          this.drawPathForProjectile( context, projectile );
        }
      } );
    }

    // Draw the projectiles that have landed, but are not the most recent
    projectiles.forEach( projectile => {
      if ( projectile.phase === 'LANDED' && projectile !== highlightedProjectile ) {
        this.drawProjectile( context, projectile, true );
      }
    } );

    // Draw the path for the most recent landed projectile
    if ( this.isPathsVisibleProperty.value && highlightedProjectile ) {
      context.strokeStyle = PDLColors.pathStrokeMostRecentProjectileColorProperty.value.toCSS();
      this.drawPathForProjectile( context, highlightedProjectile );
    }

    // Draw the flying projectiles
    for ( let i = 0; i < projectiles.length; i++ ) {
      const projectile = projectiles[ i ];
      if ( projectile.phase === 'AIRBORNE' || projectile.phase === 'AIRBORNE_BELOW_FIELD' ) {
        this.drawProjectile( context, projectile, false );
      }
    }

    // Draw the most recent landed projectile
    if ( highlightedProjectile ) {
      this.drawProjectile( context, highlightedProjectile, false );
    }
  }
}

projectileDataLab.register( 'VSMCanvasNode', VSMCanvasNode );
// Copyright 2023, University of Colorado Boulder

import Property from '../../../../axon/js/Property.js';
import PDLCanvasNode, { PDLCanvasNodeOptions } from '../../common/view/PDLCanvasNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLColors from '../../common/PDLColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import SamplingField from '../model/SamplingField.js';

/**
 * Render the paths and projectiles for the Variability, Sources and Measures screens of Projectile Data Lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SamplingCanvasNodeOptions = SelfOptions & PDLCanvasNodeOptions;

export default class SamplingCanvasNode extends PDLCanvasNode<SamplingField> {
  public constructor( fieldProperty: Property<SamplingField>, isPathsVisibleProperty: Property<boolean>,
                      modelViewTransform: ModelViewTransform2, selectedSampleProperty: TReadOnlyProperty<number>,
                      providedOptions: SamplingCanvasNodeOptions ) {

    const options = optionize<SamplingCanvasNodeOptions, SelfOptions, PDLCanvasNodeOptions>()( {}, providedOptions );

    super( fieldProperty, isPathsVisibleProperty, modelViewTransform, selectedSampleProperty, options );
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    // Order of drawing:
    // 1: Trajectories
    // 2: Projectiles

    const projectiles = this.fieldProperty.value.getProjectilesInCurrentSample();

    // Draw the paths
    context.lineWidth = 2;
    context.strokeStyle = PDLColors.pathStrokeColorProperty.value.toCSS();

    for ( let i = 0; i < projectiles.length; i++ ) {
      const projectile = projectiles[ i ];
      this.drawPathForProjectile( context, projectile );
    }

    // Draw the  projectiles
    for ( let i = 0; i < projectiles.length; i++ ) {
      const projectile = projectiles[ i ];
      if ( projectile.phase !== 'LANDED_BELOW_FIELD' ) {
        this.drawProjectile( context, projectile, false );
      }
    }
  }
}

projectileDataLab.register( 'SamplingCanvasNode', SamplingCanvasNode );
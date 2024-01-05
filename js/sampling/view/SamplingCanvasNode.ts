// Copyright 2023-2024, University of Colorado Boulder

import Property from '../../../../axon/js/Property.js';
import PDLCanvasNode, { PDLCanvasNodeOptions } from '../../common/view/PDLCanvasNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLColors from '../../common/PDLColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import SamplingField from '../model/SamplingField.js';
import cannonball_png from '../../../images/cannonball_png.js';
import cannonballGray_png from '../../../images/cannonballGray_png.js';
import PDLConstants from '../../common/PDLConstants.js';

/**
 * Render the paths and projectiles for the Variability, Sources and Measures screens of Projectile Data Lab.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SamplingCanvasNodeOptions = SelfOptions & PDLCanvasNodeOptions;

export default class SamplingCanvasNode extends PDLCanvasNode<SamplingField> {
  public constructor( fieldProperty: Property<SamplingField>,
                      isPathsVisibleProperty: Property<boolean>,
                      modelViewTransform: ModelViewTransform2,
                      selectedSampleProperty: TReadOnlyProperty<number>,
                      providedOptions: SamplingCanvasNodeOptions ) {

    const options = optionize<SamplingCanvasNodeOptions, SelfOptions, PDLCanvasNodeOptions>()( {}, providedOptions );

    super( fieldProperty, isPathsVisibleProperty, modelViewTransform, selectedSampleProperty, options );
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    // Order of drawing:
    // 1. Force field graphics for outliers
    // 2: Trajectories
    // 3: Projectiles

    const projectiles = this.fieldProperty.value.getProjectilesInSelectedSample();
    const landedProjectiles = this.fieldProperty.value.getLandedProjectilesInSelectedSample();

    // 1. Force field graphics for landed outliers are drawn in PDLCanvasNode
    super.drawOutlierGraphicsForLandedProjectiles( projectiles, context );

    // 2. Trajectories
    context.lineWidth = 1;

    const phase = this.fieldProperty.value.phaseProperty.value;
    for ( let i = 0; i < projectiles.length; i++ ) {
      const isAirborne = !landedProjectiles.includes( projectiles[ i ] );
      const showHighlightedPath = phase === 'showingAirborneProjectiles' && isAirborne;

      const pathStrokeColorProperty = showHighlightedPath ? PDLColors.pathStrokeAirborneColorProperty : PDLColors.pathStrokeSamplingColorProperty;
      context.strokeStyle = pathStrokeColorProperty.value.toCSS();
      this.drawPathForProjectile( context, projectiles[ i ] );
    }

    // 3. Projectiles
    for ( let i = 0; i < projectiles.length; i++ ) {
      const projectile = projectiles[ i ];

      const viewPoint = this.modelViewTransform.modelToViewXY( projectile.x, projectile.y );
      const image = ( phase === 'showingCompleteSampleWithMean' || phase === 'maxSamplesReached' ) ? cannonballGray_png : cannonball_png;

      context.save();

      // Move to the center of where we want to draw our image, similar to code in PDLCanvasNode
      context.translate( viewPoint.x, viewPoint.y );
      context.scale( PDLConstants.PROJECTILE_IMAGE_SCALE_FACTOR, PDLConstants.PROJECTILE_IMAGE_SCALE_FACTOR );
      context.drawImage( image, -image.width / 2, -image.height / 2 );

      context.restore();

    }
  }
}

projectileDataLab.register( 'SamplingCanvasNode', SamplingCanvasNode );
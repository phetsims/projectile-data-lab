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
  public constructor( fieldProperty: Property<SamplingField>,
                      isPathsVisibleProperty: Property<boolean>,
                      private readonly isContinuousLaunchingProperty: TReadOnlyProperty<boolean>,
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

    // 1. Force field graphics for landed outliers are drawn in PDLCanvasNode
    super.drawOutlierGraphicsForLandedProjectiles( projectiles, context );

    // 2. Trajectories
    context.lineWidth = 1;

    const isShowingSampleMean = this.fieldProperty.value.sampleMeanProperty.value !== null;

    for ( let i = 0; i < projectiles.length; i++ ) {
      const showHighlightedPath = !this.isContinuousLaunchingProperty.value && i === projectiles.length - 1;

      const pathStrokeColorProperty = ( showHighlightedPath && !isShowingSampleMean ) ? PDLColors.pathStrokeAirborneColorProperty : PDLColors.pathStrokeSamplingColorProperty;
      context.strokeStyle = pathStrokeColorProperty.value.toCSS();
      this.drawPathForProjectile( context, projectiles[ i ] );
    }

    // 3. Projectiles
    for ( let i = 0; i < projectiles.length; i++ ) {

      // All projectiles are darkened in the Sampling screen, so they match the look of the majority of the data on the other screens
      // REVIEW: There is a design request to show flying cannonballs in "single" mode. If we decide to do that, we may
      // wish to show the undarkened ones while flying through the air, or otherwise try to match the design from screens 1-3
      this.drawProjectile( context, projectiles[ i ], true, true );
    }
  }
}

projectileDataLab.register( 'SamplingCanvasNode', SamplingCanvasNode );
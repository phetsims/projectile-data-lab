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
    // 1. Force field graphics for outliers
    // 2: Trajectories
    // 3: Projectiles

    const projectiles = this.fieldProperty.value.getProjectilesInSelectedSample();

    // 1. Force field graphics for landed outliers are drawn in PDLCanvasNode
    super.drawOutlierGraphicsForLandedProjectiles( projectiles, context );

    // 2. Trajectories
    context.lineWidth = 2;
    context.strokeStyle = PDLColors.pathStrokeLandedInitialColorProperty.value.toCSS();
    for ( let i = 0; i < projectiles.length; i++ ) {
      this.drawPathForProjectile( context, projectiles[ i ] );
    }

    // 3. Projectiles
    for ( let i = 0; i < projectiles.length; i++ ) {
      this.drawProjectile( context, projectiles[ i ], true, false );
    }

    // Draw the mean marker (if the sample is complete)
    if ( projectiles.length === this.fieldProperty.value.sampleSize ) {
      const meanX = _.mean( projectiles.map( projectile => projectile.x ) );
      const viewPoint = this.modelViewTransform.modelToViewXY( meanX, 0 );

      const SIDE_LENGTH = 20; // Define the side length of the triangle
      const height = ( Math.sqrt( 3 ) / 2 ) * SIDE_LENGTH; // Calculate the height of the equilateral triangle

      // Draw a purple triangle pointing down at that viewPoint which has {x:number,y:number}
      context.beginPath();
      context.moveTo( viewPoint.x, viewPoint.y ); // Move to the top vertex of the triangle
      context.lineTo( viewPoint.x - SIDE_LENGTH / 2, viewPoint.y - height ); // Line to bottom-left vertex
      context.lineTo( viewPoint.x + SIDE_LENGTH / 2, viewPoint.y - height ); // Line to bottom-right vertex
      context.closePath();
      context.fillStyle = PDLColors.meanMarkerColorProperty.value.toCSS();
      context.fill();

      // And add a black stroke around it
      context.lineWidth = 1;
      context.strokeStyle = 'black';
      context.stroke();
    }
  }
}

projectileDataLab.register( 'SamplingCanvasNode', SamplingCanvasNode );
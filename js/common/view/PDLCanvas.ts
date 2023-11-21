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
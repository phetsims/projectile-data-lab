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

// constants
// Render at increased resolution so particles don't appear pixellated on a large screen.  See Node.rasterized's
// resolution option for details about this value.
// TODO: Maybe do resolution? See https://github.com/phetsims/projectile-data-lab/issues/7
// const RESOLUTION = 2;

type SelfOptions = EmptySelfOptions;
type PDLCanvasOptions = SelfOptions & CanvasNodeOptions;

export default class PDLCanvas extends CanvasNode {
  private readonly fieldProperty: Property<Field>;

  public constructor( fieldProperty: Property<Field>, providedOptions: PDLCanvasOptions ) {

    const options = optionize<PDLCanvasOptions, SelfOptions, CanvasNodeOptions>()( {

      // only use the visible part for the bounds (not the damping regions).  Additionally erode so the particles
      // don't leak over the edge of the wave area
      // canvasBounds: waveAreaNodeBounds.eroded( 5 ),
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
  }

  /**
   * Draws into the canvas.
   */
  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    // context.transform( 1 / RESOLUTION, 0, 0, 1 / RESOLUTION, 0, 0 );
    const projectiles = this.fieldProperty.value.projectiles;
    for ( let i = 0; i < projectiles.length; i++ ) {
      const projectile = projectiles[ i ];
      context.beginPath();
      context.moveTo( projectile.x, projectile.y );
      context.lineTo( projectile.x + 4, projectile.y + 4 );
      context.strokeStyle = 'black';
      context.lineWidth = 1;
      context.stroke();
    }
  }
}

projectileDataLab.register( 'PDLCanvas', PDLCanvas );
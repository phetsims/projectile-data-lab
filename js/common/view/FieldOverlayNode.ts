// Copyright 2023, University of Colorado Boulder

import { Node, NodeOptions, Path, Circle, Text } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLConstants from '../PDLConstants.js';
import PDLColors from '../PDLColors.js';
import { Shape } from '../../../../kite/js/imports.js';
import PDLUtils from '../PDLUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

/**
 * The FieldOverlayNode contains the portions of the field that are not drawn using a perspective transform.
 * It consists of the horizontal dashed line, origin circle and field distance labels.
 * The origin of the FieldOverlayNode is at the 50-meter mark on the field.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = {
  isLeftSide?: boolean;
};
type FieldOverlayNodeOptions = SelfOptions & NodeOptions;

export default class FieldOverlayNode extends Node {
  public constructor( modelViewTransform: ModelViewTransform2, providedOptions: FieldOverlayNodeOptions ) {

    const numTotalDashes = 30;
    const numDashesToDraw = providedOptions.isLeftSide ? 1 : numTotalDashes;

    // Subtract 1 to make the dashed part of the right edge line up with the right side of the field
    const dashLength = modelViewTransform.modelToViewDeltaX( PDLConstants.MAX_FIELD_DISTANCE ) / ( 2 * numTotalDashes - 1 );

    // The dashed line extends horizontally along the width of the field.
    const dashedLineShape = new Shape();

    const originX = modelViewTransform.modelToViewDeltaX( -PDLConstants.MAX_FIELD_DISTANCE / 2 );

    for ( let i = 0; i < numDashesToDraw; i++ ) {
      const dashX = originX + i * ( 2 * dashLength );
      dashedLineShape.rect( dashX, -0.5 * PDLConstants.FIELD_CENTER_LINE_WIDTH, dashLength, PDLConstants.FIELD_CENTER_LINE_WIDTH );
    }

    const dashedLineTransformed = dashedLineShape.nonlinearTransformed( {
      pointMap: PDLUtils.transformField
    } );

    const dashedLine = new Path( dashedLineTransformed, {
      fill: PDLColors.fieldBorderColorProperty
    } );

    // Create the numbered distance labels
    const distanceLabels: Text[] = [];
    const totalDistanceLabels = ( PDLConstants.MAX_FIELD_DISTANCE - PDLConstants.FIELD_LABEL_INCREMENT )
                                / PDLConstants.FIELD_LABEL_INCREMENT;
    const distanceLabelY = PDLConstants.FIELD_LABEL_TOP_MARGIN + 0.5 * PDLConstants.FIELD_HEIGHT;

    for ( let i = 0; i <= totalDistanceLabels; i++ ) {
      const distance = ( i + 1 ) * PDLConstants.FIELD_LABEL_INCREMENT;
      const distanceLabelX = originX + modelViewTransform.modelToViewDeltaX( distance );

      // Apply the perspective transform to the label offset so that it is positioned relative to the bottom of the field
      const distanceLabelPositionShape = new Shape().moveTo( distanceLabelX, 0 ).lineTo( distanceLabelX, distanceLabelY );
      const distancePositionTransformed = distanceLabelPositionShape.nonlinearTransformed( {
        pointMap: PDLUtils.transformField
      } );

      const textLabel = new Text( distance, {
        centerX: distance >= 0.5 * PDLConstants.MAX_FIELD_DISTANCE ?
                 distancePositionTransformed.bounds.right :
                 distancePositionTransformed.bounds.left,
        top: distancePositionTransformed.bounds.bottom + PDLConstants.FIELD_LABEL_TOP_MARGIN,
        font: PDLConstants.FIELD_LABEL_FONT,
        maxWidth: modelViewTransform.modelToViewDeltaX( PDLConstants.FIELD_LABEL_INCREMENT ) * 0.9 // Add a horizontal margin
      } );
      distanceLabels.push( textLabel );
    }

    const childContainer = new Node( { children: [ dashedLine, ...distanceLabels ] } );

    // If this is the left side overlay in front of the launcher, add the origin circle
    if ( providedOptions.isLeftSide ) {
      childContainer.addChild( new Circle( PDLConstants.FIELD_CENTER_LINE_WIDTH, {
        x: originX,
        fill: PDLColors.fieldBorderColorProperty
      } ) );
    }

    const options = optionize<FieldOverlayNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ childContainer ],
      isLeftSide: false
    }, providedOptions );

    super( options );
  }
}
projectileDataLab.register( 'FieldOverlayNode', FieldOverlayNode );
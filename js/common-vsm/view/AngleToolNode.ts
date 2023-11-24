// Copyright 2023, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import HeatMapToolNode, { HeatMapToolNodeOptions } from './HeatMapToolNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';

/**
 * The AngleToolNode is a static tool that displays a heat map representation of angle data.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type AngleToolNodeOptions = SelfOptions & StrictOmit<HeatMapToolNodeOptions,
  'displayOffset' | 'titleStringProperty' | 'unitsStringProperty' | 'bodyShape' | 'needleShape'
  | 'binWidth' | 'minValue' | 'maxValue' | 'minLabeledValue' | 'maxLabeledValue' | 'labeledValueIncrement'
  | 'labelDistanceFromCenter' | 'labelMinAngle' | 'labelMaxAngle' | 'innerHeatNodeRadius' | 'outerHeatNodeRadius'
  | 'minHeatNodeAngle' | 'maxHeatNodeAngle'>;

export default class AngleToolNode extends HeatMapToolNode {
  public constructor( providedOptions: AngleToolNodeOptions ) {

    // Create the body shape
    const innerBodyRadius = 70;
    const outerBodyRadius = 100;
    const minAngle = -20;
    const maxAngle = 80;

    const needleLength = 80;

    const outerCircle = new Shape().arc( 0, 0, outerBodyRadius, Utils.toRadians( -maxAngle ), Utils.toRadians( -minAngle ) ).lineTo( 0, 0 );
    const innerCircle = new Shape().arc( 0, 0, innerBodyRadius, Utils.toRadians( -maxAngle ), Utils.toRadians( -minAngle ) ).lineTo( 0, 0 );
    const bodyShape = outerCircle.shapeDifference( innerCircle ).close();

    // Create the needle shape
    const needleWidth = 6;
    const needleTipLength = 10;
    const needleArmLength = needleLength - needleTipLength - needleWidth / 2;

    const needleBaseShape = new Shape().arc( 0, 0, needleWidth / 2, Math.PI / 2, 3 * Math.PI / 2 );
    const needleArmShape = new Shape().rect( 0, -needleWidth / 2, needleArmLength, needleWidth );

    const needleTipLeftX = needleArmLength;

    const needleTipShape = new Shape().polygon( [
      new Vector2( needleTipLeftX, -needleWidth / 2 ),
      new Vector2( needleTipLeftX + needleTipLength, 0 ),
      new Vector2( needleTipLeftX, needleWidth / 2 )
    ] );

    // Create a shape that is the union of the three needle shapes
    const needleShape = Shape.union( [ needleBaseShape, needleArmShape, needleTipShape ] );

    const options = optionize<AngleToolNodeOptions, SelfOptions, HeatMapToolNodeOptions>()( {
      displayOffset: Vector2.ZERO,
      bodyShape: bodyShape,
      needleShape: needleShape,
      binWidth: 2,
      minValue: minAngle,
      maxValue: maxAngle,
      minHeatNodeAngle: minAngle,
      maxHeatNodeAngle: maxAngle,
      innerHeatNodeRadius: innerBodyRadius,
      outerHeatNodeRadius: outerBodyRadius,
      minLabeledValue: minAngle + 10,
      maxLabeledValue: maxAngle - 10,
      labeledValueIncrement: 10,
      labelDistanceFromCenter: ( innerBodyRadius + outerBodyRadius ) / 2,
      labelMinAngle: minAngle + 10,
      labelMaxAngle: maxAngle - 10,
      titleStringProperty: ProjectileDataLabStrings.launchAngleStringProperty,
      unitsStringProperty: ProjectileDataLabStrings.degreesStringProperty,
      clockwise: false
    }, providedOptions );
    super( options );
  }
}

projectileDataLab.register( 'AngleToolNode', AngleToolNode );
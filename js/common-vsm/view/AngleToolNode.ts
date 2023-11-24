// Copyright 2023, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import HeatMapToolNode, { HeatMapToolNodeOptions } from './HeatMapToolNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';

/**
 * The AngleToolNode is a static tool that displays a heat map representation of angle data.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type AngleToolNodeOptions = SelfOptions & StrictOmit<HeatMapToolNodeOptions,
  'titleStringProperty' | 'unitsStringProperty' | 'needleShape' | 'heatNodeShape' | 'binWidth' | 'minValue' | 'maxValue'>;

export default class AngleToolNode extends HeatMapToolNode {
  public constructor( providedOptions: AngleToolNodeOptions ) {

    const needleWidth = 6;
    const needleLength = 80;
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
      titleStringProperty: ProjectileDataLabStrings.launchAngleStringProperty,
      heatNodeShape: new Shape().rect( 0, 0, 10, 10 ),
      needleShape: needleShape,
      binWidth: 1,
      minValue: 0,
      maxValue: 10,
      unitsStringProperty: ProjectileDataLabStrings.degreesStringProperty
    }, providedOptions );
    super( options );
  }
}

projectileDataLab.register( 'AngleToolNode', AngleToolNode );
// Copyright 2023, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import HeatMapToolNode, { HeatMapToolNodeOptions } from './HeatMapToolNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';

/**
 * The SpeedToolNode is a static tool that displays a heat map representation of speed data.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type SpeedToolNodeOptions = SelfOptions & StrictOmit<HeatMapToolNodeOptions,
  'titleStringProperty' | 'unitsStringProperty' | 'needleShape' | 'heatNodeShape' | 'binWidth' | 'minValue' | 'maxValue'>;
export default class SpeedToolNode extends HeatMapToolNode {
  public constructor( providedOptions: SpeedToolNodeOptions ) {

    const needleBaseRadius = 3;
    const needleTipRadius = 1;
    const needleLength = 60;
    const needleTipX = needleLength - needleBaseRadius - needleTipRadius;

    const needleBaseShape = new Shape().arc( 0, 0, needleBaseRadius, Math.PI / 2, 3 * Math.PI / 2 );
    const needleTipShape = new Shape().arc( needleTipX, 0, needleTipRadius, 3 * Math.PI / 2, Math.PI / 2 );
    const needleArmShape = new Shape().polygon( [
      new Vector2( 0, needleBaseRadius ),
      new Vector2( needleTipX, needleTipRadius ),
      new Vector2( needleTipX, -needleTipRadius ),
      new Vector2( 0, -needleBaseRadius )
    ] );

    // Create a shape that is the union of the three needle shapes
    const needleShape = Shape.union( [ needleArmShape, needleBaseShape, needleTipShape ] );

    const options = optionize<SpeedToolNodeOptions, SelfOptions, HeatMapToolNodeOptions>()( {
      titleStringProperty: ProjectileDataLabStrings.launchSpeedStringProperty,
      needleShape: needleShape,
      heatNodeShape: new Shape().rect( 0, 0, 10, 10 ),
      binWidth: 1,
      minValue: 0,
      maxValue: 10,
      unitsStringProperty: ProjectileDataLabStrings.metersPerSecondStringProperty
    }, providedOptions );
    super( options );
  }
}

projectileDataLab.register( 'SpeedToolNode', SpeedToolNode );
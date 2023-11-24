// Copyright 2023, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import HeatMapToolNode, { HeatMapToolNodeOptions } from './HeatMapToolNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import { Circle, Path } from '../../../../scenery/js/imports.js';
import PDLColors from '../../common/PDLColors.js';

/**
 * The SpeedToolNode is a static tool that displays a heat map representation of speed data.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type SpeedToolNodeOptions = SelfOptions & StrictOmit<HeatMapToolNodeOptions,
  'displayOffset' | 'titleStringProperty' | 'unitsStringProperty' | 'bodyShape' | 'needleShape'
  | 'binWidth' | 'minValue' | 'maxValue' | 'minLabeledValue' | 'maxLabeledValue' | 'labeledValueIncrement'
  | 'labelDistanceFromCenter' | 'labelMinAngle' | 'labelMaxAngle' | 'innerHeatNodeRadius' | 'outerHeatNodeRadius'
  | 'minHeatNodeAngle' | 'maxHeatNodeAngle'>;
export default class SpeedToolNode extends HeatMapToolNode {
  public constructor( providedOptions: SpeedToolNodeOptions ) {

    const bodyRadius = 60;
    const needleLength = 55;

    // Create the body shape
    const needleAngleOverhang = 9; // The number of degrees that the needle rotates below the horizontal at 0 and max values
    const bottomMarginAngle = 10; // The number of degrees that the body extends below the lowest overhang point
    const totalAngleOverhang = needleAngleOverhang + bottomMarginAngle;
    const bodyShape = new Shape().arc( 0, 0, bodyRadius,
      Math.PI - Utils.toRadians( totalAngleOverhang ), Utils.toRadians( totalAngleOverhang ) ).close();

    // Create the needle shape
    const needleBaseRadius = 3;
    const needleTipRadius = 1;
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

    const minValue = 0;
    const maxValue = 30;

    const options = optionize<SpeedToolNodeOptions, SelfOptions, HeatMapToolNodeOptions>()( {
      displayOffset: new Vector2( 0, -150 ),
      bodyShape: bodyShape,
      needleShape: needleShape,
      binWidth: 1,
      minValue: minValue,
      maxValue: maxValue,
      minHeatNodeAngle: 180 + needleAngleOverhang,
      maxHeatNodeAngle: -needleAngleOverhang,
      innerHeatNodeRadius: 0.5 * bodyRadius,
      outerHeatNodeRadius: bodyRadius,
      minLabeledValue: minValue,
      maxLabeledValue: maxValue,
      labeledValueIncrement: 5,
      labelDistanceFromCenter: 0.8 * bodyRadius,
      labelMinAngle: 180 + needleAngleOverhang,
      labelMaxAngle: -needleAngleOverhang,
      titleStringProperty: ProjectileDataLabStrings.launchSpeedStringProperty,
      unitsStringProperty: ProjectileDataLabStrings.metersPerSecondStringProperty,
      clockwise: true
    }, providedOptions );
    super( options );

    // Create the graphics for the wire connected to the launcher
    const launcherCircle = new Circle( 4, { fill: 'black' } );

    const controlPoint1 = new Vector2( 0, 0.7 * options.displayOffset.y );
    const controlPoint2 = new Vector2( -30, 0.3 * options.displayOffset.y );
    const connectorShape = new Shape().moveTo( options.displayOffset.x, options.displayOffset.y ).cubicCurveTo(
      controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, 0, 0 );

    const connector = new Path( connectorShape, { stroke: PDLColors.speedToolConnectorColorProperty, lineWidth: 4 } );

    this.addChild( launcherCircle );
    this.addChild( connector );

    launcherCircle.moveToBack();
    connector.moveToBack();
  }
}

projectileDataLab.register( 'SpeedToolNode', SpeedToolNode );
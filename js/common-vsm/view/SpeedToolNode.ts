// Copyright 2023, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import HeatMapToolNode, { HeatMapToolNodeOptions } from './HeatMapToolNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import { Circle, Path, Node } from '../../../../scenery/js/imports.js';
import PDLColors from '../../common/PDLColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

/**
 * The SpeedToolNode is a static tool that displays a heat map representation of speed data.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type SpeedToolNodeOptions = SelfOptions & StrictOmit<HeatMapToolNodeOptions,
  'displayOffset' | 'readoutPatternStringProperty' | 'bodyShape' | 'needleShape' | 'binWidth' | 'minValue'
  | 'maxValue' | 'minLabeledValue' | 'maxLabeledValue' | 'labeledValueIncrement' | 'labelDistanceFromCenter' | 'labelMinAngle'
  | 'labelMaxAngle' | 'innerHeatNodeRadius' | 'outerHeatNodeRadius' | 'minAngle' | 'maxAngle' | 'minorTickMarkIncrement' | 'valueReadoutY'
  | 'majorTickMarkLength' | 'minorTickMarkLength'>;
export default class SpeedToolNode extends HeatMapToolNode {
  private readonly connectingWire;

  private displayOffset: Vector2;

  public constructor( isLauncherRaised: TReadOnlyProperty<boolean>, providedOptions: SpeedToolNodeOptions ) {

    const bodyRadius = 60;
    const needleLength = 55;

    // Create the body shape
    const needleAngleOverhang = 9; // The number of degrees that the needle rotates below the horizontal at 0 and max values
    const bottomMarginAngle = 8; // The number of degrees that the body extends below the lowest overhang point
    const totalAngleOverhang = needleAngleOverhang + bottomMarginAngle;
    const bodyShape = new Shape().arc( 0, 0, bodyRadius,
      Math.PI - Utils.toRadians( totalAngleOverhang ), Utils.toRadians( totalAngleOverhang ) ).close();

    // Create the needle shape
    const needleBaseRadius = 2.5;
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
      displayOffset: new Vector2( -20, -150 ),
      bodyShape: bodyShape,
      needleShape: needleShape,
      binWidth: 0.25,
      minValue: minValue,
      maxValue: maxValue,
      minAngle: 180 + needleAngleOverhang,
      maxAngle: -needleAngleOverhang,
      innerHeatNodeRadius: 0.5 * bodyRadius,
      outerHeatNodeRadius: bodyRadius,
      minLabeledValue: minValue,
      maxLabeledValue: maxValue,
      labeledValueIncrement: 5,
      labelDistanceFromCenter: 0.8 * bodyRadius,
      labelMinAngle: 180 + needleAngleOverhang,
      labelMaxAngle: -needleAngleOverhang,
      isWithMinorTickMarks: true,
      minorTickMarkIncrement: 1,
      majorTickMarkLength: 5,
      minorTickMarkLength: 3,
      valueReadoutY: bodyRadius * Math.sin( Utils.toRadians( totalAngleOverhang ) ),
      readoutPatternStringProperty: ProjectileDataLabStrings.metersPerSecondPatternStringProperty,
      isClockwise: true
    }, providedOptions );
    super( options );

    this.displayOffset = options.displayOffset;

    // Create the graphics for the wire connected to the launcher
    const launcherCircle = new Circle( 4, { fill: 'black' } );

    const connectingWireShape = this.connectingWireShapeForIsRaised( false );
    this.connectingWire = new Node();
    this.connectingWire.addChild( new Path( connectingWireShape, {
      stroke: PDLColors.speedToolConnectorColorProperty, lineWidth: 4
    } ) );

    this.addChild( launcherCircle );
    this.addChild( this.connectingWire );

    launcherCircle.moveToBack();
    this.connectingWire.moveToBack();

    isLauncherRaised.link( isRaised => {
      this.setForIsLauncherRaised( isRaised );
    } );
  }

  private setForIsLauncherRaised( isLauncherRaised: boolean ): void {
    const speedToolX = -20;
    const speedToolY = isLauncherRaised ? 110 : -150;

    this.displayOffset = new Vector2( speedToolX, speedToolY );

    const connectingWireShape = this.connectingWireShapeForIsRaised( isLauncherRaised );
    this.connectingWire.removeAllChildren();
    this.connectingWire.addChild( new Path( connectingWireShape, {
      stroke: PDLColors.speedToolConnectorColorProperty, lineWidth: 4
    } ) );

    this.displayNode.setX( speedToolX );
    this.displayNode.setY( speedToolY );
  }

  private connectingWireShapeForIsRaised( isRaised: boolean ): Shape {
    const controlPoint1 = new Vector2( this.displayOffset.x, 0.6 * this.displayOffset.y );
    const controlPoint2 = new Vector2( this.displayOffset.x - 10, 0.3 * this.displayOffset.y );
    return new Shape().moveTo( this.displayOffset.x, this.displayOffset.y ).cubicCurveTo(
      controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, 0, 0 );
  }
}

projectileDataLab.register( 'SpeedToolNode', SpeedToolNode );
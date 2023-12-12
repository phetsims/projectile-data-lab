// Copyright 2023, University of Colorado Boulder

import optionize from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import HeatMapToolNode, { HeatMapToolNodeOptions } from './HeatMapToolNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Path, Node } from '../../../../scenery/js/imports.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PDLColors from '../../common/PDLColors.js';

/**
 * The AngleToolNode is a static tool that displays a heat map representation of angle data.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = {
  isIcon?: boolean;
};

export type AngleToolNodeOptions = SelfOptions & StrictOmit<HeatMapToolNodeOptions,
  'displayOffset' | 'readoutPatternStringProperty' | 'bodyShape' | 'needleShape' | 'binWidth' | 'minValue'
  | 'maxValue' | 'minLabeledValue' | 'maxLabeledValue' | 'labeledValueIncrement' | 'labelDistanceFromCenter' | 'labelMinAngle'
  | 'labelMaxAngle' | 'innerHeatNodeRadius' | 'outerHeatNodeRadius' | 'minAngle' | 'maxAngle' | 'majorTickMarkLength' | 'valueReadoutY'>;


const VALUE_READOUT_Y_GROUND = 13;
const VALUE_READOUT_Y_RAISED = -29;

const MIN_ANGLE_GROUND = 0;
const MAX_ANGLE_GROUND = 90;
const MIN_ANGLE_RAISED = -40;
const MAX_ANGLE_RAISED = 40;

export default class AngleToolNode extends HeatMapToolNode {

  private readonly elementsForGround: Node[] = [];
  private readonly elementsForRaised: Node[] = [];

  public constructor( isRaisedProperty: TReadOnlyProperty<boolean>, providedOptions: AngleToolNodeOptions ) {

    const innerBodyRadius = 60;
    const outerBodyRadius = 95;

    const bodyShapeForIsRaised = ( innerBodyRadius: number, outerBodyRadius: number, isRaised: boolean ) => {
      const minAngle = isRaised ? MIN_ANGLE_RAISED : MIN_ANGLE_GROUND;
      const maxAngle = isRaised ? MAX_ANGLE_RAISED : MAX_ANGLE_GROUND;
      const outerCircle = new Shape().arc( 0, 0, outerBodyRadius, Utils.toRadians( -maxAngle ), Utils.toRadians( -minAngle ) ).lineTo( 0, 0 );
      const innerCircle = new Shape().arc( 0, 0, innerBodyRadius, Utils.toRadians( -maxAngle ), Utils.toRadians( -minAngle ) ).lineTo( 0, 0 );
      return outerCircle.shapeDifference( innerCircle ).close();
    };

    // Create the body shape
    const bodyShape = bodyShapeForIsRaised( innerBodyRadius, outerBodyRadius, isRaisedProperty.value );

    // Create the needle shape
    const needleLength = 76;
    const needleWidth = 3;
    const needleTipLength = 6;
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

    const minAngle = Math.min( MIN_ANGLE_GROUND, MIN_ANGLE_RAISED );
    const maxAngle = Math.max( MAX_ANGLE_GROUND, MAX_ANGLE_RAISED );

    const options = optionize<AngleToolNodeOptions, SelfOptions, HeatMapToolNodeOptions>()( {
      displayOffset: Vector2.ZERO,
      bodyShape: bodyShape,
      needleShape: needleShape,
      binWidth: 1,
      minValue: minAngle,
      maxValue: maxAngle,
      minAngle: minAngle,
      maxAngle: maxAngle,
      innerHeatNodeRadius: innerBodyRadius,
      outerHeatNodeRadius: outerBodyRadius,
      minLabeledValue: minAngle + 10,
      maxLabeledValue: maxAngle - 10,
      labeledValueIncrement: 10,
      labelDistanceFromCenter: ( innerBodyRadius + outerBodyRadius ) / 2,
      labelMinAngle: minAngle + 10,
      labelMaxAngle: maxAngle - 10,
      isWithInnerTickMarks: true,
      majorTickMarkLength: 5,
      valueReadoutY: VALUE_READOUT_Y_GROUND,
      readoutPatternStringProperty: ProjectileDataLabStrings.degreesPatternStringProperty,
      isIcon: false
    }, providedOptions );
    super( options );

    const rotatedElements = [ ...this.heatNodes, ...this.tickMarks ];
    rotatedElements.forEach( rotatedElement => {
      const elementAngle = -Utils.toDegrees( rotatedElement.rotation );
      if ( elementAngle > MIN_ANGLE_GROUND && elementAngle < MAX_ANGLE_GROUND ) { this.elementsForGround.push( rotatedElement ); }
      if ( elementAngle > MIN_ANGLE_RAISED && elementAngle < MAX_ANGLE_RAISED ) { this.elementsForRaised.push( rotatedElement ); }
    } );

    this.labels.forEach( label => {
      const labelAngularDisplacement = Math.atan2( label.centerY, label.centerX );
      const labelAngle = _.round( -Utils.toDegrees( labelAngularDisplacement ) );
      if ( labelAngle > MIN_ANGLE_GROUND && labelAngle < MAX_ANGLE_GROUND ) { this.elementsForGround.push( label ); }
      if ( labelAngle > MIN_ANGLE_RAISED && labelAngle < MAX_ANGLE_RAISED ) { this.elementsForRaised.push( label ); }
    } );

    isRaisedProperty.link( isRaised => {
      const bodyShape = bodyShapeForIsRaised( innerBodyRadius, outerBodyRadius, isRaised );
      this.drawBodyNodes( bodyShape );

      // Set the visibility of the elements that are in this.elementsForRaised but not in this.elementsForGround to isRaised
      this.elementsForRaised.forEach( element => {
        if ( !this.elementsForGround.includes( element ) ) {
          element.setVisible( isRaised );
        }
      } );

      // Set the visibility of the elements that are in this.elementsForGround but not in this.elementsForRaised to !isRaised
      this.elementsForGround.forEach( element => {
        if ( !this.elementsForRaised.includes( element ) ) {
          element.setVisible( !isRaised );
        }
      } );

      this.valueReadoutNode.x = isRaised ? 0.45 * innerBodyRadius : 0.5 * innerBodyRadius;
      this.valueReadoutNode.y = isRaised ? VALUE_READOUT_Y_RAISED : VALUE_READOUT_Y_GROUND;
    } );
  }

  public setNeedleForValue( value: number ): void {
    this.needleNode.setRotation( Utils.toRadians( -value ) );
  }

  private drawBodyNodes( bodyShape: Shape ): void {
    this.displayNode.removeChild( this.bodyBackNode );
    this.displayNode.removeChild( this.bodyFrontNode );
    this.bodyBackNode = new Path( bodyShape, { fill: PDLColors.heatMapBodyFillColorProperty } );
    this.bodyFrontNode = new Path( bodyShape, { stroke: PDLColors.heatMapBodyStrokeColorProperty, lineWidth: 1 } );
    this.displayNode.addChild( this.bodyBackNode );
    this.displayNode.addChild( this.bodyFrontNode );
    this.bodyBackNode.moveToBack();
    this.needleNode.moveToFront();
  }
}

projectileDataLab.register( 'AngleToolNode', AngleToolNode );
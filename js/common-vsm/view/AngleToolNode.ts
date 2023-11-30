// Copyright 2023, University of Colorado Boulder

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import HeatMapToolNode, { HeatMapToolNodeOptions } from './HeatMapToolNode.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Path } from '../../../../scenery/js/imports.js';
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

type SelfOptions = EmptySelfOptions;

export type AngleToolNodeOptions = SelfOptions & StrictOmit<HeatMapToolNodeOptions,
  'displayOffset' | 'readoutPatternStringProperty' | 'bodyShape' | 'needleShape' | 'binWidth' | 'minValue'
  | 'maxValue' | 'minLabeledValue' | 'maxLabeledValue' | 'labeledValueIncrement' | 'labelDistanceFromCenter' | 'labelMinAngle'
  | 'labelMaxAngle' | 'innerHeatNodeRadius' | 'outerHeatNodeRadius' | 'minAngle' | 'maxAngle' | 'majorTickMarkLength' | 'valueReadoutY'>;


const VALUE_READOUT_Y_MAGNITUDE = 17;

export default class AngleToolNode extends HeatMapToolNode {
  public constructor( isNegativeAnglesShowingProperty: TReadOnlyProperty<boolean>, providedOptions: AngleToolNodeOptions ) {

    const innerBodyRadius = 70;
    const outerBodyRadius = 100;
    const minAngle = -20;
    const maxAngle = 90;

    const bodyShapeForShowNegativeAngles = ( innerBodyRadius: number, outerBodyRadius: number, minAngle: number, maxAngle: number, showNegativeAngles: boolean ) => {
      const minAngleToShow = showNegativeAngles ? minAngle : 0;
      const outerCircle = new Shape().arc( 0, 0, outerBodyRadius, Utils.toRadians( -maxAngle ), Utils.toRadians( -minAngleToShow ) ).lineTo( 0, 0 );
      const innerCircle = new Shape().arc( 0, 0, innerBodyRadius, Utils.toRadians( -maxAngle ), Utils.toRadians( -minAngleToShow ) ).lineTo( 0, 0 );
      return outerCircle.shapeDifference( innerCircle ).close();
    };

    // Create the body shape
    const bodyShape = bodyShapeForShowNegativeAngles( innerBodyRadius, outerBodyRadius, minAngle, maxAngle,
      isNegativeAnglesShowingProperty.value );

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
      valueReadoutY: VALUE_READOUT_Y_MAGNITUDE,
      readoutPatternStringProperty: ProjectileDataLabStrings.degreesPatternStringProperty
    }, providedOptions );
    super( options );

    isNegativeAnglesShowingProperty.link( isNegativeAnglesShowing => {
      const bodyShape = bodyShapeForShowNegativeAngles( innerBodyRadius, outerBodyRadius, minAngle, maxAngle, isNegativeAnglesShowing );
      this.drawBodyNodes( bodyShape );
      this.heatNodesBelowHorizontal.forEach( heatNode => heatNode.setVisible( isNegativeAnglesShowing ) );
      this.labelsBelowHorizontal.forEach( label => label.setVisible( isNegativeAnglesShowing ) );
      this.tickMarksBelowHorizontal.forEach( tickMark => tickMark.setVisible( isNegativeAnglesShowing ) );

      // Move the value readout node to the other side of the needle
      this.valueReadoutNode.y = isNegativeAnglesShowing ? -VALUE_READOUT_Y_MAGNITUDE : VALUE_READOUT_Y_MAGNITUDE;
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
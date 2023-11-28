// Copyright 2023, University of Colorado Boulder

import { LinearGradient, Node, NodeOptions, Path, RadialGradient, Rectangle } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLColors from '../PDLColors.js';
import TProperty from '../../../../axon/js/TProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Shape } from '../../../../kite/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';

/**
 * The LauncherNode is the visual representation of the projectile launcher. It contains a launcher, frame and a stand.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type LauncherNodeOptions = SelfOptions & NodeOptions;

const BARREL_LENGTH_BEFORE_ORIGIN = 95;
const BARREL_LENGTH_AFTER_ORIGIN = 15;
const NOZZLE_WIDTH = 32;

const SUPPORT_BAR_CENTER_X = -20;
const SUPPORT_BAR_WIDTH = 25;
const SUPPORT_BAR_HEIGHT = 150;

const GUIDE_RAIL_WIDTH = 27;
const GUIDE_SLOT_WIDTH = 5;

const GUIDE_RAIL_INNER_RADIUS = BARREL_LENGTH_BEFORE_ORIGIN - 0.5 * GUIDE_RAIL_WIDTH;
const GUIDE_RAIL_OUTER_RADIUS = BARREL_LENGTH_BEFORE_ORIGIN + 0.5 * GUIDE_RAIL_WIDTH;

const ANGLE_PAST_BOTTOM_VERTICAL = 15;
const ANGLE_PAST_TOP_HORIZONTAL = 30;

const GUIDE_RAIL_MIN_ANGLE = Utils.toRadians( 90 - ANGLE_PAST_BOTTOM_VERTICAL );
const GUIDE_RAIL_MAX_ANGLE = Utils.toRadians( 180 + ANGLE_PAST_TOP_HORIZONTAL );

const GUIDE_SLOT_INSET_ANGLE = 10;
const GUIDE_SLOT_MIN_ANGLE = GUIDE_RAIL_MIN_ANGLE + Utils.toRadians( GUIDE_SLOT_INSET_ANGLE );
const GUIDE_SLOT_MAX_ANGLE = GUIDE_RAIL_MAX_ANGLE - Utils.toRadians( GUIDE_SLOT_INSET_ANGLE );

const GUIDE_RAIL_CENTER_RADIUS = 0.5 * ( GUIDE_RAIL_INNER_RADIUS + GUIDE_RAIL_OUTER_RADIUS );
const GUIDE_SLOT_INNER_RADIUS = GUIDE_RAIL_CENTER_RADIUS - 0.5 * GUIDE_SLOT_WIDTH;
const GUIDE_SLOT_OUTER_RADIUS = GUIDE_RAIL_CENTER_RADIUS + 0.5 * GUIDE_SLOT_WIDTH;

export default class LauncherNode extends Node {

  // The launcher barrel contains all graphics that rotate with launch angle.
  private readonly launcherBarrel: Node;

  private readonly guideRailBolt: Node;

  public constructor( private readonly modelViewTransform: ModelViewTransform2,
                      launcherAngleProperty: TProperty<number>,
                      launcherHeightProperty: TProperty<number>,
                      launcherTypeProperty: TProperty<number>,
                      providedOptions: LauncherNodeOptions ) {

    const launcherX = modelViewTransform.modelToViewX( 0 );
    const launcherY = modelViewTransform.modelToViewY( 0 );

    const launcher = new Node();

    const defaultOptions = { x: launcherX, y: launcherY, children: [ launcher ] };
    const options = optionize<LauncherNodeOptions, SelfOptions, NodeOptions>()( defaultOptions, providedOptions );
    super( options );

    this.launcherBarrel = launcher;

    const launcherFrameBack = this.launcherFrameBack();
    const launcherFrameFront = this.launcherFrameFront();
    this.addChild( launcherFrameBack );
    this.addChild( launcherFrameFront );

    launcherFrameBack.moveToBack();

    this.guideRailBolt = new Path( Shape.regularPolygon( 6, 1.2 * GUIDE_SLOT_WIDTH ), {
      fill: PDLColors.launcherGuideBoltColorProperty,
      stroke: PDLColors.launcherStrokeColorProperty
    } );

    this.addChild( this.guideRailBolt );

    launcherAngleProperty.link( launcherAngle => {
      this.updateLauncherAngle( launcherAngle );
    } );

    launcherHeightProperty.link( launcherHeight => {
      this.updateLauncherHeight( launcherHeight );
    } );

    launcherTypeProperty.link( launcherType => {
      this.updateLauncherType( launcherType );
    } );
  }

  private updateLauncherAngle( angle: number ): void {
    this.launcherBarrel.setRotation( Utils.toRadians( -angle ) );

    this.guideRailBolt.centerX = -BARREL_LENGTH_BEFORE_ORIGIN * Math.cos( Utils.toRadians( angle ) );
    this.guideRailBolt.centerY = BARREL_LENGTH_BEFORE_ORIGIN * Math.sin( Utils.toRadians( angle ) );
  }

  private updateLauncherHeight( height: number ): void {
    this.y = this.modelViewTransform.modelToViewY( height );
  }

  private updateLauncherType( type: number ): void {
    this.launcherBarrel.removeAllChildren();
    this.launcherGraphicsForType( type ).forEach( launcherGraphics => {
      this.launcherBarrel.addChild( launcherGraphics );
    } );
  }

  private launcherGraphicsForType( launcherType: number ): Rectangle[] {
    const launcherLengthBeforeOrigin = BARREL_LENGTH_BEFORE_ORIGIN;
    const launcherLength = launcherLengthBeforeOrigin + BARREL_LENGTH_AFTER_ORIGIN;

    const launcherFillColorProperty = PDLColors.launcherFillColorProperties[ launcherType - 1 ];
    const launcherFillDarkColorProperty = new DerivedProperty( [ launcherFillColorProperty ],
      color => color.darkerColor( 0.8 ) );

    const launcherFillGradient = new LinearGradient( 0, -0.5 * NOZZLE_WIDTH, 0, 0.5 * NOZZLE_WIDTH );
    launcherFillGradient.addColorStop( 0, launcherFillDarkColorProperty );
    launcherFillGradient.addColorStop( 0.4, launcherFillColorProperty );
    launcherFillGradient.addColorStop( 0.6, launcherFillColorProperty );
    launcherFillGradient.addColorStop( 1, launcherFillDarkColorProperty );

    const launcherRect = new Rectangle(
      -launcherLengthBeforeOrigin,
      -0.5 * NOZZLE_WIDTH,
      launcherLength,
      NOZZLE_WIDTH, {
        fill: launcherFillGradient,
        stroke: PDLColors.launcherStrokeColorProperty,
        lineWidth: 1,
        cornerRadius: 0.2 * NOZZLE_WIDTH
      }
    );

    const launcherEndRectWidth = 1.2 * NOZZLE_WIDTH;
    const launcherEndRectLength = 0.12 * launcherEndRectWidth;

    const launcherEndRect = new Rectangle(
      BARREL_LENGTH_AFTER_ORIGIN - 0.5 * launcherEndRectLength,
      -0.5 * launcherEndRectWidth,
      launcherEndRectLength,
      launcherEndRectWidth, {
        fill: launcherFillDarkColorProperty,
        stroke: PDLColors.launcherStrokeColorProperty,
        lineWidth: 1,
        cornerRadius: 0.1 * launcherEndRectLength
      }
    );

    return [ launcherRect, launcherEndRect ];
  }

  private launcherFrameBack(): Node {
    const frameBackground = new Path( this.guideRailInnerShape(), {
      fill: PDLColors.launcherFrameBackgroundColorProperty
    } );

    const frameFillColorProperty = PDLColors.launcherFillColorProperties[ 0 ];
    const frameFillDarkColorProperty = new DerivedProperty( [ frameFillColorProperty ],
      color => color.darkerColor( 0.8 ) );

    const FRAME_BAR_WIDTH = 5;

    const frameBarTop = new Rectangle( 0, -FRAME_BAR_WIDTH, GUIDE_RAIL_INNER_RADIUS, FRAME_BAR_WIDTH, {
      fill: frameFillColorProperty,
      stroke: PDLColors.launcherStrokeColorProperty
    } );

    const frameBarBottom = new Rectangle( 0, 0, GUIDE_RAIL_INNER_RADIUS, FRAME_BAR_WIDTH, {
      fill: frameFillColorProperty,
      stroke: PDLColors.launcherStrokeColorProperty
    } );

    frameBarTop.rotateAround( Vector2.ZERO, GUIDE_RAIL_MAX_ANGLE );
    frameBarBottom.rotateAround( Vector2.ZERO, GUIDE_RAIL_MIN_ANGLE );

    const supportBarFillGradient = new LinearGradient( -0.5 * SUPPORT_BAR_WIDTH, 0, 0.5 * SUPPORT_BAR_WIDTH, 0 );
    supportBarFillGradient.addColorStop( 0, frameFillDarkColorProperty );
    supportBarFillGradient.addColorStop( 0.4, frameFillColorProperty );
    supportBarFillGradient.addColorStop( 0.6, frameFillColorProperty );
    supportBarFillGradient.addColorStop( 1, frameFillDarkColorProperty );

    const supportBar = new Rectangle( -0.5 * SUPPORT_BAR_WIDTH, 0, SUPPORT_BAR_WIDTH, SUPPORT_BAR_HEIGHT, {
      x: SUPPORT_BAR_CENTER_X,
      y: 0.5 * ( GUIDE_SLOT_OUTER_RADIUS + GUIDE_RAIL_OUTER_RADIUS ),
      fill: supportBarFillGradient,
      stroke: PDLColors.launcherStrokeColorProperty
    } );

    const frameBack = new Node( {
      children: [ supportBar, frameBackground, frameBarTop, frameBarBottom ]
    } );

    return frameBack;
  }

  private launcherFrameFront(): Node {
    const guideRailOuterShape = new Shape().arc( 0, 0, GUIDE_RAIL_OUTER_RADIUS, GUIDE_RAIL_MIN_ANGLE, GUIDE_RAIL_MAX_ANGLE )
      .lineTo( 0, 0 ).close();
    const guideRailShape = guideRailOuterShape.shapeDifference( this.guideRailInnerShape() );

    const guideSlotOuterShape = new Shape().arc( 0, 0, GUIDE_SLOT_OUTER_RADIUS, GUIDE_SLOT_MIN_ANGLE, GUIDE_SLOT_MAX_ANGLE )
      .lineTo( 0, 0 ).close();
    const guideSlotInnerShape = new Shape().arc( 0, 0, GUIDE_SLOT_INNER_RADIUS, GUIDE_SLOT_MIN_ANGLE, GUIDE_SLOT_MAX_ANGLE )
      .lineTo( 0, 0 ).close();

    // Add the circular end caps to the guide slot
    const guideRailSlotTopEndPosition = new Vector2( GUIDE_RAIL_CENTER_RADIUS, 0 ).rotate( GUIDE_SLOT_MIN_ANGLE );
    const guideRailSlotBottomEndPosition = new Vector2( GUIDE_RAIL_CENTER_RADIUS, 0 ).rotate( GUIDE_SLOT_MAX_ANGLE );

    // TODO: Why can't this be 0.5? - see https://github.com/phetsims/projectile-data-lab/issues/7
    const guideRailSlotTopEndCap = new Shape().circle( guideRailSlotTopEndPosition.x, guideRailSlotTopEndPosition.y,
      0.50001 * GUIDE_SLOT_WIDTH );
    const guideRailSlotBottomEndCap = new Shape().circle( guideRailSlotBottomEndPosition.x, guideRailSlotBottomEndPosition.y,
      0.50001 * GUIDE_SLOT_WIDTH );

    const guideSlotShape = guideSlotOuterShape.shapeDifference( guideSlotInnerShape )
      .shapeUnion( guideRailSlotTopEndCap ).shapeUnion( guideRailSlotBottomEndCap );

    const guideRailWithSlotShape = guideRailShape.shapeDifference( guideSlotShape );

    const guideRailFillColorProperty = PDLColors.launcherFillColorProperties[ 0 ];
    const guideRailFillDarkColorProperty = new DerivedProperty( [ guideRailFillColorProperty ],
      color => color.darkerColor( 0.8 ) );

    const guideRailFillGradient = new RadialGradient( 0, 0, GUIDE_RAIL_INNER_RADIUS, 0, 0, GUIDE_RAIL_OUTER_RADIUS );
    guideRailFillGradient.addColorStop( 0, guideRailFillDarkColorProperty );
    guideRailFillGradient.addColorStop( 0.3, guideRailFillColorProperty );
    guideRailFillGradient.addColorStop( 0.7, guideRailFillColorProperty );
    guideRailFillGradient.addColorStop( 1, guideRailFillDarkColorProperty );

    const guideRail = new Path( guideRailWithSlotShape, {
      fill: guideRailFillGradient,
      stroke: PDLColors.launcherStrokeColorProperty
    } );

    const frameFront = new Node( {
      children: [ guideRail ]
    } );

    return frameFront;
  }

  private guideRailInnerShape(): Shape {
    return new Shape().arc( 0, 0, GUIDE_RAIL_INNER_RADIUS, GUIDE_RAIL_MIN_ANGLE, GUIDE_RAIL_MAX_ANGLE )
      .lineTo( 0, 0 ).close();
  }
}

projectileDataLab.register( 'LauncherNode', LauncherNode );
// Copyright 2023, University of Colorado Boulder

import { Circle, LinearGradient, Node, NodeOptions, Path, RadialGradient, Rectangle } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLColors from '../PDLColors.js';
import TProperty from '../../../../axon/js/TProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Shape } from '../../../../kite/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Animation from '../../../../twixt/js/Animation.js';

/**
 * The LauncherNode is the visual representation of the projectile launcher. It contains a launcher, frame and a stand.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type LauncherNodeOptions = SelfOptions & NodeOptions;

export const BARREL_LENGTH_BEFORE_ORIGIN = 88;
const BARREL_LENGTH_AFTER_ORIGIN = 15;

const BARREL_BASE_WIDTH = 45;
const BARREL_NOZZLE_WIDTH = 28;
const BARREL_BASE_PAST_BOLT_FACTOR = 0.05; // The fraction of the barrel base radius that extends past the bolt

const ANGLE_PAST_BOTTOM_VERTICAL = 15;
const ANGLE_PAST_TOP_HORIZONTAL = 30;

const GUIDE_SLOT_WIDTH = 5.6;
const GUIDE_SLOT_INSET_ANGLE = 10;
const GUIDE_SLOT_INNER_RADIUS = BARREL_LENGTH_BEFORE_ORIGIN - 0.5 * GUIDE_SLOT_WIDTH;
const GUIDE_SLOT_OUTER_RADIUS = BARREL_LENGTH_BEFORE_ORIGIN + 0.5 * GUIDE_SLOT_WIDTH;

const GUIDE_RAIL_WIDTH = 27;
const GUIDE_RAIL_OFFSET_FACTOR = 0.4;
const GUIDE_RAIL_INNER_RADIUS = BARREL_LENGTH_BEFORE_ORIGIN - ( 0.5 - GUIDE_RAIL_OFFSET_FACTOR / 2 ) * GUIDE_RAIL_WIDTH;
const GUIDE_RAIL_OUTER_RADIUS = BARREL_LENGTH_BEFORE_ORIGIN + ( 0.5 + GUIDE_RAIL_OFFSET_FACTOR / 2 ) * GUIDE_RAIL_WIDTH;

const GUIDE_RAIL_MIN_ANGLE = Utils.toRadians( 90 - ANGLE_PAST_BOTTOM_VERTICAL );
const GUIDE_RAIL_MAX_ANGLE = Utils.toRadians( 180 + ANGLE_PAST_TOP_HORIZONTAL );
const GUIDE_SLOT_MIN_ANGLE = GUIDE_RAIL_MIN_ANGLE + Utils.toRadians( GUIDE_SLOT_INSET_ANGLE );
const GUIDE_SLOT_MAX_ANGLE = GUIDE_RAIL_MAX_ANGLE - Utils.toRadians( GUIDE_SLOT_INSET_ANGLE );

const SUPPORT_BAR_CENTER_X = -20;
const SUPPORT_BAR_WIDTH = 30;
const SUPPORT_BAR_HEIGHT = 200;

export default class LauncherNode extends Node {

  protected readonly launcherBarrel: Node;
  protected readonly launcherFrameFront: Node;
  protected readonly guideRailBolt: Node;

  private readonly launcherBarrelGraphics: Node;
  private readonly launcherFrameBack: Node;

  private barrelRotationAnimation?: Animation;

  public constructor( private readonly modelViewTransform: ModelViewTransform2,
                      launcherAngleProperty: TProperty<number>,
                      launcherHeightProperty: TProperty<number>,
                      presetLauncherProperty: TProperty<number>,
                      providedOptions: LauncherNodeOptions ) {

    const launcherX = modelViewTransform.modelToViewX( 0 );
    const launcherY = modelViewTransform.modelToViewY( 0 );

    const defaultOptions = { x: launcherX, y: launcherY };
    const options = optionize<LauncherNodeOptions, SelfOptions, NodeOptions>()( defaultOptions, providedOptions );
    super( options );

    this.launcherBarrel = new Node();
    this.launcherBarrelGraphics = new Node();
    this.launcherBarrel.addChild( this.launcherBarrelGraphics );

    this.launcherFrameBack = new Node();
    this.launcherFrameFront = new Node();

    this.guideRailBolt = new Circle( 0.9 * GUIDE_SLOT_WIDTH, {
      fill: PDLColors.launcherGuideBoltColorProperty,
      stroke: PDLColors.launcherStrokeColorProperty
    } );

    this.addChild( this.launcherFrameBack );
    this.addChild( this.launcherBarrel );
    this.addChild( this.launcherFrameFront );
    this.addChild( this.guideRailBolt );

    launcherAngleProperty.link( launcherAngle => {
      this.setBarrelRotation( launcherAngle );
    } );

    launcherHeightProperty.link( launcherHeight => {
      this.updateLauncherHeight( launcherHeight );
    } );

    presetLauncherProperty.link( presetLauncher => {
      this.updatePresetLauncher( presetLauncher );
    } );
  }

  public setBarrelRotation( angle: number ): void {
    this.launcherBarrel.setRotation( Utils.toRadians( -angle ) );

    this.guideRailBolt.centerX = -BARREL_LENGTH_BEFORE_ORIGIN * Math.cos( Utils.toRadians( angle ) );
    this.guideRailBolt.centerY = BARREL_LENGTH_BEFORE_ORIGIN * Math.sin( Utils.toRadians( angle ) );
  }

  private updateLauncherHeight( height: number ): void {
    this.y = this.modelViewTransform.modelToViewY( height );
  }

  protected updatePresetLauncher( type: number ): void {
    this.launcherBarrelGraphics.removeAllChildren();
    this.launcherBarrelGraphicsForType( type ).forEach( launcherBarrelGraphics => {
      this.launcherBarrelGraphics.addChild( launcherBarrelGraphics );
    } );

    this.launcherFrameBack.removeAllChildren();
    this.launcherFrameBackGraphicsForType( type ).forEach( launcherFrameBackGraphics => {
      this.launcherFrameBack.addChild( launcherFrameBackGraphics );
    } );

    this.launcherFrameFront.removeAllChildren();
    this.launcherFrameFrontGraphicsForType( type ).forEach( launcherFrameFrontGraphics => {
      this.launcherFrameFront.addChild( launcherFrameFrontGraphics );
    } );
  }

  private launcherBarrelGraphicsForType( presetLauncher: number ): Node[] {
    const barrelFillColorProperty = PDLColors.launcherFillColorProperties[ presetLauncher - 1 ];
    const barrelFillDarkColorProperty = new DerivedProperty( [ barrelFillColorProperty ],
      color => color.darkerColor( 0.8 ) );

    const barrelBaseRadius = 0.5 * BARREL_BASE_WIDTH;
    const barrelBaseX = -BARREL_LENGTH_BEFORE_ORIGIN + ( 1 - BARREL_BASE_PAST_BOLT_FACTOR ) * barrelBaseRadius;
    const barrelBasePosition = new Vector2( barrelBaseX, 0 );

    const barrelBaseShape = new Shape().circle( barrelBasePosition, barrelBaseRadius );

    const barrelNozzleShape = new Shape();
    barrelNozzleShape.moveTo( barrelBaseX, -barrelBaseRadius );
    barrelNozzleShape.lineTo( BARREL_LENGTH_AFTER_ORIGIN, -0.5 * BARREL_NOZZLE_WIDTH );
    barrelNozzleShape.lineTo( BARREL_LENGTH_AFTER_ORIGIN, 0.5 * BARREL_NOZZLE_WIDTH );
    barrelNozzleShape.lineTo( barrelBaseX, barrelBaseRadius );

    const barrelShape = barrelBaseShape.shapeUnion( barrelNozzleShape );

    const barrelFillGradient = new LinearGradient( 0, -barrelBaseRadius, 0, barrelBaseRadius );
    barrelFillGradient.addColorStop( 0, barrelFillDarkColorProperty );
    barrelFillGradient.addColorStop( 0.4, barrelFillColorProperty );
    barrelFillGradient.addColorStop( 0.6, barrelFillColorProperty );
    barrelFillGradient.addColorStop( 1, barrelFillDarkColorProperty );

    const barrel = new Path( barrelShape, {
      fill: barrelFillGradient,
      stroke: PDLColors.launcherStrokeColorProperty
    } );

    const launcherEndRectWidth = 1.2 * BARREL_NOZZLE_WIDTH;
    const launcherEndRectLength = 0.12 * launcherEndRectWidth;

    const launcherEndRect = new Rectangle(
      BARREL_LENGTH_AFTER_ORIGIN - 0.5 * launcherEndRectLength,
      -0.5 * launcherEndRectWidth,
      launcherEndRectLength,
      launcherEndRectWidth, {
        fill: barrelFillDarkColorProperty,
        stroke: PDLColors.launcherStrokeColorProperty,
        lineWidth: 1,
        cornerRadius: 0.1 * launcherEndRectLength
      }
    );

    return [ barrel, launcherEndRect ];
  }

  private launcherFrameBackGraphicsForType( presetLauncher: number ): Node[] {
    const frameBackground = new Path( this.guideRailInnerShape(), {
      fill: PDLColors.launcherFrameBackgroundColorProperty
    } );

    const fillColorProperty = PDLColors.launcherFillColorProperties[ presetLauncher - 1 ];
    const frameFillColorProperty = new DerivedProperty( [ fillColorProperty ],
      color => color.darkerColor( 0.8 ) );
    const frameFillDarkColorProperty = new DerivedProperty( [ frameFillColorProperty ],
      color => color.darkerColor( 0.8 ) );
    const frameFillDarkerColorProperty = new DerivedProperty( [ frameFillDarkColorProperty ],
      color => color.darkerColor( 0.8 ) );

    const FRAME_BAR_WIDTH = 4;

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
    supportBarFillGradient.addColorStop( 0, frameFillDarkerColorProperty );
    supportBarFillGradient.addColorStop( 0.4, frameFillDarkColorProperty );
    supportBarFillGradient.addColorStop( 0.6, frameFillDarkColorProperty );
    supportBarFillGradient.addColorStop( 1, frameFillDarkerColorProperty );

    const supportBarRect = new Shape().rect(
      SUPPORT_BAR_CENTER_X - 0.5 * SUPPORT_BAR_WIDTH,
      0.5 * ( GUIDE_SLOT_OUTER_RADIUS + GUIDE_RAIL_OUTER_RADIUS ),
      SUPPORT_BAR_WIDTH,
      SUPPORT_BAR_HEIGHT );
    const supportBarShape = supportBarRect.shapeDifference( this.guideRailOuterShape() );

    const supportBar = new Path( supportBarShape, {
      fill: supportBarFillGradient,
      stroke: PDLColors.launcherStrokeColorProperty
    } );

    return [ supportBar, frameBackground, frameBarTop, frameBarBottom ];
  }

  protected launcherFrameFrontGraphicsForType( presetLauncher: number, outerRadiusCutoff = 0 ): Node[] {

    const fillColorProperty = PDLColors.launcherFillColorProperties[ presetLauncher - 1 ];
    const frameFillColorProperty = new DerivedProperty( [ fillColorProperty ],
      color => color.darkerColor( 0.8 ) );
    const frameFillDarkColorProperty = new DerivedProperty( [ frameFillColorProperty ],
      color => color.darkerColor( 0.8 ) );

    const guideRailOuterShape = this.guideRailOuterShape( outerRadiusCutoff );
    const guideRailShape = guideRailOuterShape.shapeDifference( this.guideRailInnerShape() );

    const guideSlotOuterShape = new Shape().arc( 0, 0, GUIDE_SLOT_OUTER_RADIUS, GUIDE_SLOT_MIN_ANGLE, GUIDE_SLOT_MAX_ANGLE )
      .lineTo( 0, 0 ).close();
    const guideSlotInnerShape = new Shape().arc( 0, 0, GUIDE_SLOT_INNER_RADIUS, GUIDE_SLOT_MIN_ANGLE, GUIDE_SLOT_MAX_ANGLE )
      .lineTo( 0, 0 ).close();

    // Add the circular end caps to the guide slot
    const guideRailSlotTopEndPosition = new Vector2( BARREL_LENGTH_BEFORE_ORIGIN, 0 ).rotate( GUIDE_SLOT_MIN_ANGLE );
    const guideRailSlotBottomEndPosition = new Vector2( BARREL_LENGTH_BEFORE_ORIGIN, 0 ).rotate( GUIDE_SLOT_MAX_ANGLE );

    // TODO: Why can't this be 0.5? - see https://github.com/phetsims/projectile-data-lab/issues/7
    const guideRailSlotTopEndCap = new Shape().circle( guideRailSlotTopEndPosition.x, guideRailSlotTopEndPosition.y,
      0.50001 * GUIDE_SLOT_WIDTH );
    const guideRailSlotBottomEndCap = new Shape().circle( guideRailSlotBottomEndPosition.x, guideRailSlotBottomEndPosition.y,
      0.50001 * GUIDE_SLOT_WIDTH );

    const guideSlotShape = guideSlotOuterShape.shapeDifference( guideSlotInnerShape )
      .shapeUnion( guideRailSlotTopEndCap ).shapeUnion( guideRailSlotBottomEndCap );

    const guideRailWithSlotShape = guideRailShape.shapeDifference( guideSlotShape );

    const guideRailFillGradient = new RadialGradient( 0, 0, GUIDE_RAIL_INNER_RADIUS, 0, 0, GUIDE_RAIL_OUTER_RADIUS );
    guideRailFillGradient.addColorStop( 0, frameFillColorProperty );
    guideRailFillGradient.addColorStop( 0.7, frameFillColorProperty );
    guideRailFillGradient.addColorStop( 1, frameFillDarkColorProperty );

    const guideRail = new Path( guideRailWithSlotShape, {
      fill: guideRailFillGradient,
      stroke: PDLColors.launcherStrokeColorProperty
    } );

    return [ guideRail ];
  }

  private guideRailInnerShape(): Shape {
    return new Shape().arc( 0, 0, GUIDE_RAIL_INNER_RADIUS, GUIDE_RAIL_MIN_ANGLE, GUIDE_RAIL_MAX_ANGLE )
      .lineTo( 0, 0 ).close();
  }

  private guideRailOuterShape( outerRadiusCutoff = 0 ): Shape {
    return new Shape().arc( 0, 0, GUIDE_RAIL_OUTER_RADIUS - outerRadiusCutoff, GUIDE_RAIL_MIN_ANGLE, GUIDE_RAIL_MAX_ANGLE )
      .lineTo( 0, 0 ).close();
  }
}

projectileDataLab.register( 'LauncherNode', LauncherNode );
// Copyright 2023, University of Colorado Boulder

import { LinearGradient, Node, NodeOptions, Path, RadialGradient, Rectangle } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLColors from '../PDLColors.js';
import TProperty from '../../../../axon/js/TProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Shape } from '../../../../kite/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Animation from '../../../../twixt/js/Animation.js';
import LauncherFlashNode from '../../common-vsm/view/LauncherFlashNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Easing from '../../../../twixt/js/Easing.js';

/**
 * The LauncherNode is the visual representation of the projectile launcher. It contains a launcher, frame and a stand.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = {
  isIcon?: boolean;
};
type LauncherNodeOptions = SelfOptions & NodeOptions;

export const BARREL_LENGTH_BEFORE_ORIGIN = 90;
const BARREL_LENGTH_AFTER_ORIGIN = 15;

const BARREL_BASE_WIDTH = 45;
const BARREL_NOZZLE_WIDTH = 28;

const ANGLE_PAST_BOTTOM_VERTICAL = 15;
const ANGLE_PAST_TOP_HORIZONTAL = 35;

const GUIDE_RAIL_WIDTH = 18;
const GUIDE_RAIL_BARREL_OVERLAP = 1;

const GUIDE_RAIL_INNER_RADIUS = BARREL_LENGTH_BEFORE_ORIGIN - GUIDE_RAIL_BARREL_OVERLAP;
export const GUIDE_RAIL_OUTER_RADIUS = GUIDE_RAIL_INNER_RADIUS + GUIDE_RAIL_WIDTH;

// positive x-direction is zero, clockwise is positive
// Min angle is the bottom of the guide rail, max angle is the top of the guide rail
export const GUIDE_RAIL_MIN_ANGLE = Utils.toRadians( 90 - ANGLE_PAST_BOTTOM_VERTICAL );
export const GUIDE_RAIL_MAX_ANGLE = Utils.toRadians( 180 + ANGLE_PAST_TOP_HORIZONTAL );

const SUPPORT_BAR_CENTER_X = -20;
const SUPPORT_BAR_WIDTH = 30;
const SUPPORT_BAR_HEIGHT = 200;

export default class LauncherNode extends Node {

  protected readonly launcherBarrel: Node;
  protected readonly launcherFrameFront: Node;

  private readonly launcherBarrelGraphics: Node;
  private readonly launcherFrameBack: Node;

  private barrelRotationAnimation?: Animation;

  public constructor( private readonly modelViewTransform: ModelViewTransform2,
                      private readonly meanLaunchAngleProperty: TProperty<number>,
                      launcherHeightProperty: TProperty<number>,
                      mysteryLauncherProperty: TProperty<number>,
                      providedOptions: LauncherNodeOptions ) {

    const launcherX = modelViewTransform.modelToViewX( 0 );
    const launcherY = modelViewTransform.modelToViewY( 0 );

    const defaultOptions = { x: launcherX, y: launcherY, isIcon: false };
    const options = optionize<LauncherNodeOptions, SelfOptions, NodeOptions>()( defaultOptions, providedOptions );
    super( options );

    this.launcherBarrel = new Node();
    this.launcherBarrelGraphics = new Node();
    this.launcherBarrel.addChild( this.launcherBarrelGraphics );

    this.launcherFrameBack = new Node();
    this.launcherFrameFront = new Node();

    this.addChild( this.launcherFrameBack );
    this.addChild( this.launcherBarrel );
    this.addChild( this.launcherFrameFront );

    // TODO: Consider a third property - currentAngleProperty - that knows how to handle the mean and animating launcher rotation - see https://github.com/phetsims/projectile-data-lab/issues/7
    this.meanLaunchAngleProperty.link( meanLaunchAngle => {
      this.launcherBarrel.setRotation( Utils.toRadians( -meanLaunchAngle ) );
    } );

    launcherHeightProperty.link( launcherHeight => {
      this.updateLauncherHeight( launcherHeight );
    } );

    mysteryLauncherProperty.link( mysteryLauncher => {
      this.updateMysteryLauncher( mysteryLauncher, options.isIcon );
    } );
  }

  // TODO: Check this for memory leaks - see https://github.com/phetsims/projectile-data-lab/issues/7
  public playLaunchAnimation( angle: number ): void {

    this.launcherBarrel.setRotation( Utils.toRadians( -angle ) );

    if ( this.barrelRotationAnimation ) {
      this.barrelRotationAnimation.stop();
      this.barrelRotationAnimation = undefined;
    }

    const rotationProperty = new NumberProperty( this.launcherBarrel.rotation );
    rotationProperty.lazyLink( rotation => {
      this.launcherBarrel.setRotation( rotation );
    } );

    this.barrelRotationAnimation = new Animation( {
      duration: 0.5,
      targets: [ {
        property: rotationProperty,
        from: this.launcherBarrel.rotation,
        to: Utils.toRadians( -this.meanLaunchAngleProperty.value ),
        easing: Easing.polynomialEaseOut( 1.5 )
      } ]
    } );

    this.barrelRotationAnimation.start();

    const launcherFlashNode = new LauncherFlashNode( {
      x: BARREL_LENGTH_AFTER_ORIGIN, y: 0,
      opacity: 0
    } );

    this.launcherBarrel.addChild( launcherFlashNode );
    launcherFlashNode.moveToBack();

    const scaleProperty = new NumberProperty( 1 );
    scaleProperty.lazyLink( scale => {
      launcherFlashNode.setScaleMagnitude( scale );
    } );

    const launcherFlashAnimation = new Animation( {
      duration: 0.4,
      targets: [ {
        property: scaleProperty,
        from: 1.2,
        to: 10,
        easing: Easing.QUADRATIC_OUT
      }, {
        property: launcherFlashNode.opacityProperty,
        from: 0.4,
        to: 0,
        easing: Easing.QUADRATIC_OUT
      } ]
    } );

    launcherFlashAnimation.endedEmitter.addListener( () => {
      this.launcherBarrel.removeChild( launcherFlashNode );
    } );

    launcherFlashAnimation.start();
  }

  protected updateMysteryLauncher( type: number, isIcon = false ): void {
    this.launcherBarrelGraphics.children = this.launcherBarrelGraphicsForType( type );
    this.launcherFrameBack.children = this.launcherFrameBackGraphicsForType( type, isIcon );
    this.launcherFrameFront.children = this.launcherFrameFrontGraphicsForType( type );
  }

  private updateLauncherHeight( height: number ): void {
    this.y = this.modelViewTransform.modelToViewY( height );
  }

  private launcherBarrelGraphicsForType( mysteryLauncher: number ): Node[] {
    const barrelPrimaryColorProperty = PDLColors.launcherFillColorProperties[ mysteryLauncher - 1 ].primary;
    const barrelPrimaryDarkColorProperty = new DerivedProperty( [ barrelPrimaryColorProperty ],
      color => color.darkerColor( 0.8 ) );
    const barrelSecondaryColorProperty = PDLColors.launcherFillColorProperties[ mysteryLauncher - 1 ].secondary;

    const barrelBaseRadius = 0.5 * BARREL_BASE_WIDTH;
    const barrelBaseX = -BARREL_LENGTH_BEFORE_ORIGIN + barrelBaseRadius;
    const barrelBasePosition = new Vector2( barrelBaseX, 0 );

    const barrelBaseShape = new Shape().circle( barrelBasePosition, barrelBaseRadius );

    const barrelNozzleShape = new Shape();
    barrelNozzleShape.moveTo( barrelBaseX, -barrelBaseRadius );
    barrelNozzleShape.lineTo( BARREL_LENGTH_AFTER_ORIGIN, -0.5 * BARREL_NOZZLE_WIDTH );
    barrelNozzleShape.lineTo( BARREL_LENGTH_AFTER_ORIGIN, 0.5 * BARREL_NOZZLE_WIDTH );
    barrelNozzleShape.lineTo( barrelBaseX, barrelBaseRadius );

    const barrelShape = barrelBaseShape.shapeUnion( barrelNozzleShape );

    const barrelFillGradient = new LinearGradient( 0, -barrelBaseRadius, 0, barrelBaseRadius );
    barrelFillGradient.addColorStop( 0, barrelPrimaryDarkColorProperty );
    barrelFillGradient.addColorStop( 0.4, barrelPrimaryColorProperty );
    barrelFillGradient.addColorStop( 0.6, barrelPrimaryColorProperty );
    barrelFillGradient.addColorStop( 1, barrelPrimaryDarkColorProperty );

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
        fill: barrelSecondaryColorProperty,
        stroke: PDLColors.launcherStrokeColorProperty,
        lineWidth: 1,
        cornerRadius: 0.1 * launcherEndRectLength
      }
    );

    return [ barrel, launcherEndRect ];
  }

  private launcherFrameBackGraphicsForType( mysteryLauncher: number, isIcon: boolean ): Node[] {
    const frameBackground = new Path( this.guideRailInnerShape(), {
      fill: PDLColors.launcherFrameBackgroundColorProperty
    } );

    const fillColorProperty = PDLColors.launcherFillColorProperties[ mysteryLauncher - 1 ].secondary;
    const frameFillColorProperty = new DerivedProperty( [ fillColorProperty ],
      color => color.darkerColor( 0.8 ) );
    const frameFillDarkColorProperty = new DerivedProperty( [ frameFillColorProperty ],
      color => color.darkerColor( 0.8 ) );
    const frameFillDarkerColorProperty = new DerivedProperty( [ frameFillDarkColorProperty ],
      color => color.darkerColor( 0.8 ) );

    const FRAME_BAR_WIDTH = 4;

    const frameBarTop = new Rectangle( 0, -FRAME_BAR_WIDTH, GUIDE_RAIL_OUTER_RADIUS, FRAME_BAR_WIDTH, {
      fill: frameFillColorProperty,
      stroke: PDLColors.launcherStrokeColorProperty
    } );

    const frameBarBottom = new Rectangle( 0, 0, GUIDE_RAIL_OUTER_RADIUS, FRAME_BAR_WIDTH, {
      fill: frameFillColorProperty,
      stroke: PDLColors.launcherStrokeColorProperty
    } );

    frameBarTop.rotateAround( Vector2.ZERO, GUIDE_RAIL_MAX_ANGLE );
    frameBarBottom.rotateAround( Vector2.ZERO, GUIDE_RAIL_MIN_ANGLE );

    const content = [];

    // If the launcher is an icon, do not render the support bar
    if ( !isIcon ) {
      const supportBarFillGradient = new LinearGradient( -0.5 * SUPPORT_BAR_WIDTH, 0, 0.5 * SUPPORT_BAR_WIDTH, 0 );
      supportBarFillGradient.addColorStop( 0, frameFillDarkerColorProperty );
      supportBarFillGradient.addColorStop( 0.4, frameFillDarkColorProperty );
      supportBarFillGradient.addColorStop( 0.6, frameFillDarkColorProperty );
      supportBarFillGradient.addColorStop( 1, frameFillDarkerColorProperty );

      const supportBarRect = new Shape().rect(
        SUPPORT_BAR_CENTER_X - 0.5 * SUPPORT_BAR_WIDTH,
        0.5 * ( GUIDE_RAIL_INNER_RADIUS + GUIDE_RAIL_OUTER_RADIUS ),
        SUPPORT_BAR_WIDTH,
        SUPPORT_BAR_HEIGHT );
      const supportBarShape = supportBarRect.shapeDifference( this.guideRailOuterShape() );

      const supportBar = new Path( supportBarShape, {
        fill: supportBarFillGradient,
        stroke: PDLColors.launcherStrokeColorProperty
      } );

      content.push( supportBar );
    }

    return [ ...content, frameBackground, frameBarTop, frameBarBottom ];
  }

  protected launcherFrameFrontGraphicsForType( mysteryLauncher: number, outerRadiusCutoff = 0 ): Node[] {

    const fillColorProperty = PDLColors.launcherFillColorProperties[ mysteryLauncher - 1 ].secondary;
    const frameFillColorProperty = new DerivedProperty( [ fillColorProperty ],
      color => color.darkerColor( 0.8 ) );
    const frameFillDarkColorProperty = new DerivedProperty( [ frameFillColorProperty ],
      color => color.darkerColor( 0.8 ) );

    const guideRailOuterShape = this.guideRailOuterShape( outerRadiusCutoff );
    const guideRailShape = guideRailOuterShape.shapeDifference( this.guideRailInnerShape() );

    const guideRailFillGradient = new RadialGradient( 0, 0, GUIDE_RAIL_INNER_RADIUS, 0, 0, GUIDE_RAIL_OUTER_RADIUS );
    guideRailFillGradient.addColorStop( 0, frameFillDarkColorProperty );
    guideRailFillGradient.addColorStop( 0.3, frameFillColorProperty );
    guideRailFillGradient.addColorStop( 0.7, frameFillColorProperty );
    guideRailFillGradient.addColorStop( 1, frameFillDarkColorProperty );

    const guideRail = new Path( guideRailShape, {
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
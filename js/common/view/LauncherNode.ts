// Copyright 2023-2024, University of Colorado Boulder

/**
 * The LauncherNode is the visual representation of the projectile launcher. It contains a launcher, frame and a stand.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Circle, Color, Image, LinearGradient, Node, NodeOptions, Path, RadialGradient, Rectangle } from '../../../../scenery/js/imports.js';
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
import Easing from '../../../../twixt/js/Easing.js';
import PDLText from './PDLText.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Field from '../model/Field.js';
import Launcher from '../model/Launcher.js';
import launcherPattern1_svg from '../../../images/launcherPattern1_svg.js';
import launcherPattern2_svg from '../../../images/launcherPattern2_svg.js';
import launcherPattern3_svg from '../../../images/launcherPattern3_svg.js';
import launcherPattern4_svg from '../../../images/launcherPattern4_svg.js';
import launcherPattern5_svg from '../../../images/launcherPattern5_svg.js';
import launcherPattern6_svg from '../../../images/launcherPattern6_svg.js';

type SelfOptions = {
  isIcon?: boolean;
};
export type LauncherNodeOptions = SelfOptions & NodeOptions;

export const BARREL_LENGTH_BEFORE_ORIGIN = 85;
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

// Cache the darker color properties to avoid creating new ones for each launcher, to avoid a memory leak, see https://github.com/phetsims/projectile-data-lab/issues/24
const darkerColorCacheMap = new Map<TReadOnlyProperty<Color>, TReadOnlyProperty<Color>>();

export default class LauncherNode extends Node {

  protected readonly launcherBarrel: Node;
  protected readonly launcherFrameFront: Node;

  private readonly launcherBarrelGraphics: Node;
  private readonly launcherFrameBack: Node;

  private barrelRotationAnimation: Animation | null = null;
  protected readonly labelNode: Node;

  public constructor( private readonly modelViewTransform: ModelViewTransform2,
                      private readonly meanLaunchAngleProperty: TProperty<number>,
                      launcherHeightProperty: TProperty<number>,
                      mysteryLauncher: TProperty<Launcher>,
                      fieldProperty: TReadOnlyProperty<Field> | null,
                      providedOptions?: LauncherNodeOptions ) {

    const launcherX = modelViewTransform.modelToViewX( 0 );
    const launcherY = modelViewTransform.modelToViewY( 0 );

    const options = optionize<LauncherNodeOptions, SelfOptions, NodeOptions>()( { x: launcherX, y: launcherY, isIcon: false }, providedOptions );
    super( options );

    const labelText = new PDLText( new DerivedProperty( [ mysteryLauncher ], mysteryLauncher => Utils.toFixed( mysteryLauncher.launcherNumber, 0 ) ), {
      fontSize: 18
    } );
    const labelPanel = new Circle( Math.max( labelText.width, labelText.height ) * 0.65, {
      stroke: 'black',
      lineWidth: 1
    } );
    labelText.center = labelPanel.center;

    this.labelNode = new Node( {
      children: [ labelPanel, labelText ],
      x: -63
    } );

    this.launcherBarrel = new Node();
    this.launcherBarrelGraphics = new Node();
    this.launcherBarrel.addChild( this.launcherBarrelGraphics );

    this.launcherFrameBack = new Node();
    this.launcherFrameFront = new Node();

    this.addChild( this.launcherFrameBack );
    this.addChild( this.launcherBarrel );
    this.addChild( this.launcherFrameFront );

    this.meanLaunchAngleProperty.link( meanLaunchAngle => {
      this.cancelBarrelRotationAnimation();
      this.launcherBarrel.setRotation( Utils.toRadians( -meanLaunchAngle ) );
    } );

    launcherHeightProperty.link( launcherHeight => {
      this.updateLauncherHeight( launcherHeight );
    } );

    mysteryLauncher.link( mysteryLauncher => {
      this.updateMysteryLauncher( mysteryLauncher.launcherNumber, options.isIcon );
      labelPanel.fill = PDLColors.mysteryLauncherColorProfiles[ mysteryLauncher.launcherNumber - 1 ].labelPanelFillProperty;
    } );

    fieldProperty && fieldProperty.link( () => {
      this.cancelBarrelRotationAnimation();
      this.launcherBarrel.setRotation( Utils.toRadians( -this.meanLaunchAngleProperty.value ) );
    } );
  }

  private cancelBarrelRotationAnimation(): void {
    if ( this.barrelRotationAnimation ) {
      this.barrelRotationAnimation.stop();
      this.barrelRotationAnimation = null;
    }
  }

  // TODO: Check this for memory leaks - see https://github.com/phetsims/projectile-data-lab/issues/24
  public playLaunchAnimation( angle: number ): void {

    this.launcherBarrel.setRotation( Utils.toRadians( -angle ) );
    this.cancelBarrelRotationAnimation();

    this.barrelRotationAnimation = new Animation( {
      duration: 0.5,
      targets: [ {
        getValue: () => this.launcherBarrel.rotation,
        setValue: ( rotation: number ) => { this.launcherBarrel.rotation = rotation;},
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

    const launcherFlashAnimation = new Animation( {
      duration: 0.4,
      targets: [ {
        getValue: () => launcherFlashNode.getScaleVector().getMagnitude(),
        setValue: ( scale: number ) => { launcherFlashNode.setScaleMagnitude( scale ); },
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

  protected updateMysteryLauncher( mysteryLauncherNumber: number, isIcon = false ): void {
    this.launcherBarrelGraphics.children = this.launcherBarrelGraphicsForType( mysteryLauncherNumber, isIcon );
    this.launcherFrameBack.children = this.launcherFrameBackGraphicsForType( mysteryLauncherNumber, isIcon );
    this.launcherFrameFront.children = this.launcherFrameFrontGraphicsForType( mysteryLauncherNumber );
  }

  private updateLauncherHeight( height: number ): void {
    this.y = this.modelViewTransform.modelToViewY( height );
  }

  private getCachedDarkerColorProperty( colorProperty: TReadOnlyProperty<Color> ): TReadOnlyProperty<Color> {
    if ( !darkerColorCacheMap.has( colorProperty ) ) {
      darkerColorCacheMap.set( colorProperty, new DerivedProperty( [ colorProperty ], color => color.darkerColor( 0.8 ) ) );
    }
    return darkerColorCacheMap.get( colorProperty )!;
  }

  private launcherBarrelGraphicsForType( mysteryLauncherNumber: number, isIcon: boolean ): Node[] {
    const barrelColorProperty = PDLColors.mysteryLauncherColorProfiles[ mysteryLauncherNumber - 1 ].barrelFillProperty;
    const barrelDarkColorProperty = this.getCachedDarkerColorProperty( barrelColorProperty );

    const nozzleColorProperty = PDLColors.mysteryLauncherColorProfiles[ mysteryLauncherNumber - 1 ].nozzleFillProperty;

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
    barrelFillGradient.addColorStop( 0, barrelDarkColorProperty );
    barrelFillGradient.addColorStop( 0.4, barrelColorProperty );
    barrelFillGradient.addColorStop( 0.6, barrelColorProperty );
    barrelFillGradient.addColorStop( 1, barrelDarkColorProperty );

    const barrel = new Path( barrelShape, {
      fill: barrelFillGradient
    } );

    const barrelBorder = new Path( barrelShape, {
      stroke: PDLColors.launcherStrokeProperty
    } );

    const launcherEndRectWidth = 1.2 * BARREL_NOZZLE_WIDTH;
    const launcherEndRectLength = 0.12 * launcherEndRectWidth;

    const launcherEndRect = new Rectangle(
      BARREL_LENGTH_AFTER_ORIGIN - 0.5 * launcherEndRectLength,
      -0.5 * launcherEndRectWidth,
      launcherEndRectLength,
      launcherEndRectWidth, {
        fill: nozzleColorProperty,
        stroke: PDLColors.launcherStrokeProperty,
        lineWidth: 1,
        cornerRadius: 0.1 * launcherEndRectLength
      }
    );

    const patternImages = [
      launcherPattern1_svg,
      launcherPattern2_svg,
      launcherPattern3_svg,
      launcherPattern4_svg,
      launcherPattern5_svg,
      launcherPattern6_svg
    ];

    const svgPattern = patternImages[ mysteryLauncherNumber - 1 ];
    let patternImage = null;
    if ( svgPattern ) {
      patternImage = new Image( svgPattern );

      assert && assert( Number.isFinite( patternImage.width ) && Number.isFinite( patternImage.height ),
        'patternImage width and height must be finite, current values are: ' + patternImage.width + ', ' +
        patternImage.height + ', for mysteryLauncher: ' + mysteryLauncherNumber );

      const imageScale = ( BARREL_LENGTH_BEFORE_ORIGIN + BARREL_LENGTH_AFTER_ORIGIN ) / patternImage.width;
      patternImage.scale( imageScale );
      patternImage.right = BARREL_LENGTH_AFTER_ORIGIN;
      patternImage.centerY = 0;
    }

    return [ barrel, ...( patternImage ? [ patternImage ] : [] ), barrelBorder, ...( isIcon ? [] : [ this.labelNode ] ), launcherEndRect ];
  }

  private launcherFrameBackGraphicsForType( mysteryLauncher: number, isIcon: boolean ): Node[] {
    const frameBackground = new Path( this.guideRailInnerShape(), {
      fill: PDLColors.launcherBackFillProperty
    } );

    const fillColorProperty = PDLColors.mysteryLauncherColorProfiles[ mysteryLauncher - 1 ].frameFillProperty;
    const frameFillColorProperty = this.getCachedDarkerColorProperty( fillColorProperty );
    const frameFillDarkColorProperty = this.getCachedDarkerColorProperty( frameFillColorProperty );
    const frameFillDarkerColorProperty = this.getCachedDarkerColorProperty( frameFillDarkColorProperty );

    const FRAME_BAR_WIDTH = 4;

    const frameBarTop = new Rectangle( 0, -FRAME_BAR_WIDTH, GUIDE_RAIL_OUTER_RADIUS, FRAME_BAR_WIDTH, {
      fill: frameFillColorProperty,
      stroke: PDLColors.launcherStrokeProperty
    } );

    const frameBarBottom = new Rectangle( 0, 0, GUIDE_RAIL_OUTER_RADIUS, FRAME_BAR_WIDTH, {
      fill: frameFillColorProperty,
      stroke: PDLColors.launcherStrokeProperty
    } );

    frameBarTop.rotateAround( Vector2.ZERO, GUIDE_RAIL_MAX_ANGLE );
    frameBarBottom.rotateAround( Vector2.ZERO, GUIDE_RAIL_MIN_ANGLE );

    const supportBarHeight = isIcon ? 20 : SUPPORT_BAR_HEIGHT;

    // If the launcher is an icon, do not render the support bar
    const supportBarFillGradient = new LinearGradient( -0.5 * SUPPORT_BAR_WIDTH, 0, 0.5 * SUPPORT_BAR_WIDTH, 0 );
    supportBarFillGradient.addColorStop( 0, frameFillDarkerColorProperty );
    supportBarFillGradient.addColorStop( 0.4, frameFillDarkColorProperty );
    supportBarFillGradient.addColorStop( 0.6, frameFillDarkColorProperty );
    supportBarFillGradient.addColorStop( 1, frameFillDarkerColorProperty );

    const supportBarRect = new Shape().rect(
      SUPPORT_BAR_CENTER_X - 0.5 * SUPPORT_BAR_WIDTH,
      0.5 * ( GUIDE_RAIL_INNER_RADIUS + GUIDE_RAIL_OUTER_RADIUS ),
      SUPPORT_BAR_WIDTH,
      supportBarHeight );
    const supportBarShape = supportBarRect.shapeDifference( this.guideRailOuterShape() );

    const supportBar = new Path( supportBarShape, {
      fill: supportBarFillGradient,
      stroke: PDLColors.launcherStrokeProperty
    } );

    return [ supportBar, frameBackground, frameBarTop, frameBarBottom ];
  }

  protected launcherFrameFrontGraphicsForType( mysteryLauncher: number, outerRadiusCutoff = 0 ): Node[] {

    const fillColorProperty = PDLColors.mysteryLauncherColorProfiles[ mysteryLauncher - 1 ].frameFillProperty;
    const frameFillColorProperty = this.getCachedDarkerColorProperty( fillColorProperty );
    const frameFillDarkColorProperty = this.getCachedDarkerColorProperty( frameFillColorProperty );

    const guideRailOuterShape = this.guideRailOuterShape( outerRadiusCutoff );
    const guideRailShape = guideRailOuterShape.shapeDifference( this.guideRailInnerShape() );

    const guideRailFillGradient = new RadialGradient( 0, 0, GUIDE_RAIL_INNER_RADIUS, 0, 0, GUIDE_RAIL_OUTER_RADIUS );
    guideRailFillGradient.addColorStop( 0, frameFillDarkColorProperty );
    guideRailFillGradient.addColorStop( 0.3, frameFillColorProperty );
    guideRailFillGradient.addColorStop( 0.7, frameFillColorProperty );
    guideRailFillGradient.addColorStop( 1, frameFillDarkColorProperty );

    const guideRail = new Path( guideRailShape, {
      fill: guideRailFillGradient,
      stroke: PDLColors.launcherStrokeProperty
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
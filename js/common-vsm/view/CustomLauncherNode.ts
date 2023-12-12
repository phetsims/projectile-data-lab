// Copyright 2023, University of Colorado Boulder

import { NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import TProperty from '../../../../axon/js/TProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LauncherNode, { BARREL_LENGTH_BEFORE_ORIGIN, GUIDE_RAIL_MAX_ANGLE, GUIDE_RAIL_MIN_ANGLE, GUIDE_RAIL_OUTER_RADIUS } from '../../common/view/LauncherNode.js';
import { CustomLauncherType } from '../model/CustomLauncherType.js';
import { Node, Image } from '../../../../scenery/js/imports.js';
import spring_png from '../../../images/spring_png.js';
import pressureWithoutNeedle_png from '../../../images/pressureWithoutNeedle_png.js';
import pressureNeedle_png from '../../../images/pressureNeedle_png.js';
import explosion_png from '../../../images/explosion_png.js';
import PDLColors from '../../common/PDLColors.js';
import { Shape } from '../../../../kite/js/imports.js';
import { AngleForConfiguration, LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import Utils from '../../../../dot/js/Utils.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PDLConstants from '../../common/PDLConstants.js';
import gear_png from '../../../images/gear_png.js';

/**
 * The CustomLauncherNode is the visual representation of the customizable launcher. It contains a barrel, frame and a stand.
 * It also contains a symbol that represents the type of launcher. The symbol is a spring for the spring launcher, a pressure
 * gauge for the pressure launcher, and an explosion for the explosion launcher.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type CustomLauncherNodeOptions = SelfOptions & NodeOptions;

// This is how much of the outer guide rail is cut off to make room to show the angle stabilizers.
const GUIDE_RAIL_OUTER_CUTOFF = 13;
const LAUNCH_ANGLE_LIMITER_LENGTH = 17;
const LAUNCH_ANGLE_LIMITER_WIDTH = 5;

export default class CustomLauncherNode extends LauncherNode {

  private readonly angleStabilizersContainer = new Node();

  public constructor( modelViewTransform: ModelViewTransform2,
                      launcherConfigurationProperty: TProperty<LauncherConfiguration>,
                      launcherAngleProperty: TProperty<number>,
                      launcherHeightProperty: TProperty<number>,
                      isLauncherCustomProperty: TProperty<boolean>,
                      presetLauncherProperty: TProperty<number>,
                      customLauncherTypeProperty: TProperty<CustomLauncherType>,
                      angleStabilizerProperty: TProperty<number>,
                      providedOptions: CustomLauncherNodeOptions ) {

    super( modelViewTransform, launcherAngleProperty, launcherHeightProperty, presetLauncherProperty, providedOptions );

    const launcherTypeIcon = new Image( this.getImageKeyForCustomLauncherType( customLauncherTypeProperty.value ), {
      centerX: 0,
      centerY: 0
    } );

    const pressureNeedleIcon = new Image( pressureNeedle_png, { centerX: -11, centerY: 0, rotation: -Math.PI / 2 } );

    const launcherTypeIconContainer = new Node( {
      x: -0.7 * BARREL_LENGTH_BEFORE_ORIGIN,
      y: 0,
      children: [ launcherTypeIcon, pressureNeedleIcon ],
      visibleProperty: isLauncherCustomProperty,
      scale: 0.2,
      rotation: Math.PI / 2
    } );

    this.launcherBarrel.addChild( launcherTypeIconContainer );

    // Add the launch angle limiter - the piece sticking out of the back of the launcher.
    const launchAngleLimiter = new Rectangle( -BARREL_LENGTH_BEFORE_ORIGIN - LAUNCH_ANGLE_LIMITER_LENGTH, -0.5 * LAUNCH_ANGLE_LIMITER_WIDTH,
      LAUNCH_ANGLE_LIMITER_LENGTH, LAUNCH_ANGLE_LIMITER_WIDTH, {
        visibleProperty: isLauncherCustomProperty,
        fill: PDLColors.launcherFillColorProperties[ 0 ].primary,
        stroke: PDLColors.launcherStrokeColorProperty,
        cornerRadius: 2
      } );
    this.launcherBarrel.addChild( launchAngleLimiter );

    const customLauncherFrameFront = new Node( {
      visibleProperty: isLauncherCustomProperty
    } );
    const customLauncherFrameFrontGraphics = this.launcherFrameFrontGraphicsForType( 1, GUIDE_RAIL_OUTER_CUTOFF );
    customLauncherFrameFrontGraphics.forEach( graphic => customLauncherFrameFront.addChild( graphic ) );
    this.addChild( customLauncherFrameFront );

    this.addChild( this.angleStabilizersContainer );
    this.angleStabilizersContainer.moveToBack();
    this.angleStabilizersContainer.addChild( this.getAngleStabilizers( launcherConfigurationProperty.value, PDLConstants.ANGLE_STABILIZER_NUM_STANDARD_DEVIATIONS * angleStabilizerProperty.value ) );

    const gearImageScale = 0.2;
    const gearAngleInset = Utils.toRadians( 6 );
    const gearTopAngle = GUIDE_RAIL_MAX_ANGLE - gearAngleInset;
    const gearBottomAngle = GUIDE_RAIL_MIN_ANGLE + gearAngleInset;
    const gearToOriginDistance = GUIDE_RAIL_OUTER_RADIUS - 1.5 * GUIDE_RAIL_OUTER_CUTOFF;

    const gearTop = new Image( gear_png, { centerX: 0, centerY: 0, scale: gearImageScale } );
    const gearBottom = new Image( gear_png, { centerX: 0, centerY: 0, scale: gearImageScale } );

    const gearTopContainer = new Node( {
      visibleProperty: isLauncherCustomProperty,
      x: gearToOriginDistance * Math.cos( gearTopAngle ),
      y: gearToOriginDistance * Math.sin( gearTopAngle ),
      children: [ gearTop ]
    } );
    const gearBottomContainer = new Node( {
      visibleProperty: isLauncherCustomProperty,
      x: gearToOriginDistance * Math.cos( gearBottomAngle ),
      y: gearToOriginDistance * Math.sin( gearBottomAngle ),
      children: [ gearBottom ]
    } );

    this.addChild( gearTopContainer );
    this.addChild( gearBottomContainer );

    //TODO: Do we want to add a 'push' effect on the launcher when reducing the angle stabilizer gap? - see https://github.com/phetsims/projectile-data-lab/issues/7
    Multilink.multilink( [ launcherConfigurationProperty, angleStabilizerProperty ], ( launcherConfiguration, angleStabilizer ) => {
      const launcherAngle = AngleForConfiguration( launcherConfiguration );
      const rotationFactor = 0.4;
      gearTopContainer.rotation = rotationFactor * ( launcherAngle + angleStabilizer );
      gearBottomContainer.rotation = rotationFactor * ( launcherAngle - angleStabilizer );
      this.angleStabilizersContainer.children = [ this.getAngleStabilizers( launcherConfiguration, PDLConstants.ANGLE_STABILIZER_NUM_STANDARD_DEVIATIONS * angleStabilizer ) ];
    } );

    isLauncherCustomProperty.link( ( isCustom, prevIsCustom ) => {
      // TODO: Confirm that this is the right way to handle this - see https://github.com/phetsims/projectile-data-lab/issues/7
      // If setting to custom, set the graphics for preset launcher 1
      // If the second
      if ( isCustom ) { // && ( !prevIsCustom || prevIsCustom === null ) ) {
        this.updatePresetLauncher( 1 );
        this.launcherFrameFront.opacity = 0.2; // Do not set invisible because of 60 degree launch.
      }
      else { //if ( !isCustom && prevIsCustom ) {
        this.updatePresetLauncher( presetLauncherProperty.value );
        this.launcherFrameFront.opacity = 1;
      }
    } );

    customLauncherTypeProperty.link( launcherType => {
      launcherTypeIcon.image = this.getImageKeyForCustomLauncherType( launcherType );
      launcherTypeIcon.rotation = launcherType === 'PRESSURE' ? -Math.PI / 2 : launcherType === 'EXPLOSION' ? Math.PI / 2 : 0;
      launcherTypeIcon.centerX = 0;
      launcherTypeIcon.centerY = 0;

      pressureNeedleIcon.visible = launcherType === 'PRESSURE';
    } );
  }

  private getAngleStabilizers( launcherConfiguration: LauncherConfiguration, separationWidth: number ): Node {
    // positive x-direction is zero, clockwise is positive;
    // Min angle is the bottom of the guide rail, max angle is the top of the guide rail
    const centralAngle = Utils.toRadians( 180 - AngleForConfiguration( launcherConfiguration ) );

    // The minimum gap is angle of an arc length LAUNCH_ANGLE_LIMITER_WIDTH at radius GUIDE_RAIL_OUTER_RADIUS
    const minimumStabilizerGap = LAUNCH_ANGLE_LIMITER_WIDTH / GUIDE_RAIL_OUTER_RADIUS;
    const angleOffsetRadians = 0.6 * minimumStabilizerGap + Utils.toRadians( separationWidth );
    const topInnerAngle = centralAngle + angleOffsetRadians;
    const bottomInnerAngle = centralAngle - angleOffsetRadians;

    const topInnerArc = new Shape().arc( 0, 0, GUIDE_RAIL_OUTER_RADIUS - GUIDE_RAIL_OUTER_CUTOFF, topInnerAngle, GUIDE_RAIL_MAX_ANGLE )
      .lineTo( 0, 0 ).close();
    const topOuterArc = new Shape().arc( 0, 0, GUIDE_RAIL_OUTER_RADIUS, topInnerAngle, GUIDE_RAIL_MAX_ANGLE )
      .lineTo( 0, 0 ).close();
    const topArc = topOuterArc.shapeDifference( topInnerArc );

    const bottomInnerArc = new Shape().arc( 0, 0, GUIDE_RAIL_OUTER_RADIUS - GUIDE_RAIL_OUTER_CUTOFF, GUIDE_RAIL_MIN_ANGLE, bottomInnerAngle )
      .lineTo( 0, 0 ).close();
    const bottomOuterArc = new Shape().arc( 0, 0, GUIDE_RAIL_OUTER_RADIUS, GUIDE_RAIL_MIN_ANGLE, bottomInnerAngle )
      .lineTo( 0, 0 ).close();
    const bottomArc = bottomOuterArc.shapeDifference( bottomInnerArc );

    const angleStabilizerTop = new Path( topArc, { fill: 'black' } );
    const angleStabilizerBottom = new Path( bottomArc, { fill: 'black' } );
    return new Node( { children: [ angleStabilizerTop, angleStabilizerBottom ] } );
  }

  private getImageKeyForCustomLauncherType( customLauncherType: CustomLauncherType ): HTMLImageElement {
    switch( customLauncherType ) {
      case 'SPRING':
        return spring_png;
      case 'PRESSURE':
        return pressureWithoutNeedle_png;
      default: //case 'EXPLOSION':
        return explosion_png;
    }
  }
}

projectileDataLab.register( 'CustomLauncherNode', CustomLauncherNode );
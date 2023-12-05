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
import pressure_png from '../../../images/pressure_png.js';
import explosion_png from '../../../images/explosion_png.js';
import PDLColors from '../../common/PDLColors.js';
import { Shape } from '../../../../kite/js/imports.js';
import { AngleForConfiguration, LauncherConfiguration } from '../../common/model/LauncherConfiguration.js';
import Utils from '../../../../dot/js/Utils.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PDLConstants from '../../common/PDLConstants.js';

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
const GUIDE_RAIL_OUTER_CUTOFF = 10.5;
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

    const launcherType = this.getImageKeyForCustomLauncherType( customLauncherTypeProperty.value );
    const launcherTypeSymbol = new Image( launcherType, {
      visibleProperty: isLauncherCustomProperty,
      scale: 0.22,
      rotation: Math.PI / 2
    } );
    launcherTypeSymbol.image = explosion_png;
    this.launcherBarrel.addChild( launcherTypeSymbol );

    // Add the launch angle limiter - the piece sticking out of the back of the launcher.
    const launchAngleLimiterLength = 19;
    const launchAngleLimiter = new Rectangle( -BARREL_LENGTH_BEFORE_ORIGIN - launchAngleLimiterLength, -0.5 * LAUNCH_ANGLE_LIMITER_WIDTH,
      launchAngleLimiterLength, LAUNCH_ANGLE_LIMITER_WIDTH, {
        fill: PDLColors.launcherFillColorProperties[ 0 ],
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

    // Move the guide rail bolt to the front so that it is not covered by the launcher frame.
    this.guideRailBolt.moveToFront();

    //TODO: Do we want to add a 'push' effect on the launcher when reducing the angle stabilizer gap? - see https://github.com/phetsims/projectile-data-lab/issues/7
    Multilink.multilink( [ launcherConfigurationProperty, angleStabilizerProperty ], ( launcherConfiguration, angleStabilizer ) => {
      this.angleStabilizersContainer.children = [ this.getAngleStabilizers( launcherConfiguration, PDLConstants.ANGLE_STABILIZER_NUM_STANDARD_DEVIATIONS * angleStabilizer ) ];
    } );

    isLauncherCustomProperty.link( ( isCustom, prevIsCustom ) => {
      if ( isCustom && ( !prevIsCustom || prevIsCustom === null ) ) {
        // Set the graphics for preset launcher 1 for now
        this.updatePresetLauncher( 1 );
        this.launcherFrameFront.opacity = 0.3;
      }
      else if ( !isCustom && prevIsCustom ) {
        this.updatePresetLauncher( presetLauncherProperty.value );
        this.launcherFrameFront.opacity = 1;
      }
    } );

    customLauncherTypeProperty.link( launcherType => {
      launcherTypeSymbol.image = this.getImageKeyForCustomLauncherType( launcherType );
      launcherTypeSymbol.centerX = -0.43 * this.launcherBarrel.width;
      launcherTypeSymbol.centerY = 0;
    } );

    // Reset the barrel rotation when the angle stabilizer gap is changed to avoid overlap between the two.
    angleStabilizerProperty.lazyLink( () => {
      //TODO: This is causing flicker during continuous launch. How to fix? - see https://github.com/phetsims/projectile-data-lab/issues/7
      //this.setBarrelRotation( AngleForConfiguration( launcherConfigurationProperty.value ) );
    } );
  }

  private getAngleStabilizers( launcherConfiguration: LauncherConfiguration, gapWidth: number ): Node {
    // positive x-direction is zero, clockwise is positive;
    // Min angle is the bottom of the guide rail, max angle is the top of the guide rail
    const centralAngle = Utils.toRadians( 180 - AngleForConfiguration( launcherConfiguration ) );

    // The minimum gap is angle of an arc length LAUNCH_ANGLE_LIMITER_WIDTH at radius GUIDE_RAIL_OUTER_RADIUS
    const minGap = LAUNCH_ANGLE_LIMITER_WIDTH / GUIDE_RAIL_OUTER_RADIUS;
    const gapWidthRadians = Utils.toRadians( gapWidth + minGap );
    const topInnerAngle = centralAngle + gapWidthRadians;
    const bottomInnerAngle = centralAngle - gapWidthRadians;

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
        return pressure_png;
      default: //case 'EXPLOSION':
        return explosion_png;
    }
  }
}

projectileDataLab.register( 'CustomLauncherNode', CustomLauncherNode );
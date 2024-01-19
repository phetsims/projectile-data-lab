// Copyright 2023-2024, University of Colorado Boulder

import { Image, Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import TProperty from '../../../../axon/js/TProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LauncherNode, { BARREL_LENGTH_BEFORE_ORIGIN, GUIDE_RAIL_MAX_ANGLE, GUIDE_RAIL_MIN_ANGLE, GUIDE_RAIL_OUTER_RADIUS } from '../../common/view/LauncherNode.js';
import spring_png from '../../../images/spring_png.js';
import pressureWithoutNeedle_png from '../../../images/pressureWithoutNeedle_png.js';
import pressureNeedle_png from '../../../images/pressureNeedle_png.js';
import explosion_png from '../../../images/explosion_png.js';
import PDLColors from '../../common/PDLColors.js';
import { Shape } from '../../../../kite/js/imports.js';
import { LauncherConfiguration, MEAN_LAUNCH_ANGLES } from '../../common/model/LauncherConfiguration.js';
import Utils from '../../../../dot/js/Utils.js';
import Multilink from '../../../../axon/js/Multilink.js';
import gear_png from '../../../images/gear_png.js';
import { MysteryOrCustom } from '../../common/model/MysteryOrCustom.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import LauncherMechanism, { EXPLOSION, PRESSURE, SPRING } from '../model/LauncherMechanism.js';

/**
 * The CustomizableLauncherNode is the visual representation of the customizable launcher. It contains a barrel, frame and a stand.
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

// This is the multiple of launch angle standard deviations to use for the gap of the angle stabilizer.
const ANGLE_STABILIZER_NUM_STANDARD_DEVIATIONS = 3;

export default class CustomizableLauncherNode extends LauncherNode {

  private readonly angleStabilizersContainer = new Node();

  public constructor( modelViewTransform: ModelViewTransform2,
                      launcherConfigurationProperty: TProperty<LauncherConfiguration>,
                      launcherAngleProperty: TProperty<number>,
                      launcherHeightProperty: TProperty<number>,
                      mysteryOrCustomProperty: TProperty<MysteryOrCustom>,
                      mysteryLauncherNumberProperty: TProperty<number>,
                      launcherMechanismProperty: TProperty<LauncherMechanism>,
                      standardDeviationAngleProperty: TProperty<number>,
                      latestLaunchSpeedProperty: TProperty<number>,
                      providedOptions: CustomLauncherNodeOptions ) {

    super( modelViewTransform, launcherAngleProperty, launcherHeightProperty, mysteryLauncherNumberProperty, providedOptions );

    const launcherTypeIcon = new Image( CustomizableLauncherNode.getImageKeyForCustomLauncherMechanism( launcherMechanismProperty.value ), {
      centerX: 0,
      centerY: 0
    } );

    const isLauncherCustomProperty = DerivedProperty.valueEqualsConstant( mysteryOrCustomProperty, 'custom' );

    const pressureNeedleIcon = new Image( pressureNeedle_png, { x: -13.5, y: -40 } );
    const pressureNeedleNode = new Node( { children: [ pressureNeedleIcon ] } );

    const launcherTypeIconContainer = new Node( {
      x: -0.7 * BARREL_LENGTH_BEFORE_ORIGIN,
      y: 0,
      children: [ launcherTypeIcon, pressureNeedleNode ],
      visibleProperty: isLauncherCustomProperty,
      scale: 0.2,
      rotation: Math.PI / 2
    } );

    this.launcherBarrel.addChild( launcherTypeIconContainer );

    // Add the launch angle limiter - the piece sticking out of the back of the launcher.
    const launchAngleLimiter = new Rectangle( -BARREL_LENGTH_BEFORE_ORIGIN - LAUNCH_ANGLE_LIMITER_LENGTH, -0.5 * LAUNCH_ANGLE_LIMITER_WIDTH,
      LAUNCH_ANGLE_LIMITER_LENGTH, LAUNCH_ANGLE_LIMITER_WIDTH, {
        visibleProperty: isLauncherCustomProperty,
        fill: PDLColors.mysteryLauncherFillColorProperties[ 0 ].primary,
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
    this.angleStabilizersContainer.addChild( this.getAngleStabilizers( launcherConfigurationProperty.value,
      ANGLE_STABILIZER_NUM_STANDARD_DEVIATIONS * standardDeviationAngleProperty.value ) );

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

    Multilink.multilink( [ launcherConfigurationProperty, standardDeviationAngleProperty ],
      ( launcherConfiguration, standardDeviationAngle ) => {
        const launcherAngle = MEAN_LAUNCH_ANGLES[ launcherConfiguration ];
        const rotationFactor = 0.4;
        gearTopContainer.rotation = rotationFactor * ( launcherAngle + standardDeviationAngle );
        gearBottomContainer.rotation = rotationFactor * ( launcherAngle - standardDeviationAngle );
        this.angleStabilizersContainer.children = [ this.getAngleStabilizers( launcherConfiguration,
          ANGLE_STABILIZER_NUM_STANDARD_DEVIATIONS * standardDeviationAngle ) ];
      } );

    Multilink.multilink( [ mysteryOrCustomProperty, mysteryLauncherNumberProperty ], ( mysteryOrCustom, mysteryLauncher ) => {

      // The custom launcher is based on the graphics from mystery launcher 1
      this.updateMysteryLauncher( mysteryOrCustom === 'custom' ? 1 : mysteryLauncher );
      this.launcherFrameFront.opacity = mysteryOrCustom === 'custom' ? 0.2 : 1; // Do not set invisible because of 60 degree launch.

      // Only show the label node for mystery launchers
      this.labelNode.visible = mysteryOrCustom === 'mystery';
    } );

    launcherMechanismProperty.link( launcherType => {
      launcherTypeIcon.image = CustomizableLauncherNode.getImageKeyForCustomLauncherMechanism( launcherType );
      launcherTypeIcon.rotation = launcherType === PRESSURE ? -Math.PI / 2 : launcherType === EXPLOSION ? Math.PI / 2 : 0;
      launcherTypeIcon.centerX = 0;
      launcherTypeIcon.centerY = 0;

      pressureNeedleNode.visible = launcherType === PRESSURE;
    } );

    latestLaunchSpeedProperty.link( launchSpeed => {
      const maxAngle = 80;
      const meanSpeed = launcherMechanismProperty.value.speedMeanProperty.value;
      const maxSpeed = 30;
      const needleDeltaRotation = maxAngle * ( launchSpeed - meanSpeed ) / ( maxSpeed - meanSpeed );
      pressureNeedleNode.rotation = Utils.toRadians( needleDeltaRotation ) - Math.PI / 2;
    } );
  }

  private getAngleStabilizers( launcherConfiguration: LauncherConfiguration, separationWidth: number ): Node {

    // Subtract the angle of the launcher from 180 to get the central angle of the angle stabilizer.
    const centralAngle = Utils.toRadians( 180 - MEAN_LAUNCH_ANGLES[ launcherConfiguration ] );

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

  private static getImageKeyForCustomLauncherMechanism( customLauncherType: LauncherMechanism ): HTMLImageElement {
    return customLauncherType === SPRING ? spring_png :
           customLauncherType === PRESSURE ? pressureWithoutNeedle_png :
           explosion_png;
  }
}

projectileDataLab.register( 'CustomizableLauncherNode', CustomizableLauncherNode );
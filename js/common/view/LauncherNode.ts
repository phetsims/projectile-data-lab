// Copyright 2023, University of Colorado Boulder

import { Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import ProjectileDataLabColors from '../ProjectileDataLabColors.js';
import Property from '../../../../axon/js/Property.js';
import ProjectileDataLabConstants from '../ProjectileDataLabConstants.js';

/**
 * The LauncherNode is the visual representation of the projectile launcher. It contains a launcher, frame and a stand.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type LauncherNodeOptions = SelfOptions & NodeOptions;

export default class LauncherNode extends Node {

  private readonly originY: number;
  private readonly launcher: Node;

  public constructor( x: number,
                      originY: number,
                      launcherAngleProperty: Property<number>,
                      launcherHeightProperty: Property<number>,
                      launcherTypeProperty: Property<number>,
                      providedOptions: LauncherNodeOptions ) {

    const launcher = new Node();
    const defaultOptions = { x: x, children: [ launcher ] };
    const options = optionize<LauncherNodeOptions, SelfOptions, NodeOptions>()( defaultOptions, providedOptions );
    super( options );

    this.originY = originY;
    this.launcher = launcher;

    launcherAngleProperty.link( launcherAngle => {
      this.updateLauncherAngle( launcherAngle );
    } );

    launcherHeightProperty.link( launcherHeight => {
      this.updateLauncherHeight( launcherHeight );
    } );

    launcherTypeProperty.link( launcherType => {
      this.launcher.removeAllChildren();
      this.launcherGraphicsForType( launcherType ).forEach( launcherGraphics => {
        this.launcher.addChild( launcherGraphics );
      } );
    } );
  }

  private launcherGraphicsForType( launcherType: number ): Rectangle[] {
    const launcherLengthBeforeOrigin = 100;
    const launcherLengthAfterOrigin = 15;
    const launcherLength = launcherLengthBeforeOrigin + launcherLengthAfterOrigin;
    const launcherWidth = 32;
    const launcherFillColorProperty = ProjectileDataLabColors.launcherFillColorProperties[ launcherType - 1 ];

    const launcherRect = new Rectangle(
      -launcherLengthBeforeOrigin,
      -0.5 * launcherWidth,
      launcherLength,
      launcherWidth, {
        fill: launcherFillColorProperty,
        stroke: ProjectileDataLabColors.launcherStrokeColorProperty,
        lineWidth: 1,
        cornerRadius: 0.2 * launcherWidth
      }
    );

    const launcherEndRectWidth = 1.2 * launcherWidth;
    const launcherEndRectLength = 0.12 * launcherEndRectWidth;

    const launcherEndRect = new Rectangle(
      launcherLengthAfterOrigin - 0.5 * launcherEndRectLength,
      -0.5 * launcherEndRectWidth,
      launcherEndRectLength,
      launcherEndRectWidth, {
        fill: launcherFillColorProperty.value.darkerColor( 0.8 ),
        stroke: ProjectileDataLabColors.launcherStrokeColorProperty,
        lineWidth: 1,
        cornerRadius: 0.1 * launcherEndRectLength
      }
    );

    return [ launcherRect, launcherEndRect ];
  }

  private updateLauncherAngle( angle: number ): void {
    this.launcher.setRotation( -angle * Math.PI / 180 );
  }

  private updateLauncherHeight( height: number ): void {
    this.y = this.originY - height * ProjectileDataLabConstants.PIXELS_TO_DISTANCE;
  }
}
projectileDataLab.register( 'LauncherNode', LauncherNode );
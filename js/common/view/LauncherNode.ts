// Copyright 2023, University of Colorado Boulder

import { LinearGradient, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import PDLColors from '../PDLColors.js';
import TProperty from '../../../../axon/js/TProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

/**
 * The LauncherNode is the visual representation of the projectile launcher. It contains a launcher, frame and a stand.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type LauncherNodeOptions = SelfOptions & NodeOptions;

export default class LauncherNode extends Node {

  // launcher contains all graphics that rotate with launch angle. This includes the launch tube and end cap.
  private readonly launcher: Node;

  public constructor( private readonly modelViewTransform: ModelViewTransform2,
                      launcherAngleProperty: TProperty<number>,
                      launcherHeightProperty: TProperty<number>,
                      launcherTypeProperty: TProperty<number>,
                      providedOptions: LauncherNodeOptions ) {

    const launcher = new Node();
    const launcherX = modelViewTransform.modelToViewX( 0 );
    const launcherY = modelViewTransform.modelToViewY( 0 );
    const defaultOptions = { x: launcherX, y: launcherY, children: [ launcher ] };
    const options = optionize<LauncherNodeOptions, SelfOptions, NodeOptions>()( defaultOptions, providedOptions );
    super( options );

    this.launcher = launcher;

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
    this.launcher.setRotation( -angle * Math.PI / 180 );
  }

  private updateLauncherHeight( height: number ): void {
    this.y = this.modelViewTransform.modelToViewY( height );
  }

  private updateLauncherType( type: number ): void {
    this.launcher.removeAllChildren();
    this.launcherGraphicsForType( type ).forEach( launcherGraphics => {
      this.launcher.addChild( launcherGraphics );
    } );
  }

  private launcherGraphicsForType( launcherType: number ): Rectangle[] {
    const launcherLengthBeforeOrigin = 100;
    const launcherLengthAfterOrigin = 15;
    const launcherLength = launcherLengthBeforeOrigin + launcherLengthAfterOrigin;
    const launcherWidth = 32;

    const launcherFillColorProperty = PDLColors.launcherFillColorProperties[ launcherType - 1 ];
    const launcherFillDarkColorProperty = new DerivedProperty( [ launcherFillColorProperty ],
      color => color.darkerColor( 0.8 ) );

    const launcherFillGradient = new LinearGradient( 0, -0.5 * launcherWidth, 0, 0.5 * launcherWidth );
    launcherFillGradient.addColorStop( 0, launcherFillDarkColorProperty );
    launcherFillGradient.addColorStop( 0.4, launcherFillColorProperty );
    launcherFillGradient.addColorStop( 0.6, launcherFillColorProperty );
    launcherFillGradient.addColorStop( 1, launcherFillDarkColorProperty );

    const launcherRect = new Rectangle(
      -launcherLengthBeforeOrigin,
      -0.5 * launcherWidth,
      launcherLength,
      launcherWidth, {
        fill: launcherFillGradient,
        stroke: PDLColors.launcherStrokeColorProperty,
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
        fill: launcherFillDarkColorProperty,
        stroke: PDLColors.launcherStrokeColorProperty,
        lineWidth: 1,
        cornerRadius: 0.1 * launcherEndRectLength
      }
    );

    return [ launcherRect, launcherEndRect ];
  }
}

projectileDataLab.register( 'LauncherNode', LauncherNode );
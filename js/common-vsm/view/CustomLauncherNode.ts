// Copyright 2023, University of Colorado Boulder

import { NodeOptions } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import TProperty from '../../../../axon/js/TProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LauncherNode from '../../common/view/LauncherNode.js';
import { CustomLauncherType } from '../model/CustomLauncherType.js';
import { Image } from '../../../../scenery/js/imports.js';
import spring_png from '../../../images/spring_png.js';
import pressure_png from '../../../images/pressure_png.js';
import explosion_png from '../../../images/explosion_png.js';

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

export default class CustomLauncherNode extends LauncherNode {

  public constructor( modelViewTransform: ModelViewTransform2,
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
      centerX: -this.launcherBarrel.width / 2,
      centerY: 0,
      rotation: Math.PI / 2
    } );
    launcherTypeSymbol.image = explosion_png;
    this.launcherBarrel.addChild( launcherTypeSymbol );

    isLauncherCustomProperty.link( ( isCustom, prevIsCustom ) => {
      if ( isCustom && ( !prevIsCustom || prevIsCustom === null ) ) {
        // Set the graphics for preset launcher 1 for now
        this.updatePresetLauncher( 1 );
        this.launcherFrameFront.opacity = 0.5;
      }
      else if ( !isCustom && prevIsCustom ) {
        this.updatePresetLauncher( presetLauncherProperty.value );
        this.launcherFrameFront.opacity = 1;
      }
    } );

    customLauncherTypeProperty.link( launcherType => {
      launcherTypeSymbol.image = this.getImageKeyForCustomLauncherType( launcherType );
      launcherTypeSymbol.centerX = -this.launcherBarrel.width / 2;
      launcherTypeSymbol.centerY = 0;
    } );
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
// Copyright 2023-2024, University of Colorado Boulder

/**
 * CustomLauncherTypeRadioButtonGroup is a group of radio buttons for selecting between mystery and custom launchers
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Image } from '../../../../scenery/js/imports.js';
import { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import projectileDataLab from '../../projectileDataLab.js';
import spring_png from '../../../images/spring_png.js';
import pressureWithNeedle_png from '../../../images/pressureWithNeedle_png.js';
import explosion_png from '../../../images/explosion_png.js';
import LauncherMechanism, { EXPLOSION, PRESSURE, SPRING } from '../../common-vsm/model/LauncherMechanism.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import launcherTypeSpring_mp3 from '../../../sounds/launcherTypeSpring_mp3.js';
import launcherTypePressure_mp3 from '../../../sounds/launcherTypePressure_mp3.js';
import launcherTypeExplosion_mp3 from '../../../sounds/launcherTypeExplosion_mp3.js';
import PDLRectangularRadioButtonGroup from '../../common/view/PDLRectangularRadioButtonGroup.js';

type SelfOptions = EmptySelfOptions;
type CustomLauncherTypeRadioButtonGroupOptions = SelfOptions & WithRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

const springSound = new SoundClip( launcherTypeSpring_mp3, { initialOutputLevel: 0.5 } );
soundManager.addSoundGenerator( springSound, { categoryName: 'user-interface' } );

const pressureSound = new SoundClip( launcherTypePressure_mp3 );
soundManager.addSoundGenerator( pressureSound, { categoryName: 'user-interface' } );

const explosionSound = new SoundClip( launcherTypeExplosion_mp3 );
soundManager.addSoundGenerator( explosionSound, { categoryName: 'user-interface' } );

export default class CustomLauncherTypeRadioButtonGroup extends PDLRectangularRadioButtonGroup<LauncherMechanism> {
  public constructor( customLauncherMechanismProperty: PhetioProperty<LauncherMechanism>, providedOptions: CustomLauncherTypeRadioButtonGroupOptions ) {

    const items: RectangularRadioButtonGroupItem<LauncherMechanism>[] = [
      {
        value: SPRING,
        tandemName: 'springRadioButton',
        createNode: () => new Image( spring_png, { scale: 0.14 } ),
        options: {
          soundPlayer: springSound
        }
      }, {
        value: PRESSURE,
        tandemName: 'pressureRadioButton',
        createNode: () => new Image( pressureWithNeedle_png, { scale: 0.18 } ),
        options: {
          soundPlayer: pressureSound
        }
      }, {
        value: EXPLOSION,
        tandemName: 'explosionRadioButton',
        createNode: () => new Image( explosion_png, { scale: -0.18 } ),
        options: {
          soundPlayer: explosionSound
        }
      } ];

    super( customLauncherMechanismProperty, items, {
      tandem: providedOptions.tandem,
      orientation: 'horizontal',
      align: 'center',
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 5,
        yMargin: 5
      }
    } );
  }
}

projectileDataLab.register( 'CustomLauncherTypeRadioButtonGroup', CustomLauncherTypeRadioButtonGroup );

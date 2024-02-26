// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Image } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLPanelSection, { PDLPanelSectionOptions } from './PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import cannonball_png from '../../../images/cannonball_png.js';
import piano_png from '../../../images/piano_png.js';
import pumpkin_png from '../../../images/pumpkin_png.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PDLRectangularRadioButtonGroup from './PDLRectangularRadioButtonGroup.js';
import ProjectileType, { CANNONBALL, PIANO, PUMPKIN } from '../model/ProjectileType.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import pdlCannonLandandGeneralThudV1_mp3 from '../../../sounds/pdlCannonLandandGeneralThudV1_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import pdlPianoLand_mp3 from '../../../sounds/pdlPianoLand_mp3.js';

import pdlPumpkinLand_mp3 from '../../../sounds/pdlPumpkinLand_mp3.js';

const cannonballSoundClip = new SoundClip( pdlCannonLandandGeneralThudV1_mp3, { initialOutputLevel: 0.1 } );
soundManager.addSoundGenerator( cannonballSoundClip );

const pianoSoundClip = new SoundClip( pdlPianoLand_mp3, { initialOutputLevel: 0.1 } );
soundManager.addSoundGenerator( pianoSoundClip );

const pumpkinSoundClip = new SoundClip( pdlPumpkinLand_mp3, { initialOutputLevel: 0.1 } );
soundManager.addSoundGenerator( pumpkinSoundClip );

/**
 * The SectionProjectileType shows the projectile type radio buttons.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionProjectileTypeOptions = SelfOptions & WithRequired<PDLPanelSectionOptions, 'tandem'>;

export default class SectionProjectileType extends PDLPanelSection {

  public constructor( projectileTypeProperty: PhetioProperty<ProjectileType>, providedOptions: SectionProjectileTypeOptions ) {

    const projectileTypeRadioButtonGroup = new PDLRectangularRadioButtonGroup( projectileTypeProperty, [ {
      value: CANNONBALL,
      tandemName: 'cannonballRadioButton',
      createNode: () => new Image( cannonball_png, { scale: 0.22 } ),
      options: {
        soundPlayer: cannonballSoundClip
      }
    }, {
      value: PUMPKIN,
      tandemName: 'pumpkinRadioButton',
      createNode: () => new Image( pumpkin_png, { scale: 0.20 } ),
      options: {
        soundPlayer: pumpkinSoundClip
      }
    }, {
      value: PIANO,
      tandemName: 'pianoRadioButton',
      createNode: () => new Image( piano_png, { scale: 0.15 } ),
      options: {
        soundPlayer: pianoSoundClip
      }
    } ], {
      tandem: providedOptions.tandem.createTandem( 'projectileTypeRadioButtonGroup' ),
      phetioVisiblePropertyInstrumented: false, // As the only UI control in the panel, the visibility is controlled by the parent panel
      phetioFeatured: true,
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 5,
        yMargin: 5
      },
      layoutOptions: {
        align: 'center'
      }
    } );

    super( ProjectileDataLabStrings.projectileStringProperty, projectileTypeRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'SectionProjectileType', SectionProjectileType );
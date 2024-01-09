// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Image } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLPanelSection, { PDLPanelSectionOptions } from './PDLPanelSection.js';
import { ProjectileType } from '../model/ProjectileType.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import cannonball_png from '../../../images/cannonball_png.js';
import piano_png from '../../../images/piano_png.js';
import pumpkin_png from '../../../images/pumpkin_png.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionProjectileTypeOptions = SelfOptions & WithRequired<PDLPanelSectionOptions, 'tandem'>;

export default class SectionProjectileType extends PDLPanelSection {

  public constructor( projectileTypeProperty: PhetioProperty<ProjectileType>, providedOptions: SectionProjectileTypeOptions ) {

    const projectileTypeRadioButtonGroup = new RectangularRadioButtonGroup( projectileTypeProperty, [ {
      value: 'cannonball' as const,
      tandemName: 'cannonballRadioButton',
      createNode: () => new Image( cannonball_png, { scale: 0.22 } )
    }, {
      value: 'pumpkin' as const,
      tandemName: 'pumpkinRadioButton',
      createNode: () => new Image( pumpkin_png, { scale: 0.20 } )
    }, {
      value: 'piano' as const,
      tandemName: 'pianoRadioButton',
      createNode: () => new Image( piano_png, { scale: 0.15 } )
    } ], {
      tandem: providedOptions.tandem.createTandem( 'projectileTypeRadioButtonGroup' ),
      phetioFeatured: true,
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: 'white'
      },
      layoutOptions: {
        align: 'center'
      }
    } );

    super( ProjectileDataLabStrings.projectile10kgStringProperty, projectileTypeRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'SectionProjectileType', SectionProjectileType );
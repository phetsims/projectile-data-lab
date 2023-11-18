// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Text } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLPanelSection, { PDLPanelSectionOptions } from './PDLPanelSection.js';
import { ProjectileType } from '../model/ProjectileType.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type ProjectileTypeSectionOptions = SelfOptions & PDLPanelSectionOptions;

export default class ProjectileTypeSection extends PDLPanelSection {

  public constructor( projectileTypeProperty: Property<ProjectileType>, providedOptions: ProjectileTypeSectionOptions ) {
    const projectileTypeRadioButtonGroup = new RectangularRadioButtonGroup( projectileTypeProperty, [ {
      value: 'CANNONBALL' as const,
      tandemName: 'cannonballRadioButton',
      createNode: () => new Text( 'Cannonball' )
    }, {
      value: 'PUMPKIN' as const,
      tandemName: 'pumpkinRadioButton',
      createNode: () => new Text( 'Pumpkin' )
    }, {
      value: 'TOY_PIANO' as const,
      tandemName: 'toyPianoRadioButton',
      createNode: () => new Text( 'Toy Piano' )
    } ], {
      tandem: providedOptions.tandem.createTandem( 'projectileTypeRadioButtonGroup' ),
      orientation: 'horizontal'
    } );
    super( 'Projectile (10 kg)', projectileTypeRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'ProjectileTypeSection', ProjectileTypeSection );
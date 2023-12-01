// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Node } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionCustomLauncherOptions = SelfOptions & PDLPanelSectionOptions;

export default class SectionCustomLauncher extends PDLPanelSection {

  public constructor( providedOptions: SectionCustomLauncherOptions ) {
    // const projectileTypeRadioButtonGroup = new RectangularRadioButtonGroup( projectileTypeProperty, [ {
    //   value: 'CANNONBALL' as const,
    //   tandemName: 'cannonballRadioButton',
    //   createNode: () => new Text( 'Cannonball' )
    // }, {
    //   value: 'PUMPKIN' as const,
    //   tandemName: 'pumpkinRadioButton',
    //   createNode: () => new Text( 'Pumpkin' )
    // }, {
    //   value: 'TOY_PIANO' as const,
    //   tandemName: 'toyPianoRadioButton',
    //   createNode: () => new Text( 'Toy Piano' )
    // } ], {
    //   tandem: providedOptions.tandem.createTandem( 'projectileTypeRadioButtonGroup' ),
    //   orientation: 'horizontal'
    // } );
    super( ProjectileDataLabStrings.launcherStringProperty, new Node(), providedOptions );
  }
}

projectileDataLab.register( 'SectionCustomLauncher', SectionCustomLauncher );
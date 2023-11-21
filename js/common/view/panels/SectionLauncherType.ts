// Copyright 2023, University of Colorado Boulder

import PDLPanelSection, { PDLPanelSectionOptions } from './PDLPanelSection.js';
import { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import ProjectileDataLabStrings from '../../../ProjectileDataLabStrings.js';
import projectileDataLab from '../../../projectileDataLab.js';
import PhetioProperty from '../../../../../axon/js/PhetioProperty.js';
import PDLText from '../PDLText.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type ProjectileTypeSectionOptions = SelfOptions & PDLPanelSectionOptions;

export default class SectionLauncherType extends PDLPanelSection {

  public constructor( launcherTypeProperty: PhetioProperty<number>, providedOptions: ProjectileTypeSectionOptions ) {
    // TODO: Try to use Array.map for this without type errors - see https://github.com/phetsims/projectile-data-lab/issues/5
    const launcherTypeRadioButtonGroupItems: RectangularRadioButtonGroupItem<number>[] = [];

    // TODO: be explicit in passing the validValues through as a separate option, see https://github.com/phetsims/projectile-data-lab/issues/7
    _.range( 1, 7 ).forEach( launcherType => {
      launcherTypeRadioButtonGroupItems.push( {
        value: launcherType,
        tandemName: `launcherType${launcherType}RadioButton`,
        createNode: () => new PDLText( launcherType.toString() )
      } );
    } );

    const launcherTypeRadioButtonGroup = new RectangularRadioButtonGroup( launcherTypeProperty, launcherTypeRadioButtonGroupItems, {
      tandem: providedOptions.tandem.createTandem( 'launcherTypeRadioButtonGroup' ),
      orientation: 'horizontal'
    } );
    super( ProjectileDataLabStrings.launcherStringProperty, launcherTypeRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'SectionLauncherType', SectionLauncherType );
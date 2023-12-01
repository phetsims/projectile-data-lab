// Copyright 2023, University of Colorado Boulder

import PDLPanelSection, { PDLPanelSectionOptions } from './PDLPanelSection.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import PDLText from './PDLText.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionProjectileTypeOptions = SelfOptions & PDLPanelSectionOptions;

export default class SectionPresetLauncher extends PDLPanelSection {

  public constructor( presetLauncherProperty: PhetioProperty<number>, providedOptions: SectionProjectileTypeOptions ) {

    // TODO: be explicit in passing the validValues through as a separate option, see https://github.com/phetsims/projectile-data-lab/issues/7
    const presetLauncherRadioButtonGroupItems = _.range( 1, 7 ).map( presetLauncher => {
      return {
        value: presetLauncher,
        tandemName: `presetLauncher${presetLauncher}RadioButton`,
        createNode: () => new PDLText( presetLauncher.toString() )
      };
    } );

    const presetLauncherRadioButtonGroup = new RectangularRadioButtonGroup( presetLauncherProperty, presetLauncherRadioButtonGroupItems, {
      tandem: providedOptions.tandem.createTandem( 'presetLauncherRadioButtonGroup' ),
      orientation: 'horizontal'
    } );
    super( ProjectileDataLabStrings.launcherStringProperty, presetLauncherRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'SectionPresetLauncher', SectionPresetLauncher );
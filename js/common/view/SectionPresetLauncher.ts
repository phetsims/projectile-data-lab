// Copyright 2023, University of Colorado Boulder

import PDLPanelSection, { PDLPanelSectionOptions } from './PDLPanelSection.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import LauncherRadioButtonGroupWrapper from './LauncherRadioButtonGroupWrapper.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionProjectileTypeOptions = SelfOptions & WithRequired<PDLPanelSectionOptions, 'tandem'>;

export default class SectionPresetLauncher extends PDLPanelSection {

  public constructor( presetLauncherProperty: PhetioProperty<number>, providedOptions: SectionProjectileTypeOptions ) {
    super( ProjectileDataLabStrings.launcherStringProperty, new LauncherRadioButtonGroupWrapper( presetLauncherProperty, providedOptions ), providedOptions );
  }
}

projectileDataLab.register( 'SectionPresetLauncher', SectionPresetLauncher );
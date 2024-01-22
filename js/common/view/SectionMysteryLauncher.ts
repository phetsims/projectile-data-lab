// Copyright 2023-2024, University of Colorado Boulder

import PDLPanelSection, { PDLPanelSectionOptions } from './PDLPanelSection.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import MysteryLauncherRadioButtonGroupWrapper from './MysteryLauncherRadioButtonGroupWrapper.js';
import Launcher from '../model/Launcher.js';

/**
 * The SectionMysteryLauncher shows the mystery launcher radio buttons.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionMysteryLauncherOptions = SelfOptions & WithRequired<PDLPanelSectionOptions, 'tandem'>;

export default class SectionMysteryLauncher extends PDLPanelSection {

  public constructor( mysteryLauncherProperty: PhetioProperty<Launcher>, providedOptions: SectionMysteryLauncherOptions ) {
    super( ProjectileDataLabStrings.mysteryLauncherStringProperty, new MysteryLauncherRadioButtonGroupWrapper( mysteryLauncherProperty, providedOptions ), providedOptions );
  }
}

projectileDataLab.register( 'SectionMysteryLauncher', SectionMysteryLauncher );
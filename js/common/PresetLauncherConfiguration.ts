// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../projectileDataLab.js';
import { LauncherMechanism } from '../common-vsm/model/LauncherMechanism.js';

/**
 * Defines the configuration for the properties of preset (mystery) launchers. This includes the launcher mechanism
 * and the angle standard deviation. The launcher mechanism is used to determine the mean and SD of launch speed.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class PresetLauncherConfiguration {
  public constructor( public readonly launcherMechanism: LauncherMechanism,
                      public readonly angleStandardDeviation: number ) {
  }
}

projectileDataLab.register( 'PresetLauncherConfiguration', PresetLauncherConfiguration );
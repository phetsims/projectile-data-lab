// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../projectileDataLab.js';
import { LauncherMechanism } from '../common-vsm/model/LauncherMechanism.js';

/**
 * Defines the launch properties of mystery launchers. This includes the launcher mechanism (which determines the speed
 * and speed standard deviation), and the angle SD. The launcher mechanism is used to determine the mean and SD of launch speed.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class MysteryLauncherProfile {
  public constructor( public readonly launcherMechanism: LauncherMechanism,
                      public readonly angleStandardDeviation: number ) {
  }
}

projectileDataLab.register( 'MysteryLauncherProfile', MysteryLauncherProfile );
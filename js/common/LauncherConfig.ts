// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../projectileDataLab.js';
import { CustomLauncherType } from '../common-vsm/model/CustomLauncherType.js';

/**
 * Defines the configuration for the properties of the launcher.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class LauncherConfig {
  public constructor( public readonly launcherType: CustomLauncherType,
                      public readonly angleStandardDeviation: number ) {
  }
}

projectileDataLab.register( 'LauncherConfig', LauncherConfig );
// Copyright 2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { LauncherMechanism, speedMeans, speedStandardDeviations } from '../../common-vsm/model/LauncherMechanism.js';
import Property from '../../../../axon/js/Property.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { MysteryOrCustom } from './MysteryOrCustom.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import IOType from '../../../../tandem/js/types/IOType.js';

/**
 * Launcher is the model for a projectile launcher. It defines the mean launch speed, standard deviation of launch speed,
 * and standard deviation of launch angle.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

const MAX_STANDARD_DEVIATION_ANGLE = 8; // degrees

type SelfOptions = EmptySelfOptions;
type LauncherOptions = SelfOptions & PhetioObjectOptions;

export default class Launcher extends PhetioObject {

  // The launcher mechanism (spring, pressure, explosion) determines the mean and standard deviation of the launch speed.
  public readonly launcherMechanismProperty: Property<LauncherMechanism>;

  // The standard deviation of the launch angle.
  public readonly standardDeviationAngleProperty: Property<number>;

  public readonly meanLaunchSpeedProperty: TReadOnlyProperty<number>;
  public readonly standardDeviationSpeedProperty: TReadOnlyProperty<number>;

  public constructor( public readonly mysteryOrCustom: MysteryOrCustom, launcherMechanism: LauncherMechanism, standardDeviationAngle: number,
                      // 1-6 for the mystery launchers.
                      // 0 for custom
                      public readonly launcherNumber: number, providedOptions: LauncherOptions ) {

    if ( assert && mysteryOrCustom === 'custom' ) {
      assert( launcherNumber === 1 || launcherNumber === MYSTERY_LAUNCHERS[ MYSTERY_LAUNCHERS.length - 1 ].launcherNumber + 1, 'invalid launcher number' );
    }

    const options = optionize<LauncherOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: IOType.ObjectIO,
      phetioState: false
    }, providedOptions );

    super( options );

    // TODO: https://github.com/phetsims/projectile-data-lab/issues/80 These and more should be mutable for PhET-iO, right?
    this.launcherMechanismProperty = new Property( launcherMechanism );
    this.standardDeviationAngleProperty = new Property( standardDeviationAngle );

    this.meanLaunchSpeedProperty = new DerivedProperty( [ this.launcherMechanismProperty ], launcherMechanism => {
      return speedMeans[ launcherMechanism ];
    } );

    this.standardDeviationSpeedProperty = new DerivedProperty( [ this.launcherMechanismProperty ], launcherMechanism => {
      return speedStandardDeviations[ launcherMechanism ];
    } );
  }
}

export const MYSTERY_LAUNCHERS = [
  new Launcher( 'mystery', 'spring', 1, 1, {
    tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryLauncher1' )
  } ),
  new Launcher( 'mystery', 'spring', MAX_STANDARD_DEVIATION_ANGLE, 2, {
    tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryLauncher2' )
  } ),
  new Launcher( 'mystery', 'explosion', 0, 3, {
    tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryLauncher3' )
  } ),
  new Launcher( 'mystery', 'pressure', 2, 4, {
    tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryLauncher4' )
  } ),
  new Launcher( 'mystery', 'pressure', 4, 5, {
    tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryLauncher5' )
  } ),
  new Launcher( 'mystery', 'explosion', MAX_STANDARD_DEVIATION_ANGLE, 6, {
    tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryLauncher6' )
  } )
];

projectileDataLab.register( 'Launcher', Launcher );
// Copyright 2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import LauncherMechanism, { EXPLOSION, PRESSURE, SPRING } from '../../common-vsm/model/LauncherMechanism.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { MysteryOrCustom } from './MysteryOrCustom.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PDLConstants from '../PDLConstants.js';

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

  public readonly meanLaunchSpeedProperty: DynamicProperty<number, number, LauncherMechanism>;
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

    this.launcherMechanismProperty = new Property( launcherMechanism, {
      tandem: options.tandem.createTandem( 'launcherMechanismProperty' ),
      phetioValueType: LauncherMechanism.LauncherMechanismIO,
      validValues: [ SPRING, PRESSURE, EXPLOSION ]
    } );
    this.standardDeviationAngleProperty = new NumberProperty( standardDeviationAngle, {
      range: PDLConstants.ANGLE_STABILIZER_RANGE,
      rangePropertyOptions: {
        tandem: Tandem.OPT_OUT
      },
      tandem: options.tandem.createTandem( 'standardDeviationAngleProperty' )
    } );

    this.meanLaunchSpeedProperty = new DynamicProperty<number, number, LauncherMechanism>( this.launcherMechanismProperty, {
      derive: launcherMechanism => launcherMechanism.speedMeanProperty
    } );

    this.standardDeviationSpeedProperty = new DynamicProperty<number, number, LauncherMechanism>( this.launcherMechanismProperty, {
      derive: launcherMechanism => launcherMechanism.speedStandardDeviationProperty
    } );
  }
}

const mysteryLaunchersTandem = Tandem.GLOBAL_MODEL.createTandem( 'mysteryLaunchers' );
export const MYSTERY_LAUNCHERS = [
  new Launcher( 'mystery', SPRING, 1, 1, {
    tandem: mysteryLaunchersTandem.createTandem( 'mysteryLauncher1' )
  } ),
  new Launcher( 'mystery', SPRING, MAX_STANDARD_DEVIATION_ANGLE, 2, {
    tandem: mysteryLaunchersTandem.createTandem( 'mysteryLauncher2' )
  } ),
  new Launcher( 'mystery', EXPLOSION, 0, 3, {
    tandem: mysteryLaunchersTandem.createTandem( 'mysteryLauncher3' )
  } ),
  new Launcher( 'mystery', PRESSURE, 2, 4, {
    tandem: mysteryLaunchersTandem.createTandem( 'mysteryLauncher4' )
  } ),
  new Launcher( 'mystery', PRESSURE, 4, 5, {
    tandem: mysteryLaunchersTandem.createTandem( 'mysteryLauncher5' )
  } ),
  new Launcher( 'mystery', EXPLOSION, MAX_STANDARD_DEVIATION_ANGLE, 6, {
    tandem: mysteryLaunchersTandem.createTandem( 'mysteryLauncher6' )
  } )
];

projectileDataLab.register( 'Launcher', Launcher );
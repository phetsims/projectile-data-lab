// Copyright 2024, University of Colorado Boulder

/**
 * Launcher is the model for a projectile launcher. It defines the mean launch speed, standard deviation of launch speed,
 * and standard deviation of launch angle.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import LauncherMechanism from '../../common-vsm/model/LauncherMechanism.js';
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
import Utils from '../../../../dot/js/Utils.js';
import Range from '../../../../dot/js/Range.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = EmptySelfOptions;
type LauncherOptions = SelfOptions & PhetioObjectOptions;

export default class Launcher extends PhetioObject {

  // The launcher mechanism (spring, pressure, explosion) determines the mean and standard deviation of the launch speed.
  public readonly launcherMechanismProperty: Property<LauncherMechanism>;

  // The angleStabilizerProperty represents the amount of angle stabilization applied to the launcher. The value is between 0 and 1, where 0 means minimum stabilization and 1 means maximum stabilization.
  public readonly angleStabilizerProperty: Property<number>;

  // The standard deviation of the launch angle.
  public readonly standardDeviationAngleProperty: TReadOnlyProperty<number>;

  // The mean launch speed is determined by the LauncherMechanism
  public readonly meanLaunchSpeedProperty: DynamicProperty<number, number, LauncherMechanism>;

  public readonly standardDeviationSpeedProperty: TReadOnlyProperty<number>;

  public constructor( public readonly mysteryOrCustom: MysteryOrCustom, launcherMechanism: LauncherMechanism, standardDeviationAngle: number,
                      // 1-6 for the mystery launchers.
                      // 7 for custom
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
      phetioFeatured: true,
      phetioValueType: LauncherMechanism.LauncherMechanismIO,
      validValues: [ LauncherMechanism.SPRING, LauncherMechanism.PRESSURE, LauncherMechanism.EXPLOSION, LauncherMechanism.CUSTOM_MECHANISM_1, LauncherMechanism.CUSTOM_MECHANISM_2, LauncherMechanism.CUSTOM_MECHANISM_3 ]
    } );

    const initialAngleStabilizer = Utils.linear( PDLConstants.ANGLE_STANDARD_DEVIATION_RANGE.min, PDLConstants.ANGLE_STANDARD_DEVIATION_RANGE.max, 1, 0, standardDeviationAngle );
    this.angleStabilizerProperty = new NumberProperty( initialAngleStabilizer, {
      phetioDocumentation: 'The angleStabilizerProperty represents the amount of angle stabilization applied to the launcher. The value is between 0 and 1, where 0 means minimum stabilization and 1 means maximum stabilization.',
      tandem: options.tandem.createTandem( 'angleStabilizerProperty' ),
      phetioFeatured: true,
      range: new Range( 0, 1 ),
      rangePropertyOptions: {
        tandem: Tandem.OPT_OUT
      }
    } );
    this.standardDeviationAngleProperty = new DerivedProperty( [ this.angleStabilizerProperty ], angleStabilizer => {
      return Utils.linear( 1, 0, PDLConstants.ANGLE_STANDARD_DEVIATION_RANGE.min, PDLConstants.ANGLE_STANDARD_DEVIATION_RANGE.max, angleStabilizer );
    }, {
      tandem: options.tandem.createTandem( 'standardDeviationAngleProperty' ),
      phetioFeatured: true,
      phetioValueType: NumberIO
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
  new Launcher( 'mystery', LauncherMechanism.SPRING, 3, 1, {
    tandem: mysteryLaunchersTandem.createTandem( 'mysteryLauncher1' )
  } ),
  new Launcher( 'mystery', LauncherMechanism.PRESSURE, PDLConstants.ANGLE_STANDARD_DEVIATION_RANGE.max, 2, {
    tandem: mysteryLaunchersTandem.createTandem( 'mysteryLauncher2' )
  } ),
  new Launcher( 'mystery', LauncherMechanism.EXPLOSION, PDLConstants.ANGLE_STANDARD_DEVIATION_RANGE.min, 3, {
    tandem: mysteryLaunchersTandem.createTandem( 'mysteryLauncher3' )
  } ),
  new Launcher( 'mystery', LauncherMechanism.SPRING, 1.5, 4, {
    tandem: mysteryLaunchersTandem.createTandem( 'mysteryLauncher4' )
  } ),
  new Launcher( 'mystery', LauncherMechanism.PRESSURE, PDLConstants.ANGLE_STANDARD_DEVIATION_RANGE.min, 5, {
    tandem: mysteryLaunchersTandem.createTandem( 'mysteryLauncher5' )
  } ),
  new Launcher( 'mystery', LauncherMechanism.EXPLOSION, PDLConstants.ANGLE_STANDARD_DEVIATION_RANGE.max, 6, {
    tandem: mysteryLaunchersTandem.createTandem( 'mysteryLauncher6' )
  } )
];

projectileDataLab.register( 'Launcher', Launcher );
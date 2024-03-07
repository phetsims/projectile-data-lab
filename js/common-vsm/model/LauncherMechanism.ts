// Copyright 2023-2024, University of Colorado Boulder

/**
 * Type that describes the mechanism used to launch the projectile. Each mechanism has a mean launch speed and a standard
 * deviation of launch speed.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';

export default class LauncherMechanism extends PhetioObject {
  public readonly speedMeanProperty: NumberProperty;
  public readonly speedStandardDeviationProperty: NumberProperty;

  private constructor( tandem: Tandem, speedMean: number, speedStandardDeviation: number ) {

    super( {
      tandem: tandem,
      phetioType: LauncherMechanism.LauncherMechanismIO,
      phetioState: false
    } );

    this.speedMeanProperty = new NumberProperty( speedMean, {
      tandem: tandem.createTandem( 'speedMeanProperty' ),
      phetioFeatured: true,

      // The speed tool is designed to show values up to 30 m/s.
      range: new Range( 15, 25 ),
      rangePropertyOptions: {
        tandem: Tandem.OPT_OUT
      }
    } );

    this.speedStandardDeviationProperty = new NumberProperty( speedStandardDeviation, {
      tandem: tandem.createTandem( 'speedStandardDeviationProperty' ),
      phetioFeatured: true,
      range: new Range( 0.2, 1.5 ),
      rangePropertyOptions: {
        tandem: Tandem.OPT_OUT
      }
    } );
  }

  /**
   * LauncherMechanismIO handles PhET-iO serialization of the LauncherMechanism. Since all LauncherMechanisms are created
   * at startup and exist for the lifetime of the simulation, it implements 'Reference type serialization', as described in the
   * Serialization section of https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static LauncherMechanismIO = new IOType<LauncherMechanism>( 'LauncherMechanismIO', {
    valueType: LauncherMechanism,
    documentation: 'Mechanism used to launch the projectile',
    supertype: ReferenceIO( IOType.ObjectIO )
  } );

  public static readonly SPRING = new LauncherMechanism( Tandem.GLOBAL_MODEL.createTandem( 'launcherMechanisms' ).createTandem( 'spring' ), 23, 0.5 );
  public static readonly PRESSURE = new LauncherMechanism( Tandem.GLOBAL_MODEL.createTandem( 'launcherMechanisms' ).createTandem( 'pressure' ), 24, 0.2 );
  public static readonly EXPLOSION = new LauncherMechanism( Tandem.GLOBAL_MODEL.createTandem( 'launcherMechanisms' ).createTandem( 'explosion' ), 25, 1.2 );
  public static readonly CUSTOM_MECHANISM_1 = new LauncherMechanism( Tandem.GLOBAL_MODEL.createTandem( 'launcherMechanisms' ).createTandem( 'customMechanism1' ), 24, 0.5 );
  public static readonly CUSTOM_MECHANISM_2 = new LauncherMechanism( Tandem.GLOBAL_MODEL.createTandem( 'launcherMechanisms' ).createTandem( 'customMechanism2' ), 24, 0.5 );
  public static readonly CUSTOM_MECHANISM_3 = new LauncherMechanism( Tandem.GLOBAL_MODEL.createTandem( 'launcherMechanisms' ).createTandem( 'customMechanism3' ), 24, 0.5 );
}
projectileDataLab.register( 'LauncherMechanism', LauncherMechanism );
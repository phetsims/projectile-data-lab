// Copyright 2023-2024, University of Colorado Boulder

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Range from '../../../../dot/js/Range.js';
import projectileDataLab from '../../projectileDataLab.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';

/**
 * Enumeration that describes the mechanism used to launch the projectile.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

export default class LauncherMechanism extends PhetioObject {
  public readonly speedMeanProperty: NumberProperty;
  public readonly speedStandardDeviationProperty: NumberProperty;

  public constructor( tandem: Tandem, speedMean: number, speedStandardDeviation: number ) {

    super( {
      tandem: tandem,
      phetioType: LauncherMechanism.LauncherMechanismIO,
      phetioState: false
    } );

    this.speedMeanProperty = new NumberProperty( speedMean, {
      tandem: tandem.createTandem( 'speedMeanProperty' ),
      range: new Range( 20, 30 )
    } );

    this.speedStandardDeviationProperty = new NumberProperty( speedStandardDeviation, {
      tandem: tandem.createTandem( 'speedStandardDeviationProperty' ),
      range: new Range( 0.2, 1.5 )
    } );
  }

  public static LauncherMechanismIO = new IOType( 'LauncherMechanismIO', {
    valueType: LauncherMechanism,
    documentation: 'Mechanism used to launch the projectile',
    supertype: ReferenceIO( IOType.ObjectIO ),
    defaultDeserializationMethod: 'fromStateObject'
  } );
}
projectileDataLab.register( 'LauncherMechanism', LauncherMechanism );

export const SPRING = new LauncherMechanism( Tandem.GLOBAL_MODEL.createTandem( 'launcherMechanisms' ).createTandem( 'spring' ), 25, 0.3 );
export const PRESSURE = new LauncherMechanism( Tandem.GLOBAL_MODEL.createTandem( 'launcherMechanisms' ).createTandem( 'pressure' ), 25, 0.6 );
export const EXPLOSION = new LauncherMechanism( Tandem.GLOBAL_MODEL.createTandem( 'launcherMechanisms' ).createTandem( 'explosion' ), 25, 1.2 );
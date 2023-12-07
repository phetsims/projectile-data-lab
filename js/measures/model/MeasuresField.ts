// Copyright 2023, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { FieldOptions } from '../../common/model/Field.js';
import projectileDataLab from '../../projectileDataLab.js';
import { VSMFieldIdentifier } from '../../common-vsm/model/VSMFieldIdentifier.js';
import VSMField from '../../common-vsm/model/VSMField.js';
import Property from '../../../../axon/js/Property.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

/**
 * The MeasuresField is an extension of the Field class that adds fields for the Measures model.
 * These fields will keep track of the average distance and standard deviation of distance for landed projectiles.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type MeasuresFieldOptions = SelfOptions & FieldOptions;

export default class MeasuresField extends VSMField {

  public readonly landedDistanceAverageProperty: Property<number | null>;

  public readonly landedDistanceStandardDeviationProperty: Property<number | null>;

  public constructor( identifier: VSMFieldIdentifier, providedOptions: MeasuresFieldOptions ) {
    super( identifier, providedOptions );

    this.landedDistanceAverageProperty = new Property<number | null>( null, {
      tandem: providedOptions.tandem.createTandem( 'landedDistanceAverageProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );

    this.landedDistanceStandardDeviationProperty = new Property<number | null>( null, {
      tandem: providedOptions.tandem.createTandem( 'landedDistanceStandardDeviationProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );

    this.projectileLandedEmitter.addListener( () => {
      this.landedDistanceAverageProperty.value = _.mean( this.landedProjectiles.map( landedProjectile => landedProjectile.x ) );
      this.landedDistanceStandardDeviationProperty.value = this.getLandedDistanceStandardDeviation();
    } );
  }

  private getLandedDistanceStandardDeviation(): number {
    let sum = 0;
    let count = 0;
    const average = _.mean( this.landedProjectiles.map( landedProjectile => landedProjectile.x ) );
    this.landedProjectiles.forEach( landedProjectile => {
      assert && assert( average !== null, 'average should not be null' );
      sum += Math.pow( landedProjectile.x - average, 2 );
      count++;
    } );
    return count > 0 ? Math.sqrt( sum / count ) : 0;
  }
}

projectileDataLab.register( 'MeasuresField', MeasuresField );

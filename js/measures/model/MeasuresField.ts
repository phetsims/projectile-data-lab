// Copyright 2023-2024, University of Colorado Boulder

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import { VSMFieldIdentifier } from '../../common-vsm/model/VSMFieldIdentifier.js';
import VSMField, { VSMFieldOptions } from '../../common-vsm/model/VSMField.js';
import Property from '../../../../axon/js/Property.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Launcher from '../../common/model/Launcher.js';

/**
 * The MeasuresField is an extension of the Field class that adds fields for the Measures model.
 * These fields will keep track of the average distance and standard deviation of distance for landed projectiles.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
export type MeasuresFieldOptions = SelfOptions & VSMFieldOptions;

export default class MeasuresField extends VSMField {

  // This property represents the average distance (horizontal displacement) of landed projectiles.
  public readonly meanDistanceProperty: Property<number | null>;

  // This property represents the standard deviation of the distance (horizontal displacement) of landed projectiles.
  public readonly standardDeviationDistanceProperty: Property<number | null>;

  // This property represents the standard error of the mean distance (horizontal displacement) of landed projectiles.
  public readonly standardErrorDistanceProperty: Property<number | null>;

  public constructor( launchers: readonly Launcher[], identifier: VSMFieldIdentifier, providedOptions: MeasuresFieldOptions ) {
    super( launchers, identifier, providedOptions );

    this.meanDistanceProperty = new Property<number | null>( null, {
      tandem: providedOptions.tandem.createTandem( 'meanDistanceProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );

    this.standardDeviationDistanceProperty = new Property<number | null>( null, {
      tandem: providedOptions.tandem.createTandem( 'standardDeviationDistanceProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );

    this.standardErrorDistanceProperty = new Property<number | null>( null, {
      tandem: providedOptions.tandem.createTandem( 'standardErrorDistanceProperty' ),
      phetioValueType: NullableIO( NumberIO )
    } );

    this.projectileLandedEmitter.addListener( () => {
      this.meanDistanceProperty.value = _.mean( this.landedProjectiles.map( landedProjectile => landedProjectile.x ) );
      this.standardDeviationDistanceProperty.value = this.getStandardDeviationDistance();
      this.standardErrorDistanceProperty.value = this.getStandardDeviationDistance() / Math.sqrt( this.landedProjectiles.length );
    } );
  }

  private getStandardDeviationDistance(): number {
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

  public override clearProjectiles(): void {
    super.clearProjectiles();
    this.meanDistanceProperty.value = null;
    this.standardDeviationDistanceProperty.value = null;
    this.standardErrorDistanceProperty.value = null;
  }
}

projectileDataLab.register( 'MeasuresField', MeasuresField );

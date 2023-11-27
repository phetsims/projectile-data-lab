// Copyright 2023, University of Colorado Boulder

/**
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import PDLModel, { PDLModelOptions } from '../../common/model/PDLModel.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Field from '../../common/model/Field.js';
import Multilink from '../../../../axon/js/Multilink.js';

type SelfOptions = EmptySelfOptions;

type SamplingModelOptions = SelfOptions & StrictOmit<PDLModelOptions, 'timeSpeedValues' | 'fields'>;

export default class SamplingModel extends PDLModel {

  public readonly sampleSizeProperty: Property<number>;

  public constructor( providedOptions: SamplingModelOptions ) {

    const fields: Field[] = [];
    const NUM_LAUNCHERS = 6;
    const NUM_SAMPLE_SIZES = 4;
    for ( let i = 0; i < NUM_LAUNCHERS; i++ ) {
      for ( let j = 0; j < NUM_SAMPLE_SIZES; j++ ) {
        const fieldNumber = 1 + j + i * NUM_SAMPLE_SIZES;
        fields.push( new Field( {
          tandem: providedOptions.tandem.createTandem( 'field' + fieldNumber )
        } ) );
      }
    }

    const options = optionize<SamplingModelOptions, SelfOptions, PDLModelOptions>()( {
      timeSpeedValues: [ TimeSpeed.NORMAL, TimeSpeed.FAST ],
      fields: fields
    }, providedOptions );

    super( options );

    this.sampleSizeProperty = new Property<number>( 2, {
      validValues: [ 2, 5, 15, 40 ],
      tandem: options.tandem.createTandem( 'sampleSizeProperty' ),
      phetioDocumentation: 'This property configures the number of projectiles in a sample',
      phetioValueType: NumberIO
    } );

    // TODO: The field is a derived property based on the selected launcher and sample size. https://github.com/phetsims/projectile-data-lab/issues/7
    // TODO: Fix reentrant error - see https://github.com/phetsims/projectile-data-lab/issues/7
    Multilink.multilink( [ this.sampleSizeProperty, this.launcherTypeProperty ], ( sampleSize, launcherType ) => {
      // Get the index of sampleSize in the validValues array
      // const numSampleSizes = this.sampleSizeProperty.validValues!.length;
      // const sampleSizeIndex = this.sampleSizeProperty.validValues!.indexOf( sampleSize );
      // const fieldNumber = sampleSizeIndex + ( launcherType - 1 ) * numSampleSizes;
      // this.fieldProperty.value = this.fields[ fieldNumber ];
    } );
  }

  /**
   * Resets the model.
   */
  public override reset(): void {
    super.reset();
    this.sampleSizeProperty.reset();
  }
}

projectileDataLab.register( 'SamplingModel', SamplingModel );
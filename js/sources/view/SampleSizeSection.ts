// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { Text } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SampleSizeSectionOptions = SelfOptions & PDLPanelSectionOptions;

export default class SampleSizeSection extends PDLPanelSection {

  public constructor( sampleSizeProperty: Property<number>, providedOptions: SampleSizeSectionOptions ) {

    const sampleSizeRadioButtonGroupItems: RectangularRadioButtonGroupItem<number>[] = [];

    sampleSizeProperty.validValues?.forEach( sampleSize => {
      sampleSizeRadioButtonGroupItems.push( {
          value: sampleSize,
          tandemName: `sampleSize${sampleSize}RadioButton`,
          createNode: () => new Text( sampleSize.toString() )
        } );
      } );

    const sampleSizeRadioButtonGroup = new RectangularRadioButtonGroup( sampleSizeProperty, sampleSizeRadioButtonGroupItems, {
      tandem: providedOptions.tandem.createTandem( 'sampleSizeRadioButtonGroup' ),
      orientation: 'horizontal'
    } );
    super( 'Sample Size', sampleSizeRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'SampleSizeSection', SampleSizeSection );
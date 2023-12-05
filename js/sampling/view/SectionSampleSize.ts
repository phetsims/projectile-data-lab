// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLText from '../../common/view/PDLText.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionSampleSizeOptions = SelfOptions & PDLPanelSectionOptions;

export default class SectionSampleSize extends PDLPanelSection {

  public constructor( sampleSizeProperty: Property<number>, providedOptions: SectionSampleSizeOptions ) {

    const sampleSizeRadioButtonGroupItems = sampleSizeProperty.validValues!.map( sampleSize => {
      return {
        value: sampleSize,
        tandemName: `sampleSize${sampleSize}RadioButton`,
        createNode: () => new PDLText( sampleSize.toString() )
      };
    } );

    const sampleSizeRadioButtonGroup = new RectangularRadioButtonGroup( sampleSizeProperty, sampleSizeRadioButtonGroupItems, {
      tandem: providedOptions.tandem.createTandem( 'sampleSizeRadioButtonGroup' ),
      orientation: 'horizontal'
    } );
    super( ProjectileDataLabStrings.sampleSizeStringProperty, sampleSizeRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'SectionSampleSize', SectionSampleSize );
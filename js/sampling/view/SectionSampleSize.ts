// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLPanelSection, { PDLPanelSectionOptions } from '../../common/view/PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLText from '../../common/view/PDLText.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

/**
 * The SectionSampleSize shows the sample size radio buttons.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type SectionSampleSizeOptions = SelfOptions & WithRequired<PDLPanelSectionOptions, 'tandem'>;

export default class SectionSampleSize extends PDLPanelSection {

  public constructor( sampleSizeProperty: Property<number>, providedOptions: SectionSampleSizeOptions ) {

    const sampleSizeRadioButtonGroupItems = sampleSizeProperty.validValues!.map( sampleSize => {
      return {
        value: sampleSize,
        tandemName: `sampleSize${sampleSize}RadioButton`,
        createNode: () => new PDLText( sampleSize.toString(), { fontSize: 16 } )
      };
    } );

    const sampleSizeRadioButtonGroup = new RectangularRadioButtonGroup( sampleSizeProperty, sampleSizeRadioButtonGroupItems, {
      tandem: providedOptions.tandem.createTandem( 'sampleSizeRadioButtonGroup' ),
      phetioFeatured: true,
      orientation: 'horizontal',
      spacing: 6,
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 7,
        yMargin: 7
      },
      layoutOptions: {
        align: 'center'
      }
    } );
    super( ProjectileDataLabStrings.sampleSizeStringProperty, sampleSizeRadioButtonGroup, providedOptions );
  }
}

projectileDataLab.register( 'SectionSampleSize', SectionSampleSize );
// Copyright 2023, University of Colorado Boulder

import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import PDLPanelSection from '../../common/view/PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import projectileDataLab from '../../projectileDataLab.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLText from '../../common/view/PDLText.js';
import PDLConstants from '../../common/PDLConstants.js';
import VSMField from '../model/VSMField.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type FieldPanelOptions = SelfOptions & PDLPanelOptions;

export default class FieldSelectorPanel<T extends VSMField> extends PDLPanel {
  public constructor( fieldProperty: Property<T>, providedOptions: FieldPanelOptions ) {

    const options = optionize<FieldPanelOptions, SelfOptions, PDLPanelOptions>()( {
      top: PDLConstants.SCREEN_VIEW_Y_MARGIN
    }, providedOptions );

    // Show radio buttons for the fields
    const fieldRadioButtonGroup = new RectangularRadioButtonGroup( fieldProperty, _.range( 1, 9 ).map( i => {
      return {
        value: fieldProperty.validValues![ i - 1 ],
        tandemName: 'field' + i + 'RadioButton',
        createNode: () => new PDLText( i.toString() )
      };
    } ), {
      tandem: options.tandem.createTandem( 'fieldRadioButtonGroup' ),
      orientation: 'horizontal',
      spacing: 5,
      radioButtonOptions: {
        preferredWidth: 40
      }

      // TODO: Preferred width is not working to get the wrap, see https://github.com/phetsims/projectile-data-lab/issues/7
      // wrap: true,
      // preferredWidth: 120
    } );

    super( new PDLPanelSection( ProjectileDataLabStrings.fieldStringProperty, fieldRadioButtonGroup, {
      centerTitleAndContent: true,
      tandem: options.tandem.createTandem( 'fieldPanelSection' ) // TODO: Unnecessary tandem? See https://github.com/phetsims/projectile-data-lab/issues/7
    } ), options );
  }
}

projectileDataLab.register( 'FieldSelectorPanel', FieldSelectorPanel );
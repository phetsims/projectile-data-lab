// Copyright 2023, University of Colorado Boulder

import { PDLPanel, PDLPanelOptions } from './PDLPanel.js';
import PDLPanelSection from './PDLPanelSection.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import projectileDataLab from '../../projectileDataLab.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Property from '../../../../axon/js/Property.js';
import { Text } from '../../../../scenery/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type FieldPanelOptions = SelfOptions & PDLPanelOptions;

export default class FieldPanel extends PDLPanel {
  public constructor( providedOptions: FieldPanelOptions ) {

    const fieldProperty = new Property( 'field1' );

    // Show radio buttons for the fields
    const fieldRadioButtonGroup = new RectangularRadioButtonGroup( fieldProperty, _.range( 1, 7 ).map( i => {
      return {
        value: 'field' + i,
        tandemName: 'field' + i + 'RadioButton',
        createNode: () => new Text( i.toString() )
      };
    } ), {
      tandem: providedOptions.tandem.createTandem( 'fieldRadioButtonGroup' ),
      orientation: 'horizontal'

      // TODO: Preferred width is not working to get the wrap, see https://github.com/phetsims/projectile-data-lab/issues/7
      // wrap: true,
      // preferredWidth: 250
    } );
    super( [ new PDLPanelSection( ProjectileDataLabStrings.fieldStringProperty, fieldRadioButtonGroup, {
      tandem: providedOptions.tandem.createTandem( 'fieldPanelSection' ) // TODO: Unnecessary tandem? See https://github.com/phetsims/projectile-data-lab/issues/7
    } ) ], {
      tandem: providedOptions.tandem.createTandem( 'fieldPanel' )
    } );
  }
}
projectileDataLab.register( 'FieldPanel', FieldPanel );
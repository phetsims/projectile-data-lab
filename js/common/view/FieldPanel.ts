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
    const fieldRadioButtonGroup = new RectangularRadioButtonGroup( fieldProperty, [ {
      value: 'field1',
      tandemName: 'field1RadioButton',
      createNode: () => new Text( '1' )
    } ], {
      tandem: providedOptions.tandem.createTandem( 'fieldRadioButtonGroup' )
    } );
    super( [ new PDLPanelSection( ProjectileDataLabStrings.fieldStringProperty, fieldRadioButtonGroup, {
      tandem: providedOptions.tandem.createTandem( 'fieldPanelSection' ) // TODO: Unnecessary tandem? See https://github.com/phetsims/projectile-data-lab/issues/7
    } ) ], {
      tandem: providedOptions.tandem.createTandem( 'fieldPanel' )
    } );
  }
}
projectileDataLab.register( 'FieldPanel', FieldPanel );
// Copyright 2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLText from '../../common/view/PDLText.js';
import Panel from '../../../../sun/js/Panel.js';
import PDLColors from '../../common/PDLColors.js';
import { Circle, KeyboardListener, Rectangle } from '../../../../scenery/js/imports.js';
import Field from '../../common/model/Field.js';

/**
 * The FieldRadioButtonGroup is a group of buttons that allows the user to select a field.
 * This appears beneath the fields on the VSM screens.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type FieldRadioButtonGroupOptions = SelfOptions & RectangularRadioButtonGroupOptions;

export default class FieldRadioButtonGroup<T extends Field> extends RectangularRadioButtonGroup<T> {
  public constructor( fieldProperty: Property<T>, fields: T[], providedOptions: FieldRadioButtonGroupOptions ) {

    const options = optionize<FieldRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {
      phetioFeatured: true,
      orientation: 'horizontal',
      spacing: 3,
      radioButtonOptions: {
        preferredWidth: 40,
        baseColor: PDLColors.fieldSignFillColorProperty,
        buttonAppearanceStrategyOptions: {
          selectedStroke: PDLColors.fieldSignTextColorProperty,
          selectedLineWidth: 3,
          overStroke: PDLColors.fieldSignTextColorProperty,
          deselectedStroke: PDLColors.fieldSignTextColorProperty,
          deselectedLineWidth: 2,
          deselectedButtonOpacity: 0.8
        }
      }
    }, providedOptions );

    const fieldRadioButtons = fields.map( field => {

      const fieldNumber = fields.indexOf( field ) + 1;

      const dataIndicator = new Circle( 3, {
        visibleProperty: field.isContainingDataProperty,
        fill: PDLColors.fieldSignTextColorProperty,
        pickable: false
      } );

      const buttonText = new PDLText( fieldNumber.toString(), {
        fill: PDLColors.fieldSignTextColorProperty,
        fontSize: 20,
        fontWeight: 'bold'
      } );

      const buttonContents = new Rectangle( buttonText.bounds.dilatedX( 10 ).dilatedY( 1 ), {
        children: [ buttonText, dataIndicator ]
      } );

      dataIndicator.top = buttonContents.top;
      dataIndicator.left = buttonContents.left;

      buttonText.centerX = buttonContents.centerX;

      return {
        value: fieldProperty.validValues![ fieldNumber - 1 ],
        tandemName: 'field' + fieldNumber + 'RadioButton',
        createNode: () => new Panel( buttonContents, {
          fill: null,
          stroke: null,
          xMargin: 0,
          yMargin: 0
        } )
      };
    } );

    super( fieldProperty, fieldRadioButtons, options );

    // a listener that selects a field based on the keystroke, regardless of where focus is in the document
    this.addInputListener( new KeyboardListener( {
      keys: [ '1', '2', '3', '4', '5', '6' ] as const,
      callback: ( event, keysPressed ) => {
        const key = parseInt( keysPressed, 10 );
        fieldProperty.value = fields[ key - 1 ];

        // Move focus to the radio button that was selected. Without this line, focus would incorrectly remain
        // on the previous button.
        this.getButtonForValue( fieldProperty.value ).focus();
      }
    } ) );
  }
}

projectileDataLab.register( 'FieldRadioButtonGroup', FieldRadioButtonGroup );
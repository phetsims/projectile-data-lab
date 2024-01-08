// Copyright 2023-2024, University of Colorado Boulder

import { PDLPanel, PDLPanelOptions } from '../../common/view/PDLPanel.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import projectileDataLab from '../../projectileDataLab.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLText from '../../common/view/PDLText.js';
import PDLConstants from '../../common/PDLConstants.js';
import VSMField from '../model/VSMField.js';
import Panel from '../../../../sun/js/Panel.js';
import PDLColors from '../../common/PDLColors.js';
import { Circle, HBox, KeyboardListener, Rectangle } from '../../../../scenery/js/imports.js';

/**
 * Panel that allows the user to select a field. This appears beneath the fields for the VSM screens.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

type SelfOptions = EmptySelfOptions;
type FieldPanelOptions = SelfOptions & PDLPanelOptions;

export default class FieldSelectorPanel<T extends VSMField> extends PDLPanel {
  public constructor( fieldProperty: Property<T>, fields: T[], providedOptions: FieldPanelOptions ) {

    const options = optionize<FieldPanelOptions, SelfOptions, PDLPanelOptions>()( {
      top: PDLConstants.SCREEN_VIEW_Y_MARGIN
    }, providedOptions );

    // Show radio buttons for the fields
    const fieldRadioButtonGroup = new RectangularRadioButtonGroup( fieldProperty,
      fields.map( field => {

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
      } ), {
        tandem: options.tandem.createTandem( 'fieldRadioButtonGroup' ),
        orientation: 'horizontal',
        spacing: 5,
        radioButtonOptions: {
          preferredWidth: 40,
          baseColor: PDLColors.fieldSignFillColorProperty,
          buttonAppearanceStrategyOptions: {
            selectedStroke: PDLColors.fieldSignStrokeColorProperty,
            selectedLineWidth: 2,
            deselectedStroke: null,
            deselectedButtonOpacity: 0.8
          }
        }
      } );

    super( new HBox( {
      spacing: 10,
      leftMargin: 5,
      children: [
        new PDLText( ProjectileDataLabStrings.fieldStringProperty, {
          fill: 'black',
          fontSize: 16,
          maxWidth: 100
        } ),
        fieldRadioButtonGroup
      ]
    } ), options );

    // a listener that selects a field based on the keystroke, regardless of where focus is in the document
    this.addInputListener( new KeyboardListener( {
      keys: [ 'alt+1', 'alt+2', 'alt+3', 'alt+4', 'alt+5', 'alt+6', 'alt+7', 'alt+8' ] as const,
      global: true,
      callback: ( event, keysPressed ) => {
        const numberKey = keysPressed.split( '+' )[ 1 ];
        const key = parseInt( numberKey, 10 );
        fieldProperty.value = fields[ key - 1 ];
      }
    } ) );
  }
}

projectileDataLab.register( 'FieldSelectorPanel', FieldSelectorPanel );
// Copyright 2023, University of Colorado Boulder

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
import { HBox } from '../../../../scenery/js/imports.js';

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
        createNode: () => new Panel( new PDLText( i.toString(), {
          fill: PDLColors.fieldSignTextColorProperty,
          fontSize: 24,
          fontWeight: 'bold'
        } ), {
          fill: null,
          stroke: null,
          xMargin: 10,
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
  }
}

projectileDataLab.register( 'FieldSelectorPanel', FieldSelectorPanel );
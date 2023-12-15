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
import { Node } from '../../../../scenery/js/imports.js';
import PDLPanelSection from '../../common/view/PDLPanelSection.js';

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
          fill: PDLColors.fieldBorderStrokeColorProperty,
          fontSize: 16,
          fontWeight: 'bold'
        } ), {
          fill: null,
          stroke: null,
          xMargin: 6,
          yMargin: 2
        } )
      };
    } ), {
      tandem: options.tandem.createTandem( 'fieldRadioButtonGroup' ),
      orientation: 'horizontal',
      spacing: 2,
      radioButtonOptions: {
        preferredWidth: 40,
        baseColor: PDLColors.fieldFillColorProperty,
        buttonAppearanceStrategyOptions: {
          selectedStroke: 'black',
          deselectedStroke: null
        }
      },
      preferredWidth: 150,
      lineSpacing: 5,
      wrap: true,
      xMargin: 0.5
    } );

    super( new PDLPanelSection( ProjectileDataLabStrings.fieldStringProperty, new Node( { children: [ fieldRadioButtonGroup ] } ), {
    } ), options );
  }
}

projectileDataLab.register( 'FieldSelectorPanel', FieldSelectorPanel );
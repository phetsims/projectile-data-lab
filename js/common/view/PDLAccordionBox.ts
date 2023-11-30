// Copyright 2023, University of Colorado Boulder

/**
 * The PDLAccordionBox is an accordion UI component for the Projectile Data Lab simulation.
 * It contains the histogram component as well as associated controls.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import projectileDataLab from '../../projectileDataLab.js';
import Property from '../../../../axon/js/Property.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import PDLConstants from '../PDLConstants.js';

type SelfOptions = {
  binWidthProperty: Property<number>;
};

export type PDLAccordionBoxOptions =
  SelfOptions
  & WithRequired<AccordionBoxOptions, 'tandem'>;

export default class PDLAccordionBox extends AccordionBox {
  public constructor( comboBoxParent: Node, content: Node, providedOptions: PDLAccordionBoxOptions ) {

    const margin = 10;

    const comboBoxItems = [];
    const validBinWidths = providedOptions.binWidthProperty.validValues ?? [];
    for ( let i = 0; i < validBinWidths.length; i++ ) {
      const binWidth = validBinWidths[ i ];
      comboBoxItems.push( {
        value: binWidth,
        createNode: () => new Text( binWidth.toString(), {
          font: PDLConstants.PRIMARY_FONT
        } ),
        tandemName: `binWidth${binWidth}Item`
      } );
    }

    const contentContainer = new VBox( {
      children: [
        content
      ],
      spacing: margin,
      align: 'left'
    } );

    const labelAndComboBoxContainer = new HBox( {
      children: [
        new Text( 'Bin width:', {
          font: PDLConstants.PRIMARY_FONT,
          layoutOptions: {
            topMargin: PDLConstants.PRIMARY_FONT.getNumericSize() / 2,
            rightMargin: margin
          }
        } )
      ],
      align: 'top'
    } );

    const comboBoxContainer = new VBox( {
      children: [],
      align: 'left'
    } );

    const binWidthComboBox = new ComboBox( providedOptions.binWidthProperty, comboBoxItems, comboBoxParent, {
      listPosition: 'below',
      tandem: providedOptions.tandem.createTandem( 'binWidthComboBox' )
    } );

    comboBoxContainer.addChild( binWidthComboBox );
    labelAndComboBoxContainer.addChild( comboBoxContainer );
    contentContainer.addChild( labelAndComboBoxContainer );

    const options = optionize<PDLAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      titleAlignX: 'left',
      titleXSpacing: margin,
      buttonXMargin: margin,
      buttonYMargin: margin,
      contentYMargin: margin,
      contentYSpacing: 0
    }, providedOptions );
    super( contentContainer, options );
  }
}

projectileDataLab.register( 'PDLAccordionBox', PDLAccordionBox );
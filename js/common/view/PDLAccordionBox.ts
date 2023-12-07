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
import { HBox, Node, VBox } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import projectileDataLab from '../../projectileDataLab.js';
import Property from '../../../../axon/js/Property.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import PDLConstants from '../PDLConstants.js';
import PDLColors from '../PDLColors.js';
import PDLText from './PDLText.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import { BIN_STRATEGY_PROPERTY } from '../PDLQueryParameters.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';

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
        createNode: () => new PDLText( new PatternStringProperty( ProjectileDataLabStrings.binWidthMPatternStringProperty, {
          binWidth: binWidth
        } ) ),
        tandemName: `binWidth${binWidth}Item`
      } );
    }

    const binWidthComboBox = new ComboBox( providedOptions.binWidthProperty, comboBoxItems, comboBoxParent, {
      listPosition: 'below',
      tandem: providedOptions.tandem.createTandem( 'binWidthComboBox' )
    } );

    const labelAndComboBoxContainer = new HBox( {
      children: [
        new ToggleNode( BIN_STRATEGY_PROPERTY, [ {
          value: 'binWidth',
          createNode: () => new PDLText( 'Bin width:' )
        }, {
          value: 'totalBins',
          createNode: () => new PDLText( 'Total bins:' )
        } ], {
          alignChildren: ToggleNode.RIGHT,
          layoutOptions: {
            topMargin: PDLConstants.PRIMARY_FONT.getNumericSize() / 2,
            rightMargin: margin
          }
        } ),
        binWidthComboBox
      ],
      align: 'top'
    } );

    const contentContainer = new VBox( {
      children: [
        content,
        labelAndComboBoxContainer
      ],
      spacing: margin,
      align: 'left'
    } );

    const options = optionize<PDLAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      fill: PDLColors.panelColorProperty,
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
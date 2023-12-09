// Copyright 2023, University of Colorado Boulder

/**
 * The PDLAccordionBox is an accordion UI component for the Projectile Data Lab simulation.
 * It contains the histogram component as well as associated controls.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { HBox, Node } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import projectileDataLab from '../../projectileDataLab.js';
import Property from '../../../../axon/js/Property.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import PDLColors from '../PDLColors.js';
import PDLText from './PDLText.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import { BIN_STRATEGY_PROPERTY } from '../PDLQueryParameters.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import Utils from '../../../../dot/js/Utils.js';
import ABSwitch from '../../../../sun/js/ABSwitch.js';
import { HistogramRepresentation } from '../model/HistogramRepresentation.js';
import HistogramIconNode from './HistogramIconNode.js';

type SelfOptions = EmptySelfOptions;

export type PDLAccordionBoxOptions =
  SelfOptions
  & WithRequired<AccordionBoxOptions, 'tandem'>;

export default class PDLAccordionBox extends AccordionBox {
  public constructor( comboBoxParent: Node,
                      content: Node,
                      selectedBinWidthProperty: Property<number>,
                      selectedTotalBinsProperty: Property<number>,
                      histogramRepresentationProperty: Property<HistogramRepresentation>,
                      providedOptions: PDLAccordionBoxOptions ) {

    const margin = 8;

    class BinWidthComboBox extends ComboBox<number> {
      public constructor() {
        const validBinWidths = selectedBinWidthProperty.validValues ?? [];
        const comboBoxItems = validBinWidths.map( binWidth => {
          return {
            value: binWidth,
            createNode: () => new PDLText( new PatternStringProperty( ProjectileDataLabStrings.binWidthMPatternStringProperty, {
              binWidth: binWidth
            } ) ),
            tandemName: `binWidth${binWidth}Item`
          };
        } );
        super( selectedBinWidthProperty, comboBoxItems, comboBoxParent, {
          listPosition: 'below',
          tandem: providedOptions.tandem.createTandem( 'binWidthComboBox' )
        } );
      }
    }

    class TotalBinsComboBox extends ComboBox<number> {
      public constructor() {
        const comboBoxItems = ( selectedTotalBinsProperty.validValues ?? [] ).map( totalBins => {
          return {
            value: totalBins,
            createNode: () => new PDLText( Utils.toFixed( totalBins, 0 ) ),
            tandemName: `totalBins${totalBins}Item`
          };
        } );
        super( selectedTotalBinsProperty, comboBoxItems, comboBoxParent, {
          listPosition: 'below',
          tandem: providedOptions.tandem.createTandem( 'totalBinsComboBox' )
        } );
      }
    }

    const labelAndComboBoxContainer = new HBox( {
      align: 'center',
      children: [

        // Use a separate ToggleNode for each one, so they don't change location on the screen when changing between
        // strategies
        new ToggleNode( BIN_STRATEGY_PROPERTY, [ {
          value: 'binWidth',
          createNode: () => new PDLText( 'Bin width:' )
        }, {
          value: 'totalBins',
          createNode: () => new PDLText( 'Total bins:' )
        } ], {
          alignChildren: ToggleNode.RIGHT,
          layoutOptions: {
            rightMargin: margin
          },
          tandem: providedOptions.tandem.createTandem( 'binWidthLabel' )
        } ),
        new ToggleNode( BIN_STRATEGY_PROPERTY, [ {
          value: 'binWidth',
          createNode: () => new BinWidthComboBox()
        }, {
          value: 'totalBins',
          createNode: () => new TotalBinsComboBox()
        } ], {
          alignChildren: ToggleNode.LEFT,
          layoutOptions: {
            rightMargin: margin
          }
        } )
      ]
    } );

    // REVIEW: Why are these controls out here instead of in HistogramNode?
    const barBlockSwitch = new ABSwitch( histogramRepresentationProperty, 'blocks', new HistogramIconNode( 'blocks' ), 'bars', new HistogramIconNode( 'bars' ), {
      tandem: providedOptions.tandem.createTandem( 'barBlockSwitch' ),
      spacing: margin,
      toggleSwitchOptions: {
        maxWidth: 32
      }
    } );

    labelAndComboBoxContainer.leftTop = content.leftBottom.plusXY( margin, -15 );
    barBlockSwitch.rightTop = content.rightBottom.plusXY( -margin, -15 );

    const contentContainer = new Node( {
      children: [
        content,
        labelAndComboBoxContainer,
        barBlockSwitch
      ]
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
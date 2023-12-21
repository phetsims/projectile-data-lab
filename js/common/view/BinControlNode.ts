// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { HBox, HBoxOptions, Node } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import PDLText from './PDLText.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import Utils from '../../../../dot/js/Utils.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import { BIN_STRATEGY_PROPERTY } from '../PDLQueryParameters.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
type BinControlNodeOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

export default class BinControlNode extends HBox {
  public constructor( comboBoxParent: Node,
                      selectedBinWidthProperty: Property<number>,
                      selectedTotalBinsProperty: Property<number>,
                      providedOptions: BinControlNodeOptions ) {


    const margin = 8;

    // The bin width and total bins combo boxes are created here since they require a listParent, and hence cannot
    // be constructed in HistogramNode (which must be constructed before the listParent is created).
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

    const options = optionize<BinControlNodeOptions, SelfOptions, HBoxOptions>()( {
      align: 'center',
      children: [

        // Use a separate ToggleNode for each one, so they don't change location on the screen when changing between
        // strategies
        new ToggleNode( BIN_STRATEGY_PROPERTY, [ {
          value: 'binWidth',
          createNode: () => new PDLText( ProjectileDataLabStrings.binWidthStringProperty, {
            maxWidth: 120
          } )
        }, {
          value: 'totalBins',
          createNode: () => new PDLText( ProjectileDataLabStrings.totalBinsStringProperty, {
            maxWidth: 120
          } )
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
    }, providedOptions );

    super( options );
  }
}

projectileDataLab.register( 'BinControlNode', BinControlNode );
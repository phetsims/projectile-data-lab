// Copyright 2023-2024, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import StaticToolPanel, { ICON_WIDTH, StaticToolPanelOptions } from '../../common-vsm/view/StaticToolPanel.js';
import { PDLPanelOptions } from '../../common/view/PDLPanel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node } from '../../../../scenery/js/imports.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import Property from '../../../../axon/js/Property.js';
import DataMeasuresOverlay from './DataMeasuresOverlay.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type SelfOptions = EmptySelfOptions;
type MeasuresStaticToolPanelOptions = SelfOptions & StaticToolPanelOptions;

/**
 * The MeasuresStaticToolPanel shows checkboxes to select the static (non-interactive) tools.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
export default class MeasuresStaticToolPanel extends StaticToolPanel {
  public constructor( arePathsVisibleProperty: Property<boolean>, isLaunchAngleVisibleProperty: Property<boolean>,
                      isLaunchSpeedVisibleProperty: Property<boolean>,
                      isMeanVisibleProperty: Property<boolean>,
                      isStandardDeviationVisibleProperty: Property<boolean>,
                      isValuesVisibleProperty: Property<boolean>,
                      providedOptions: PDLPanelOptions ) {

    class DataMeasuresIconNode extends Node {
      public constructor( showMean: boolean, showStandardDeviation: boolean ) {

        const dataMeasuresNode = new DataMeasuresOverlay(
          new ModelViewTransform2(),
          new Property( 0 ),
          new Property( 20 ),
          new BooleanProperty( showMean ),
          new BooleanProperty( showStandardDeviation ),
          new BooleanProperty( false ),
          ICON_WIDTH, {
            context: 'icon'
          } )
          .rasterized( {
            resolution: 4
          } );
        super( {
          children: [ dataMeasuresNode ],
          pickable: false,
          maxWidth: ICON_WIDTH
        } );
      }
    }

    const options = optionize<PDLPanelOptions, SelfOptions, MeasuresStaticToolPanelOptions>()( {
      additionalVerticalCheckboxGroupItems: [
        {
          property: isMeanVisibleProperty,
          createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.meanStringProperty, new DataMeasuresIconNode( true, false ) ),
          tandemName: 'meanCheckbox'
        }, {
          property: isStandardDeviationVisibleProperty,
          createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.standardDeviationStringProperty, new DataMeasuresIconNode( false, true ) ),
          tandemName: 'standardDeviationCheckbox'
        }, {
          property: isValuesVisibleProperty,
          createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.valuesStringProperty, new Node() ),
          tandemName: 'valuesCheckbox'
        }
      ]
    }, providedOptions );

    super( arePathsVisibleProperty, isLaunchAngleVisibleProperty, isLaunchSpeedVisibleProperty, options );
  }
}

projectileDataLab.register( 'MeasuresStaticToolPanel', MeasuresStaticToolPanel );
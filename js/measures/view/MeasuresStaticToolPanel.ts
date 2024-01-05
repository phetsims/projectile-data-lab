// Copyright 2023, University of Colorado Boulder

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
                      isDataMeasuresVisibleProperty: Property<boolean>,
                      providedOptions: PDLPanelOptions ) {

    class DataMeasuresIconNode extends Node {
      public constructor() {

        const dataMeasuresNode = new DataMeasuresOverlay( new ModelViewTransform2(),
          new Property( 0 ), new Property( 20 ), ICON_WIDTH, new BooleanProperty( true ), {
            isIcon: true
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
          property: isDataMeasuresVisibleProperty,
          createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.dataMeasuresStringProperty, new DataMeasuresIconNode() ),
          tandemName: 'dataMeasuresCheckbox'
        }
      ]
    }, providedOptions );

    super( arePathsVisibleProperty, isLaunchAngleVisibleProperty, isLaunchSpeedVisibleProperty, options );
  }
}

projectileDataLab.register( 'MeasuresStaticToolPanel', MeasuresStaticToolPanel );
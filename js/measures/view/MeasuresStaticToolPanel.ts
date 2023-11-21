// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import StaticToolPanel, { StaticToolPanelOptions } from '../../common-vsm/view/StaticToolPanel.js';
import { PDLPanelOptions } from '../../common/view/panels/PDLPanel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';

type SelfOptions = EmptySelfOptions;
type MeasuresStaticToolPanelOptions = SelfOptions & StaticToolPanelOptions;

export default class MeasuresStaticToolPanel extends StaticToolPanel {
  public constructor( providedOptions: PDLPanelOptions ) {

    const options = optionize<PDLPanelOptions, SelfOptions, MeasuresStaticToolPanelOptions>()( {
      additionalVerticalCheckboxGroupItems: [
        {
          property: new BooleanProperty( false ),
          createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.dataMeasuresStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'red' } ) )
        },
        {
          property: new BooleanProperty( false ),
          createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.intervalToolStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'red' } ) )
        }
      ]
    }, providedOptions );

    super( options );
  }
}

projectileDataLab.register( 'MeasuresStaticToolPanel', MeasuresStaticToolPanel );
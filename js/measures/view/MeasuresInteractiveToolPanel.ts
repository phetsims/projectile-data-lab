// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import { PDLPanelOptions } from '../../common/view/panels/PDLPanel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import InteractiveToolPanel, { InteractiveToolPanelOptions } from '../../common-vsm/view/InteractiveToolPanel.js';

type SelfOptions = EmptySelfOptions;
type MeasuresInteractiveToolPanelOptions = SelfOptions & InteractiveToolPanelOptions;

export default class MeasuresInteractiveToolPanel extends InteractiveToolPanel {
  public constructor( providedOptions: PDLPanelOptions ) {

    const options = optionize<PDLPanelOptions, SelfOptions, MeasuresInteractiveToolPanelOptions>()( {
      additionalVerticalCheckboxGroupItems: [
        {
          property: new BooleanProperty( false ),
          createNode: () => InteractiveToolPanel.createCheckboxRow( ProjectileDataLabStrings.intervalToolStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'red' } ) )
        }
      ]
    }, providedOptions );

    super( options );
  }
}

projectileDataLab.register( 'MeasuresInteractiveToolPanel', MeasuresInteractiveToolPanel );
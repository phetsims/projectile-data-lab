// Copyright 2023, University of Colorado Boulder

import projectileDataLab from '../../projectileDataLab.js';
import StaticToolPanel, { StaticToolPanelOptions } from '../../common-vsm/view/StaticToolPanel.js';
import { PDLPanelOptions } from '../../common/view/PDLPanel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;
type MeasuresStaticToolPanelOptions = SelfOptions & StaticToolPanelOptions;

export default class MeasuresStaticToolPanel extends StaticToolPanel {
  public constructor( arePathsVisibleProperty: Property<boolean>, isLaunchAngleVisibleProperty: Property<boolean>,
                      isLaunchSpeedVisibleProperty: Property<boolean>,
                      isDataMeasuresVisibleProperty: Property<boolean>,
                      isIdealDistributionVisibleProperty: Property<boolean>,
                      providedOptions: PDLPanelOptions ) {

    const options = optionize<PDLPanelOptions, SelfOptions, MeasuresStaticToolPanelOptions>()( {
      additionalVerticalCheckboxGroupItems: [
        {
          property: isDataMeasuresVisibleProperty,
          createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.dataMeasuresStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'red' } ) ),
          tandemName: 'dataMeasuresCheckbox'
        },
        {
          property: isIdealDistributionVisibleProperty,
          createNode: () => StaticToolPanel.createCheckboxRow( ProjectileDataLabStrings.idealDistributionStringProperty, new Rectangle( 0, 0, 12, 12, { fill: 'red' } ) ),
          tandemName: 'idealDistributionCheckbox'
        }
      ]
    }, providedOptions );

    super( arePathsVisibleProperty, isLaunchAngleVisibleProperty, isLaunchSpeedVisibleProperty, options );
  }
}

projectileDataLab.register( 'MeasuresStaticToolPanel', MeasuresStaticToolPanel );
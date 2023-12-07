// Copyright 2023, University of Colorado Boulder

/**
 * SimulationPreferencesContentNode displays general controls that globally affect the presentation or behavior of the simulation.
 * TODO: i18n, see https://github.com/phetsims/projectile-data-lab/issues/7
 * TODO: finalize wording, see https://github.com/phetsims/projectile-data-lab/issues/7
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Node, RichText } from '../../../../scenery/js/imports.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PreferencesPanelContentNode from '../../../../joist/js/preferences/PreferencesPanelContentNode.js';
import { BinStrategy } from '../BinStrategy.js';
import { BIN_STRATEGY_PROPERTY } from '../PDLQueryParameters.js';
import PDLText from './PDLText.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import projectileDataLab from '../../projectileDataLab.js';
import { PDLPanel } from './PDLPanel.js';

export default class SimulationPreferencesContentNode extends PreferencesPanelContentNode {

  public constructor( parentNode: Node, tandem: Tandem ) {

    const binStrategyControlTandem = tandem.createTandem( 'binStrategyControl' );

    const binTypeRadioButtonGroup = new PDLPanel( new VerticalAquaRadioButtonGroup<BinStrategy>( BIN_STRATEGY_PROPERTY, [ {
      createNode: () => new PDLText( 'Bin Width', { fontSize: 14 } ),
      value: 'binWidth',
      tandemName: 'binWidthRadioButton'
    }, {
      createNode: () => new PDLText( 'Total Bins', { fontSize: 14 } ),
      value: 'totalBins',
      tandemName: 'totalBinsRadioButton'
    } ], {
      tandem: binStrategyControlTandem.createTandem( 'radioButtonGroup' ),
      isDisposable: false,

      // Hide or show the entire row, not just one radio button
      phetioVisiblePropertyInstrumented: false
    } ) );

    const title = new PDLText( 'Histogram Bins', PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );
    const description = new RichText( 'The histogram offers two customization options for its data representation. You can either choose to define the width of the bins or specify the total number of bins in the histogram.', PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

    const binStrategyControl = new PreferencesControl( {
      labelNode: title,
      descriptionNode: description,
      controlNode: binTypeRadioButtonGroup,
      tandem: binStrategyControlTandem,
      phetioFeatured: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    super( {
      fill: 'white',
      content: [
        binStrategyControl
      ]
    } );
  }
}

projectileDataLab.register( 'SimulationPreferencesContentNode', SimulationPreferencesContentNode );
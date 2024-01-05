// Copyright 2023-2024, University of Colorado Boulder

/**
 * SimulationPreferencesContentNode displays general controls that globally affect the presentation or behavior of the simulation.
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
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';

export default class SimulationPreferencesContentNode extends PreferencesPanelContentNode {

  public constructor( parentNode: Node, tandem: Tandem ) {

    const binStrategyControlTandem = tandem.createTandem( 'binStrategyControl' );

    const binTypeRadioButtonGroup = new PDLPanel( new VerticalAquaRadioButtonGroup<BinStrategy>( BIN_STRATEGY_PROPERTY, [ {
      createNode: () => new PDLText( ProjectileDataLabStrings.binWidthStringProperty, { fontSize: 14, maxWidth: 200 } ),
      value: 'binWidth',
      tandemName: 'binWidthRadioButton'
    }, {
      createNode: () => new PDLText( ProjectileDataLabStrings.totalBinsStringProperty, { fontSize: 14, maxWidth: 200 } ),
      value: 'totalBins',
      tandemName: 'totalBinsRadioButton'
    } ], {
      tandem: binStrategyControlTandem.createTandem( 'radioButtonGroup' ),
      isDisposable: false,

      // Hide or show the entire row, not just one radio button
      phetioVisiblePropertyInstrumented: false
    } ) );

    const title = new PDLText( ProjectileDataLabStrings.histogramBinsStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );
    const description = new RichText( ProjectileDataLabStrings.histogramBinsPreferenceDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

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
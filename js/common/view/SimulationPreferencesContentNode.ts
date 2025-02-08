// Copyright 2023-2025, University of Colorado Boulder

/**
 * SimulationPreferencesContentNode displays general controls that globally affect the presentation or behavior of the simulation.
 *
 * In Projectile Data Lab, the controls are displayed in the following order:
 * projectileTypeAffectsSpeedControl, autoGenerateDataControl, showStandardErrorControl, binStrategyControl
 *
 * In Projectile Sampling Distributions, the controls are displayed in the following order:
 * autoGenerateDataControl, binStrategyControl
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import packageJSON from '../../../../joist/js/packageJSON.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import PreferencesPanelContentNode from '../../../../joist/js/preferences/PreferencesPanelContentNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import projectileDataLab from '../../projectileDataLab.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import { BinStrategy } from '../BinStrategy.js';
import PDLPreferences from '../PDLPreferences.js';
import PDLText from './PDLText.js';

export default class SimulationPreferencesContentNode extends PreferencesPanelContentNode {

  public constructor( tandem: Tandem ) {

    const autoGenerateDataControlTandem = tandem.createTandem( 'autoGenerateDataControl' );
    const projectileTypeAffectsSpeedControlTandem = tandem.createTandem( 'projectileTypeAffectsSpeedControl' );
    const binStrategyControlTandem = tandem.createTandem( 'binStrategyControl' );
    const showStandardErrorControlTandem = tandem.createTandem( 'showStandardErrorControl' );

    const content: Node[] = [];

    // In the Projectile Sampling Distributions sim, the projectileTypeAffectsSpeed and showStandardError controls are not shown
    if ( packageJSON.name === 'projectile-data-lab' ) {

      const projectileTypeAffectsSpeedControl = new PreferencesControl( {
        tandem: projectileTypeAffectsSpeedControlTandem,
        labelNode: new PDLText( ProjectileDataLabStrings.projectileTypeAffectsSpeedStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
        descriptionNode: new RichText( ProjectileDataLabStrings.projectileTypeAffectsSpeedPreferenceDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
        controlNode: new ToggleSwitch( PDLPreferences.projectileTypeAffectsSpeedProperty, false, true, PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS ),
        visiblePropertyOptions: {
          phetioFeatured: true
        }
      } );

      content.push( projectileTypeAffectsSpeedControl );
    }

    const autoGenerateDataControl = new PreferencesControl( {
      tandem: autoGenerateDataControlTandem,
      labelNode: new PDLText( ProjectileDataLabStrings.autoGenerateDataStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
      descriptionNode: new RichText( ProjectileDataLabStrings.autoGenerateDataPreferenceDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
      controlNode: new ToggleSwitch( PDLPreferences.autoGenerateDataProperty, false, true, PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS ),
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    content.push( autoGenerateDataControl );

    // In the Projectile Sampling Distributions sim, the projectileTypeAffectsSpeed and showStandardError controls are not shown
    if ( packageJSON.name === 'projectile-data-lab' ) {

      const showStandardErrorControl = new PreferencesControl( {
        tandem: showStandardErrorControlTandem,
        labelNode: new PDLText( ProjectileDataLabStrings.showStandardErrorStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
        descriptionNode: new RichText( ProjectileDataLabStrings.showStandardErrorPreferenceDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
        controlNode: new ToggleSwitch( PDLPreferences.showStandardErrorProperty, false, true, PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS ),
        visiblePropertyOptions: {
          phetioFeatured: true
        }
      } );

      content.push( showStandardErrorControl );

      const binTypeRadioButtonGroup = new VerticalAquaRadioButtonGroup<BinStrategy>( PDLPreferences.binStrategyProperty, [ {
        createNode: () => new PDLText( ProjectileDataLabStrings.binWidthStringProperty, { maxWidth: 200 } ),
        value: 'binWidth',
        tandemName: 'binWidthRadioButton'
      }, {
        createNode: () => new PDLText( ProjectileDataLabStrings.totalBinsStringProperty, { maxWidth: 200 } ),
        value: 'totalBins',
        tandemName: 'totalBinsRadioButton'
      } ], {
        tandem: binStrategyControlTandem.createTandem( 'radioButtonGroup' ),
        isDisposable: false,

        // Hide or show the entire row, not just one radio button
        phetioVisiblePropertyInstrumented: false
      } );

      const binStrategyControl = new PreferencesControl( {
        labelNode: new PDLText( ProjectileDataLabStrings.histogramBinsStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
        descriptionNode: new RichText( ProjectileDataLabStrings.histogramBinsPreferenceDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
        controlNode: binTypeRadioButtonGroup,
        tandem: binStrategyControlTandem,
        phetioFeatured: true,
        visiblePropertyOptions: {
          phetioFeatured: true
        }
      } );

      content.push( binStrategyControl );
    }

    super( {
      fill: null,
      xMargin: 0,
      content: content
    } );
  }
}

projectileDataLab.register( 'SimulationPreferencesContentNode', SimulationPreferencesContentNode );
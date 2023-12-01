// Copyright 2023, University of Colorado Boulder

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import SamplingModel from '../model/SamplingModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { PDLScreenView } from '../../common/view/PDLScreenView.js';
import SamplingLaunchPanel from './SamplingLaunchPanel.js';
import { ManualConstraint, VBox } from '../../../../scenery/js/imports.js';
import PDLConstants from '../../common/PDLConstants.js';
import SamplingAccordionBox from './SamplingAccordionBox.js';
import SamplingField from '../model/SamplingField.js';
import SampleCardsPanel from './SampleCardsPanel.js';
import SamplingFieldSignNode from './SamplingFieldSignNode.js';

type SelfOptions = EmptySelfOptions;

type SamplingScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SamplingScreenView extends PDLScreenView<SamplingField> {

  public constructor( model: SamplingModel, providedOptions: SamplingScreenViewOptions ) {
    const options = optionize<SamplingScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

    const samplingLaunchPanel = new SamplingLaunchPanel( model.presetLauncherProperty, model.sampleSizeProperty, {
      tandem: options.tandem.createTandem( 'samplingLaunchPanel' )
    } );

    const sampleCardsPanel = new SampleCardsPanel( model.fieldProperty, model.selectedSampleProperty, model.numberOfSamplesProperty,
      model.numberOfCompletedSamplesProperty, {
        tandem: options.tandem.createTandem( 'sampleCardsPanel' )
      } );

    this.addChild( new VBox( {
      stretch: true,
      spacing: PDLConstants.INTER_PANEL_VERTICAL_SPACING,
      left: PDLConstants.SCREEN_VIEW_X_MARGIN,
      top: PDLConstants.SCREEN_VIEW_Y_MARGIN,
      children: [ samplingLaunchPanel, sampleCardsPanel ]
    } ) );

    const accordionBox = new SamplingAccordionBox( this, {
      expandedProperty: model.isHistogramShowingProperty,
      binWidthProperty: model.binWidthProperty,
      top: PDLConstants.SCREEN_VIEW_Y_MARGIN,
      centerX: this.layoutBounds.centerX,
      tandem: options.tandem.createTandem( 'accordionBox' )
    } );
    this.addChild( accordionBox );

    this.behindProjectilesLayer.addChild( new SamplingFieldSignNode(
      model.fieldProperty,
      this.modelViewTransform,
      model.selectedSampleProperty,
      model.numberOfSamplesProperty
    ) );

    // layout
    ManualConstraint.create(
      this,
      [ this.noAirResistanceText, this.resetAllButton ],
      ( noAirResistanceTextProxy, resetAllButtonProxy ) => {
        noAirResistanceTextProxy.right = resetAllButtonProxy.left - 100;
        noAirResistanceTextProxy.centerY = resetAllButtonProxy.centerY;
      }
    );

    this.pdomControlAreaNode.pdomOrder = [ samplingLaunchPanel, this.launchButton, this.launchControlRadioButtonGroup, this.resetAllButton ];
  }
}

projectileDataLab.register( 'SamplingScreenView', SamplingScreenView );
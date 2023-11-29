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
import { ManualConstraint, Rectangle, VBox } from '../../../../scenery/js/imports.js';
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

    const samplingLaunchPanel = new SamplingLaunchPanel( model.launcherTypeProperty, model.sampleSizeProperty, {
      tandem: options.tandem.createTandem( 'samplingLaunchPanel' )
    } );

    const sampleCardsPanel = new SampleCardsPanel( model.fieldProperty, model.selectedSampleProperty, model.numberOfSamplesProperty,
      model.numberOfCompletedSamplesProperty, {
        tandem: options.tandem.createTandem( 'sampleCardsPanel' )
      } );

    this.addChild( new VBox( {
      align: 'left',
      spacing: 5,
      stretch: true,
      children: [ samplingLaunchPanel, sampleCardsPanel ]
    } ) );

    const accordionBox = new SamplingAccordionBox(
      new Rectangle( 0, 0, 500, 200, { fill: '#ccffcc' } ), {
        expandedProperty: model.isHistogramShowingProperty,
        binWidthProperty: model.binWidthProperty,
        top: PDLConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'accordionBox' )
      } );
    this.addChild( accordionBox );

    this.behindProjectilesLayer.addChild( new SamplingFieldSignNode(
      model.fieldProperty,
      this.modelViewTransform,
      model.selectedSampleProperty,
      model.numberOfSamplesProperty
    ) );

    // Position the time control node so that the play/pause button is centered at the 50-meter mark
    ManualConstraint.create( this, [ accordionBox ], accordionBoxProxy => {
      accordionBoxProxy.centerX = this.layoutBounds.centerX;
    } );

    this.pdomControlAreaNode.pdomOrder = [ samplingLaunchPanel, this.launchButton, this.launchControlRadioButtonGroup, this.timeControlNode, this.resetAllButton ];
  }
}

projectileDataLab.register( 'SamplingScreenView', SamplingScreenView );
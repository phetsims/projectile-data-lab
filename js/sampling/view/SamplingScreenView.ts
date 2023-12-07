// Copyright 2023, University of Colorado Boulder

/**
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import SamplingModel from '../model/SamplingModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLScreenView from '../../common/view/PDLScreenView.js';
import SamplingLaunchPanel from './SamplingLaunchPanel.js';
import { ManualConstraint, VBox } from '../../../../scenery/js/imports.js';
import PDLConstants from '../../common/PDLConstants.js';
import SamplingAccordionBox from './SamplingAccordionBox.js';
import SamplingField from '../model/SamplingField.js';
import SampleCardsPanel from './SampleCardsPanel.js';
import SamplingFieldSignNode from './SamplingFieldSignNode.js';
import LauncherNode from '../../common/view/LauncherNode.js';
import SamplingCanvasNode from './SamplingCanvasNode.js';

type SelfOptions = EmptySelfOptions;

type SamplingScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SamplingScreenView extends PDLScreenView<SamplingField> {

  protected readonly launcherNode: LauncherNode;
  protected readonly launchPanel: SamplingLaunchPanel;
  protected readonly accordionBox: SamplingAccordionBox;

  public constructor( model: SamplingModel, providedOptions: SamplingScreenViewOptions ) {
    const options = optionize<SamplingScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

    const projectileCanvas = new SamplingCanvasNode( model.fieldProperty, model.isPathsVisibleProperty,
      this.modelViewTransform, model.selectedSampleProperty, {
        canvasBounds: this.canvasBounds
      } );
    this.projectileCanvasLayer.addChild( projectileCanvas );

    this.launcherNode = new LauncherNode(
      this.modelViewTransform,
      model.launcherAngleProperty,
      model.launcherHeightProperty,
      model.presetLauncherProperty,
      {}
    );

    this.launcherLayer.addChild( this.launcherNode );

    this.launchPanel = new SamplingLaunchPanel( model.presetLauncherProperty, model.sampleSizeProperty, {
      tandem: options.tandem.createTandem( 'launchPanel' )
    } );

    const sampleCardsPanel = new SampleCardsPanel( model.fieldProperty, model.selectedSampleProperty, model.numberOfSamplesProperty,
      model.numberOfCompletedSamplesProperty, {
        tandem: options.tandem.createTandem( 'sampleCardsPanel' )
      } );

    const launcherSampleSizePanel = new VBox( {
      stretch: true,
      spacing: PDLConstants.INTER_PANEL_SPACING,
      left: PDLConstants.SCREEN_VIEW_X_MARGIN,
      children: [ this.launchPanel, sampleCardsPanel ]
    } );

    this.addChild( launcherSampleSizePanel );

    this.accordionBox = new SamplingAccordionBox( this, model.selectedBinWidthProperty, model.selectedTotalBinsProperty, {
      expandedProperty: model.isHistogramShowingProperty,
      centerX: this.layoutBounds.centerX,
      tandem: options.tandem.createTandem( 'accordionBox' )
    } );
    this.addChild( this.accordionBox );

    this.behindProjectilesLayer.addChild( new SamplingFieldSignNode(
      model.fieldProperty,
      this.modelViewTransform,
      model.selectedSampleProperty,
      model.numberOfSamplesProperty
    ) );

    // layout
    this.visibleBoundsProperty.link( visibleBounds => {
      this.accordionBox.top = visibleBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN;
      launcherSampleSizePanel.top = visibleBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    ManualConstraint.create(
      this,
      [ this.accordionBox, this.launchPanel ],
      ( accordionBoxProxy, launchPanelProxy ) => {
        accordionBoxProxy.left = launchPanelProxy.right + PDLConstants.INTER_PANEL_SPACING;
        const accordionBoxWidth = this.layoutBounds.right - launchPanelProxy.right - PDLConstants.INTER_PANEL_SPACING - PDLConstants.SCREEN_VIEW_Y_MARGIN;
        accordionBoxProxy.maxWidth = accordionBoxWidth;
        accordionBoxProxy.preferredWidth = accordionBoxWidth;
      } );

    this.pdomControlAreaNode.pdomOrder = [ this.launchPanel, this.launchButton, this.launchControlRadioButtonGroup, this.resetAllButton ];
  }
}

projectileDataLab.register( 'SamplingScreenView', SamplingScreenView );
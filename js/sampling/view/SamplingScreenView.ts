// Copyright 2023-2024, University of Colorado Boulder

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
import SampleSelectorPanel from './SampleSelectorPanel.js';
import LauncherNode from '../../common/view/LauncherNode.js';
import SamplingCanvasNode from './SamplingCanvasNode.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import MeanIndicatorNode from '../../common/view/MeanIndicatorNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = EmptySelfOptions;

type SamplingScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SamplingScreenView extends PDLScreenView<SamplingField> {

  protected readonly launcherNode: LauncherNode;
  protected readonly launchPanel: SamplingLaunchPanel;
  protected readonly accordionBox: SamplingAccordionBox;

  public constructor( model: SamplingModel, providedOptions: SamplingScreenViewOptions ) {
    const options = optionize<SamplingScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model,
      ProjectileDataLabStrings.singleSampleStringProperty,
      ProjectileDataLabStrings.continuousSamplingStringProperty,
      options );

    const samplingCanvasNode = new SamplingCanvasNode( model.fieldProperty, model.isPathsVisibleProperty,
      this.modelViewTransform, model.selectedSampleProperty, {
        canvasBounds: this.canvasBounds
      } );

    // When the sample mean takes a value, repaint the canvas to show the paths as all white
    model.sampleMeanProperty.link( () => samplingCanvasNode.invalidatePaint() );
    model.fields.forEach( field => {
      field.numberOfSamplesWithMeansShowingProperty.link( () => samplingCanvasNode.invalidatePaint() );
    } );

    this.projectileCanvasLayer.addChild( samplingCanvasNode );

    const meanIndicatorVisibleProperty = new DerivedProperty( [ model.sampleMeanProperty ],
      sampleMean => sampleMean !== null );

    const meanIndicatorNode = new MeanIndicatorNode( 14, {
      visibleProperty: meanIndicatorVisibleProperty,
      bottom: this.modelViewTransform.modelToViewY( 0 )
    } );
    this.projectileCanvasLayer.addChild( meanIndicatorNode );

    model.sampleMeanProperty.link( mean => {
      if ( mean !== null ) {
        meanIndicatorNode.centerX = this.modelViewTransform.modelToViewX( mean );
      }
    } );

    this.launcherNode = new LauncherNode(
      this.modelViewTransform,
      model.meanLaunchAngleProperty,
      model.launcherHeightProperty,
      model.mysteryLauncherProperty,
      {}
    );

    this.launcherLayer.addChild( this.launcherNode );

    this.launchPanel = new SamplingLaunchPanel( model.mysteryLauncherProperty, model.sampleSizeProperty, {
      tandem: options.tandem.createTandem( 'launchPanel' )
    } );

    const sampleSelectorPanel = new SampleSelectorPanel(
      model.fieldProperty,
      model.selectedSampleProperty,
      model.numberOfSamplesWithMeansShowingProperty, {
        tandem: options.tandem.createTandem( 'sampleSelectorPanel' )
      } );

    const launcherSampleSizePanel = new VBox( {
      stretch: true,
      spacing: PDLConstants.INTER_PANEL_SPACING,
      left: PDLConstants.SCREEN_VIEW_X_MARGIN,
      children: [ this.launchPanel, sampleSelectorPanel ]
    } );

    this.addChild( launcherSampleSizePanel );

    this.accordionBox = new SamplingAccordionBox(
      model.mysteryLauncherProperty,
      model.sampleSizeProperty,
      model.numberOfSamplesWithMeansShowingProperty,

      model.fieldProperty,
      model.fields,
      model.selectedBinWidthProperty,
      model.selectedTotalBinsProperty,
      model.binWidthProperty,
      this,
      model.histogramRepresentationProperty, {
        expandedProperty: model.isHistogramVisibleProperty,
        top: PDLConstants.SCREEN_VIEW_Y_MARGIN,
        centerX: this.layoutBounds.centerX,
        tandem: options.tandem.createTandem( 'accordionBox' )
      } );
    this.addChild( this.accordionBox );

    model.fields.forEach( field => {

      // When a projectile is created in 'single' mode, play the launch animation
      field.projectileCreatedEmitter.addListener( projectile => {
        if ( model.fieldProperty.value === field && model.launchModeProperty.value === 'single' ) {
          this.launcherNode.playLaunchAnimation( projectile.launchAngle );
        }
      } );

      // When showing the mean indicator, fade out the projectile canvas to de-emphasize the individual data
      field.phaseProperty.lazyLink( phase => {
        samplingCanvasNode.opacity = phase === 'showingCompleteSampleWithMean' ? 0.6 : 1;
      } );
    } );

    // layout
    this.visibleBoundsProperty.link( visibleBounds => {
      this.accordionBox.top = visibleBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN;
      launcherSampleSizePanel.top = visibleBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    // Allow the top content to go above the dev bounds, but not too far
    this.visibleBoundsProperty.link( visibleBounds => {
      const minY = PDLConstants.ABOVE_DEV_BOUNDS_TOP;
      const topY = Math.max( visibleBounds.top, minY );
      launcherSampleSizePanel.top = topY + PDLConstants.SCREEN_VIEW_Y_MARGIN;
      this.accordionBox.top = topY + PDLConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    // Position the 'No air resistance' text
    this.noAirResistanceText.bottom = PDLConstants.FIELD_SIGN_CENTER_Y - PDLConstants.FIELD_SIGN_AIR_RESISTANCE_TEXT_SEPARATION;

    ProjectileDataLabStrings.noAirResistanceStringProperty.link( () => {
      this.noAirResistanceText.right = this.eraserButton.right;
    } );

    ManualConstraint.create(
      this,
      [ this.accordionBox, this.launchPanel ],
      ( accordionBoxProxy, launchPanelProxy ) => {
        accordionBoxProxy.left = launchPanelProxy.right + PDLConstants.INTER_PANEL_SPACING;
        const accordionBoxWidth = this.layoutBounds.right - launchPanelProxy.right - PDLConstants.INTER_PANEL_SPACING - PDLConstants.SCREEN_VIEW_Y_MARGIN;

        // If maxWidth and preferredWidth are both non-null, maxWidth should NOT be smaller than the preferredWidth. If that happens, it would trigger an infinite loop
        // That is, the maxWidth >= preferredWidth.
        // Check if the new preferredWidth is smaller than the current maxWidth
        if ( accordionBoxProxy.maxWidth !== null && accordionBoxWidth <= accordionBoxProxy.maxWidth ) {

          // Safe to set preferredWidth first
          accordionBoxProxy.preferredWidth = accordionBoxWidth;
          accordionBoxProxy.maxWidth = accordionBoxWidth;
        }
        else {
          // Set maxWidth first to avoid it being smaller than preferredWidth
          accordionBoxProxy.maxWidth = accordionBoxWidth;
          accordionBoxProxy.preferredWidth = accordionBoxWidth;
        }
      } );

    this.pdomControlAreaNode.pdomOrder = [ this.launchPanel, sampleSelectorPanel, this.launchButton, this.launchControlRadioButtonGroup, this.accordionBox, this.resetAllButton ];
  }
}

projectileDataLab.register( 'SamplingScreenView', SamplingScreenView );
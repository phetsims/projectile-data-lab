// Copyright 2023-2024, University of Colorado Boulder

/**
 * The Sampling Screen View shows the view for the Sampling screen in the Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import projectileDataLab from '../../projectileDataLab.js';
import SamplingModel from '../model/SamplingModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLScreenView from '../../common/view/PDLScreenView.js';
import SamplingLaunchPanel from './SamplingLaunchPanel.js';
import { ManualConstraint } from '../../../../scenery/js/imports.js';
import PDLConstants from '../../common/PDLConstants.js';
import SamplingAccordionBox from './SamplingAccordionBox.js';
import SamplingField from '../model/SamplingField.js';
import SampleSelectorNode from './SampleSelectorNode.js';
import LauncherNode from '../../common/view/LauncherNode.js';
import SamplingCanvasNode from './SamplingCanvasNode.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import MeanIndicatorNode from '../../common/view/MeanIndicatorNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import PDLText from '../../common/view/PDLText.js';
import SamplingFieldSignNode from './SamplingFieldSignNode.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import PDLQueryParameters from '../../common/PDLQueryParameters.js';
import { histogramAccordionBoxTandemName } from '../../common/view/HistogramAccordionBox.js';
import Multilink from '../../../../axon/js/Multilink.js';

type SelfOptions = EmptySelfOptions;

type SamplingScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SamplingScreenView extends PDLScreenView<SamplingField> {

  protected readonly launcherNode: LauncherNode;
  protected readonly launchPanel: SamplingLaunchPanel;
  protected readonly accordionBox: SamplingAccordionBox;

  public constructor( model: SamplingModel, providedOptions: SamplingScreenViewOptions ) {
    const options = optionize<SamplingScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model,
      ProjectileDataLabStrings.singleLaunchStringProperty,
      ProjectileDataLabStrings.continuousLaunchStringProperty,
      options );

    const samplingCanvasNode = new SamplingCanvasNode( model.fieldProperty, model.isPathsVisibleProperty,
      this.modelViewTransform, model.selectedSampleIndexProperty, {
        canvasBounds: this.canvasBounds
      } );

    // When the sample mean takes a value, repaint the canvas to show the paths as all white
    model.sampleMeanProperty.link( () => samplingCanvasNode.invalidatePaint() );
    model.fields.forEach( field => {
      field.numberOfCompletedSamplesProperty.link( () => samplingCanvasNode.invalidatePaint() );
      field.numberOfStartedSamplesProperty.link( () => samplingCanvasNode.invalidatePaint() );
      field.selectedSampleIndexProperty.link( () => samplingCanvasNode.invalidatePaint() );
    } );

    this.projectileCanvasLayer.addChild( samplingCanvasNode );

    const meanIndicatorVisibleProperty = new DerivedProperty( [ model.phaseProperty ], phase => phase === 'showingCompleteSampleWithMean' );

    const meanIndicatorNode = new MeanIndicatorNode( 14, {
      visibleProperty: meanIndicatorVisibleProperty,
      bottom: this.modelViewTransform.modelToViewY( 0 )
    } );
    this.projectileCanvasLayer.addChild( meanIndicatorNode );

    const meanReadoutStringProperty = new PatternStringProperty( ProjectileDataLabStrings.meanMetersPatternStringProperty, {
      mean: new DerivedProperty( [ model.sampleMeanProperty ],
        mean => mean === null ? '' : Utils.toFixed( mean, 1 )
      )
    } );
    const meanReadoutNode = new PDLText( meanReadoutStringProperty, {
      visibleProperty: meanIndicatorVisibleProperty,
      fontSize: 13
    } );
    this.projectileCanvasLayer.addChild( meanReadoutNode );

    model.sampleMeanProperty.link( mean => {
      if ( mean !== null ) {
        meanIndicatorNode.centerX = this.modelViewTransform.modelToViewX( mean );
        meanReadoutNode.centerBottom = meanIndicatorNode.centerTop.plusXY( 0, -2 );
      }
    } );

    this.launcherNode = new LauncherNode(
      this.modelViewTransform,
      model.meanLaunchAngleProperty,
      model.launcherHeightProperty,
      model.launcherProperty,
      model.fieldProperty
    );

    this.launcherLayer.addChild( this.launcherNode );

    this.launchPanel = new SamplingLaunchPanel( model.launcherProperty, model.sampleSizeProperty, {
      tandem: options.tandem.createTandem( 'launchPanel' )
    } );

    const fieldSign = new SamplingFieldSignNode(
      model.launcherProperty,
      model.sampleSizeProperty,
      this.modelViewTransform
    );

    const sampleSelectorNode = new SampleSelectorNode(
      model.fieldProperty,
      model.selectedSampleIndexProperty,
      model.numberOfStartedSamplesProperty,
      model.numberOfCompletedSamplesProperty,
      model.sampleMeanProperty,
      model.phaseProperty, {
        tandem: options.tandem.createTandem( 'sampleSelectorNode' )
      } );

    this.addChild( this.timeControlNode );
    this.addChild( this.launchPanel );
    this.behindProjectilesLayer.addChild( fieldSign );
    this.behindProjectilesLayer.addChild( sampleSelectorNode );

    sampleSelectorNode.centerX = fieldSign.centerX;
    sampleSelectorNode.bottom = fieldSign.top - PDLConstants.INTER_PANEL_SPACING;

    this.accordionBox = new SamplingAccordionBox(
      model.launcherProperty,
      model.sampleSizeProperty,
      model.numberOfCompletedSamplesProperty,

      model.fieldProperty,
      model.fields,
      model.selectedBinWidthProperty,
      model.selectedTotalBinsProperty,
      model.binWidthProperty,
      this,
      model.histogramRepresentationProperty,
      () => model.clearCurrentField(), {
        top: PDLConstants.SCREEN_VIEW_Y_MARGIN,
        centerX: this.layoutBounds.centerX,
        tandem: options.tandem.createTandem( histogramAccordionBoxTandemName )
      } );
    this.addChild( this.accordionBox );

    model.fields.forEach( field => {

      // TODO: Do not playLaunchAnimation when a projectile is created as part of autocompleting the current sample - see https://github.com/phetsims/projectile-data-lab/issues/21
      // When a projectile is created in 'single' mode, play the launch animation
      field.projectileCreatedEmitter.addListener( projectile => {
        if ( model.fieldProperty.value === field && model.singleOrContinuousProperty.value === 'single' ) {
          this.launcherNode.playLaunchAnimation( projectile.launchAngle );
        }
      } );
    } );

    // layout
    this.visibleBoundsProperty.link( visibleBounds => {
      this.accordionBox.top = visibleBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN;
      this.launchPanel.top = visibleBounds.top + PDLConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    // Allow the top content to go above the dev bounds, but not too far
    this.visibleBoundsProperty.link( visibleBounds => {
      const minY = PDLConstants.ABOVE_DEV_BOUNDS_TOP;
      const topY = Math.max( visibleBounds.top, minY );
      this.launchPanel.top = topY + PDLConstants.SCREEN_VIEW_Y_MARGIN;
      this.accordionBox.top = topY + PDLConstants.SCREEN_VIEW_Y_MARGIN;
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

    // Position the sample selector panel
    ManualConstraint.create(
      this,
      [ sampleSelectorNode, fieldSign ], ( sampleSelectorNodeProxy, fieldSignProxy ) => {
        sampleSelectorNodeProxy.bottom = fieldSignProxy.top - PDLConstants.FIELD_SIGN_PROJECTILE_SELECTOR_SEPARATION;
        sampleSelectorNodeProxy.centerX = fieldSignProxy.centerX;
      } );

    // Position the time control node so that it is right-aligned underneath the accordion box
    ManualConstraint.create( this, [ this.timeControlNode, this.accordionBox.bottomThumbnailNode, this.accordionBox ],
      ( timeControlNodeProxy, bottomThumbnailNodeProxy, accordionBoxProxy ) => {
        timeControlNodeProxy.centerX = bottomThumbnailNodeProxy.centerX;
        timeControlNodeProxy.top = accordionBoxProxy.bottom + PDLConstants.INTER_PANEL_SPACING + PDLConstants.TIME_CONTROL_MARGIN_TOP;
      } );

    // Position the 'No air resistance' text
    ManualConstraint.create( this, [ this.launchPanel ], launchPanelProxy => {
      this.noAirResistanceText.centerX = launchPanelProxy.centerX;
      this.noAirResistanceText.top = launchPanelProxy.bottom + 15;
    } );

    Multilink.multilink( [ model.phaseProperty, model.numberOfStartedSamplesProperty, model.singleOrContinuousProperty ],
      ( phase, startedSamples, singleOrContinuous ) => {
        if ( singleOrContinuous === 'single' ) {

          // gray out the button while samples are in the air or when the mean hasn't been shown yet
          this.launchButton.enabled = ( phase === 'showingCompleteSampleWithMean' || phase === 'idle' ) &&
                                      startedSamples < PDLQueryParameters.maxSamples;
        }
        else {
          this.launchButton.enabled = startedSamples < PDLQueryParameters.maxSamples;
        }
      } );

    this.pdomControlAreaNode.pdomOrder = [
      this.launchButton,
      this.singleOrContinuousRadioButtonGroup,

      this.launchPanel,

      this.accordionBox,
      sampleSelectorNode,
      this.resetAllButton
    ];
  }
}

projectileDataLab.register( 'SamplingScreenView', SamplingScreenView );
// Copyright 2023-2024, University of Colorado Boulder

/**
 * The Sampling Screen View shows the view for the Sampling screen in the Projectile Data Lab.
 *
 * @author Matthew Blackman (PhET Interactive Simulations)
 */

import projectileDataLab from '../../projectileDataLab.js';
import SamplingModel from '../model/SamplingModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PDLScreenView, { PDLScreenViewOptions } from '../../common/view/PDLScreenView.js';
import SamplingLaunchPanel from './SamplingLaunchPanel.js';
import { ManualConstraint } from '../../../../scenery/js/imports.js';
import PDLConstants from '../../common/PDLConstants.js';
import SamplingAccordionBox from './SamplingAccordionBox.js';
import SamplingField from '../model/SamplingField.js';
import SampleSelectorNode from './SampleSelectorNode.js';
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
import FieldSignNode from '../../common/view/FieldSignNode.js';
import PDLPreferences from '../../common/PDLPreferences.js';
import LauncherNode from '../../common/view/LauncherNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;

type SamplingScreenViewOptions = SelfOptions & StrictOmit<PDLScreenViewOptions, 'createLauncherNode'>;

export default class SamplingScreenView extends PDLScreenView<SamplingField> {

  protected readonly fieldSignNode: FieldSignNode;
  protected readonly launchPanel: SamplingLaunchPanel;
  protected readonly accordionBox: SamplingAccordionBox;

  public constructor( model: SamplingModel, providedOptions: SamplingScreenViewOptions ) {
    const options = optionize<SamplingScreenViewOptions, SelfOptions, PDLScreenViewOptions>()( {

      createLauncherNode: modelViewTransform => new LauncherNode(
        modelViewTransform,
        model.meanLaunchAngleProperty,
        model.launcherHeightProperty,
        model.launcherProperty,
        model.fieldProperty
      )
    }, providedOptions );

    const launchButtonEnabledProperty = new DerivedProperty( [ model.phaseProperty, model.numberOfStartedSamplesProperty, model.singleOrContinuousProperty ],
      ( phase, startedSamples, singleOrContinuous ) => {
        if ( singleOrContinuous === 'single' ) {

          // gray out the button while samples are in the air or when the mean hasn't been shown yet
          return ( phase === 'showingCompleteSampleWithMean' || phase === 'idle' ) &&
                 startedSamples < PDLQueryParameters.maxSamples;
        }
        else {
          return startedSamples < PDLQueryParameters.maxSamples;
        }
      } );

    super( model,
      ProjectileDataLabStrings.singleStringProperty,
      ProjectileDataLabStrings.continuousStringProperty,
      launchButtonEnabledProperty,
      options );

    const samplingCanvasNode = new SamplingCanvasNode( model.fieldProperty, model.isPathsVisibleProperty,
      this.modelViewTransform, model.selectedSampleNumberProperty, {
        canvasBounds: this.canvasBounds
      } );

    // When the sample mean takes a value, repaint the canvas to show the paths as all white
    model.sampleMeanProperty.link( () => samplingCanvasNode.invalidatePaint() );
    model.fields.forEach( field => {
      field.numberOfCompletedSamplesProperty.link( () => samplingCanvasNode.invalidatePaint() );
      field.numberOfStartedSamplesProperty.link( () => samplingCanvasNode.invalidatePaint() );
      field.selectedSampleNumberProperty.link( () => samplingCanvasNode.invalidatePaint() );
    } );

    this.projectileLayer.addChild( samplingCanvasNode );

    const meanIndicatorVisibleProperty = new DerivedProperty( [ model.phaseProperty ], phase => phase === 'showingCompleteSampleWithMean' );

    const meanIndicatorNode = new MeanIndicatorNode( 14, {
      visibleProperty: meanIndicatorVisibleProperty,
      bottom: this.modelViewTransform.modelToViewY( 0 )
    } );
    this.projectileLayer.addChild( meanIndicatorNode );

    const meanReadoutStringProperty = new PatternStringProperty( ProjectileDataLabStrings.meanMPatternStringProperty, {
      mean: new DerivedProperty( [ model.sampleMeanProperty ],
        mean => mean === null ? '' : Utils.toFixed( mean, 1 )
      )
    } );
    const meanReadoutNode = new PDLText( meanReadoutStringProperty, {
      visibleProperty: meanIndicatorVisibleProperty
    } );
    this.projectileLayer.addChild( meanReadoutNode );

    model.sampleMeanProperty.link( mean => {
      if ( mean !== null ) {
        meanIndicatorNode.centerX = this.modelViewTransform.modelToViewX( mean );
        meanReadoutNode.centerBottom = meanIndicatorNode.centerTop.plusXY( 0, -2 );
      }
    } );

    this.launchPanel = new SamplingLaunchPanel( model.launcherProperty, model.sampleSizeProperty, {
      tandem: options.tandem.createTandem( 'launchPanel' )
    } );

    const sampleSelectorNode = new SampleSelectorNode(
      model.fieldProperty,
      model.selectedSampleNumberProperty,
      model.numberOfStartedSamplesProperty,
      model.numberOfCompletedSamplesProperty,
      model.sampleMeanProperty,
      model.phaseProperty,
      model.isContinuousLaunchingProperty, {
        tandem: options.tandem.createTandem( 'sampleSelectorNode' )
      } );

    this.fieldSignNode = new SamplingFieldSignNode(
      model.fields,
      model.fieldProperty,
      model.launcherProperty,
      model.sampleSizeProperty,
      sampleSelectorNode
    );

    this.positionFieldSignNode();

    this.addChild( this.timeControlNode );
    this.addChild( this.launchPanel );
    this.behindProjectilesLayer.addChild( this.fieldSignNode );

    const histogramSoundEnabledProperty = new DerivedProperty( [
        model.phaseProperty,
        model.singleOrContinuousProperty,
        model.isContinuousLaunchingProperty
      ],
      ( phase, singleOrContinuous, isContinuousLaunching ) => {
        if ( singleOrContinuous === 'single' ) {
          return phase === 'showingCompleteSampleWithMean';
        }
        else {
          return !isContinuousLaunching && phase === 'showingCompleteSampleWithMean';
        }
      } );

    this.accordionBox = new SamplingAccordionBox(
      model.histogram,
      model.launcherProperty,
      model.sampleSizeProperty,
      model.numberOfCompletedSamplesProperty,
      model.fieldProperty,
      model.fields,
      model.histogram.zoomProperty,
      model.histogram.binWidthProperty,
      this,
      model.histogram.representationProperty,
      histogramSoundEnabledProperty, {
        top: PDLConstants.SCREEN_VIEW_Y_MARGIN,
        centerX: this.layoutBounds.centerX,
        tandem: options.tandem.createTandem( histogramAccordionBoxTandemName )
      } );
    this.addChild( this.accordionBox );

    model.fields.forEach( field => {

      // When a projectile is created in 'single' mode, play the launch animation
      field.projectileCreatedEmitter.addListener( projectile => {
        if ( model.fieldProperty.value === field && model.singleOrContinuousProperty.value === 'single' ) {

          // When launching many projectiles at once in the auto-generate mode, suppress the individual launch animations
          // to improve performance
          if ( !PDLPreferences.autoGenerateDataProperty.value ) {
            this.launcherNode.playLaunchAnimation( projectile.launchAngle );
          }
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

    ManualConstraint.create( this, [ this.accordionBox, this.launchPanel ],
      ( accordionBoxProxy, launchPanelProxy ) => {
        accordionBoxProxy.left = launchPanelProxy.right + PDLConstants.INTER_PANEL_SPACING;
      } );

    // Position the time control node so that it is right-aligned underneath the accordion box
    ManualConstraint.create( this, [ this.timeControlNode, this.accordionBox, this.accordionBox.bottomThumbnailNode ],
      ( timeControlNodeProxy, accordionBoxProxy ) => {
        timeControlNodeProxy.right = accordionBoxProxy.right - 3;
        timeControlNodeProxy.top = accordionBoxProxy.bottom + PDLConstants.INTER_PANEL_SPACING + PDLConstants.TIME_CONTROL_MARGIN_TOP;
      } );

    // Position the 'No air resistance' text
    ManualConstraint.create( this, [ this.launchPanel ], launchPanelProxy => {
      this.noAirResistanceText.centerX = launchPanelProxy.centerX;
      this.noAirResistanceText.top = launchPanelProxy.bottom + 8;
    } );

    this.pdomPlayAreaNode.pdomOrder = [
      this.launchButton,
      this.singleOrContinuousRadioButtonGroup,

      // Experiment setup
      this.launchPanel,

      // Histogram
      this.accordionBox,

      sampleSelectorNode
    ];

    this.pdomControlAreaNode.pdomOrder = [

      // Global controls
      this.timeControlNode,

      this.eraserButton,

      // Reset all
      this.resetAllButton
    ];
  }
}

projectileDataLab.register( 'SamplingScreenView', SamplingScreenView );
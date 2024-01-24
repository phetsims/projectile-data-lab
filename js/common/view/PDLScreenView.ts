// Copyright 2023-2024, University of Colorado Boulder

/**
 * ScreenView for the Projectile Data Lab
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Matthew Blackman (PhET Interactive Simulations)
 */
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import projectileDataLab from '../../projectileDataLab.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { HBox, Node, Text } from '../../../../scenery/js/imports.js';
import PDLConstants from '../PDLConstants.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLColors from '../PDLColors.js';
import GradientBackgroundNode from '../../../../scenery-phet/js/GradientBackgroundNode.js';
import FieldNode from './FieldNode.js';
import PDLModel from '../model/PDLModel.js';
import FieldOverlayNode from './FieldOverlayNode.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import PDLText from './PDLText.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Field from '../model/Field.js';
import LauncherNode from './LauncherNode.js';
import { PDLLaunchPanel } from './PDLLaunchPanel.js';
import HistogramAccordionBox from './HistogramAccordionBox.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { SingleOrContinuous } from '../model/SingleOrContinuous.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import LaunchButton from './LaunchButton.js';

type SelfOptions = EmptySelfOptions;
export type PDLScreenViewOptions = SelfOptions & WithRequired<ScreenViewOptions, 'tandem'>;

export default abstract class PDLScreenView<T extends Field> extends ScreenView {

  protected readonly modelViewTransform;
  protected readonly canvasBounds: Bounds2;

  protected readonly launcherLayer = new Node();
  protected readonly projectileCanvasLayer = new Node();
  protected readonly behindProjectilesLayer = new Node();

  protected abstract readonly launcherNode: LauncherNode;

  protected abstract readonly launchPanel: PDLLaunchPanel;
  protected abstract readonly accordionBox: HistogramAccordionBox;

  protected readonly bottomUIContainer: HBox;

  protected readonly launchButton: RectangularPushButton;
  protected readonly singleOrContinuousRadioButtonGroup: VerticalAquaRadioButtonGroup<SingleOrContinuous>;
  protected readonly timeControlNode: TimeControlNode;
  protected readonly resetAllButton: ResetAllButton;
  protected readonly noAirResistanceText: PDLText;

  protected constructor( model: PDLModel<T>,
                         singleStringProperty: TReadOnlyProperty<string>,
                         continuousStringProperty: TReadOnlyProperty<string>,
                         options: PDLScreenViewOptions ) {
    super( options );

    const fieldX = this.layoutBounds.centerX + PDLConstants.FIELD_CENTER_OFFSET_X;
    const fieldY = PDLConstants.FIELD_CENTER_Y;
    const originX = fieldX - 0.5 * PDLConstants.FIELD_WIDTH;

    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( 0, 0 ), new Vector2( originX, fieldY ), PDLConstants.PIXELS_TO_DISTANCE );

    // Expand the canvas bounds so that the projectile paths are not clipped if they go beyond the field
    const canvasMarginRight = this.modelViewTransform.modelToViewDeltaX( PDLConstants.MAX_FIELD_DISTANCE / 2 );
    this.canvasBounds = ScreenView.DEFAULT_LAYOUT_BOUNDS.dilatedX( canvasMarginRight / 2 )
      .shiftedX( canvasMarginRight / 2 );

    const background = new GradientBackgroundNode(
      0,
      0,
      1,
      1,
      PDLColors.screenBackgroundTopColorProperty,
      PDLColors.screenBackgroundBottomColorProperty,
      0,
      1
    );

    this.visibleBoundsProperty.link( visibleBounds => {
      background.translation = visibleBounds.leftTop;
      background.setScaleMagnitude( visibleBounds.width, visibleBounds.height );
    } );

    this.bottomUIContainer = new HBox( {
      spacing: PDLConstants.INTER_PANEL_SPACING,
      bottom: this.layoutBounds.bottom - PDLConstants.SCREEN_VIEW_Y_MARGIN
    } );

    this.noAirResistanceText = new PDLText( ProjectileDataLabStrings.noAirResistanceStringProperty, {
      font: PDLConstants.NO_AIR_RESISTANCE_FONT,
      maxWidth: 160
    } );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - PDLConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - PDLConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' ),
      phetioFeatured: true
    } );


    const fieldBack = new FieldNode( model.fields, model.fieldProperty, model.binWidthProperty, { x: fieldX, y: fieldY } );
    const fieldFront = new FieldNode( model.fields, model.fieldProperty, model.binWidthProperty, { isBottomHalf: true, x: fieldX, y: fieldY } );
    const fieldOverlayBack = new FieldOverlayNode( this.modelViewTransform, {} );
    const fieldOverlayFront = new FieldOverlayNode( this.modelViewTransform, { isLeftSide: true } );
    fieldOverlayBack.x = fieldX;
    fieldOverlayBack.y = fieldY;
    fieldOverlayFront.x = fieldX;
    fieldOverlayFront.y = fieldY;

    // Create the launch button
    this.launchButton = new LaunchButton( model.isContinuousLaunchingProperty,
      model.singleOrContinuousProperty, () => model.launchButtonPressed(), {
        left: this.layoutBounds.centerX + PDLConstants.FIELD_CENTER_OFFSET_X - 0.45 * PDLConstants.FIELD_WIDTH,
        bottom: this.layoutBounds.maxY - PDLConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: options.tandem.createTandem( 'launchButton' ),
        phetioEnabledPropertyInstrumented: false
      } );

    const radioButtonLabelMaxWidth = 120;
    this.singleOrContinuousRadioButtonGroup = new VerticalAquaRadioButtonGroup( model.singleOrContinuousProperty, [ {
      value: 'single' as const,
      createNode: () => new Text( singleStringProperty, {
        font: PDLConstants.LAUNCH_CONTROL_FONT,
        maxWidth: radioButtonLabelMaxWidth
      } ),
      tandemName: 'singleLaunchRadioButton'
    }, {
      value: 'continuous' as const,
      createNode: () => new Text( continuousStringProperty, {
        font: PDLConstants.LAUNCH_CONTROL_FONT,
        maxWidth: radioButtonLabelMaxWidth
      } ),
      tandemName: 'continuousLaunchRadioButton'
    } ], {
      left: this.launchButton.right + 15,
      centerY: this.launchButton.centerY,
      spacing: 10,
      tandem: options.tandem.createTandem( 'singleOrContinuousRadioButtonGroup' ),
      phetioFeatured: true,
      radioButtonOptions: {
        phetioVisiblePropertyInstrumented: false,
        phetioEnabledPropertyInstrumented: false
      }
    } );

    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'timeControlNode' ),
      phetioFeatured: true,
      playPauseStepButtonOptions: {
        includeStepForwardButton: false
      },
      timeSpeedProperty: model.timeSpeedProperty,
      timeSpeeds: model.timeSpeedValues,
      buttonGroupXSpacing: 18,
      speedRadioButtonGroupOptions: {
        maxWidth: 80
      },
      layoutOptions: {
        topMargin: PDLConstants.TIME_CONTROL_MARGIN_TOP
      }
    } );

    this.addChild( background );
    this.addChild( fieldBack );
    this.addChild( fieldOverlayBack );
    this.addChild( this.behindProjectilesLayer );
    this.addChild( this.projectileCanvasLayer );
    this.addChild( this.launcherLayer );
    this.addChild( fieldFront );
    this.addChild( fieldOverlayFront );
    this.addChild( this.launchButton );
    this.addChild( this.singleOrContinuousRadioButtonGroup );
    this.addChild( this.noAirResistanceText );
    this.addChild( this.resetAllButton );
  }

  /**
   * Floating layout that keeps the ground near the ground, and accordion box near the question bar
   */
  public override layout( viewBounds: Bounds2 ): void {
    super.layout( viewBounds, {
      verticalAlign: 'bottom'
    } );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    this.accordionBox.reset();
  }
}

projectileDataLab.register( 'PDLScreenView', PDLScreenView );

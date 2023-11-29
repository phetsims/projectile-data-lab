// Copyright 2023, University of Colorado Boulder

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
import { Node, Image, ManualConstraint, Text } from '../../../../scenery/js/imports.js';
import PDLConstants from '../PDLConstants.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLColors from '../PDLColors.js';
import GradientBackgroundNode from '../../../../scenery-phet/js/GradientBackgroundNode.js';
import FieldNode from './FieldNode.js';
import PDLModel from '../model/PDLModel.js';
import FieldOverlayNode from './FieldOverlayNode.js';
import LauncherNode from './LauncherNode.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import launchButton_png from '../../../images/launchButton_png.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import PDLText from './PDLText.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import PDLCanvasNode from './PDLCanvasNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Field from '../model/Field.js';

type SelfOptions = EmptySelfOptions;
type PDLScreenViewOptions = SelfOptions & ScreenViewOptions;

export class PDLScreenView<T extends Field> extends ScreenView {

  protected readonly modelViewTransform;

  private readonly launcher;

  protected readonly behindProjectilesLayer = new Node();

  protected readonly resetAllButton;
  protected readonly timeControlNode;
  protected readonly launchButton;
  protected readonly launchControlRadioButtonGroup;
  protected readonly eraserButton: EraserButton;

  public constructor( model: PDLModel<T>, options: PDLScreenViewOptions ) {
    super( options );

    const fieldX = this.layoutBounds.centerX + PDLConstants.FIELD_CENTER_OFFSET_X;
    const fieldY = PDLConstants.FIELD_CENTER_Y;
    const originX = fieldX - 0.5 * PDLConstants.FIELD_WIDTH;

    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( 0, 0 ), new Vector2( originX, fieldY ), PDLConstants.PIXELS_TO_DISTANCE );

    const backgroundNode = new GradientBackgroundNode(
      0,
      0,
      1,
      1,
      PDLColors.screenBackgroundTopColorProperty,
      PDLColors.screenBackgroundBottomColorProperty,
      0,
      1
    );

    // This instance lives for the lifetime of the simulation, so we don't need to remove this listener
    this.visibleBoundsProperty.link( visibleBounds => {
      backgroundNode.translation = visibleBounds.leftTop;
      backgroundNode.setScaleMagnitude( visibleBounds.width, visibleBounds.height );
    } );

    const noAirResistanceText = new PDLText( ProjectileDataLabStrings.noAirResistanceStringProperty, {
      font: PDLConstants.NO_AIR_RESISTANCE_FONT,
      maxWidth: 200
    } );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - PDLConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - PDLConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    const fieldBack = new FieldNode( model.binWidthProperty, { x: fieldX, y: fieldY } );
    const fieldFront = new FieldNode( model.binWidthProperty, { isBottomHalf: true, x: fieldX, y: fieldY } );
    const fieldOverlayNode = new FieldOverlayNode( this.modelViewTransform, {} );
    fieldOverlayNode.x = fieldX;
    fieldOverlayNode.y = fieldY;

    this.launcher = new LauncherNode(
      this.modelViewTransform,
      model.launcherAngleProperty,
      model.launcherHeightProperty,
      model.launcherTypeProperty,
      {}
    );


    // Create the launch button
    this.launchButton = new RectangularPushButton( {
      content: new Image( launchButton_png ),
      left: this.layoutBounds.centerX + PDLConstants.FIELD_CENTER_OFFSET_X - 0.42 * PDLConstants.FIELD_WIDTH,
      bottom: this.layoutBounds.maxY - PDLConstants.SCREEN_VIEW_Y_MARGIN,
      baseColor: PDLColors.launchButtonColorProperty,
      size: new Dimension2( 85, 45 ),
      yMargin: 5,
      tandem: options.tandem.createTandem( 'launchButton' ),
      listener: () => {
        model.launchButtonPressed();
      }
    } );

    const radioButtonLabelMaxWidth = 180;
    this.launchControlRadioButtonGroup = new VerticalAquaRadioButtonGroup( model.isContinuousLaunchProperty, [
      {
        value: false,
        createNode: () => new Text( ProjectileDataLabStrings.singleLaunchStringProperty, {
          font: PDLConstants.LAUNCH_CONTROL_FONT,
          maxWidth: radioButtonLabelMaxWidth
        } ),
        tandemName: 'singleLaunchRadioButton'
      },
      {
        value: true,
        createNode: () => new Text( ProjectileDataLabStrings.continuousLaunchStringProperty, {
          font: PDLConstants.LAUNCH_CONTROL_FONT,
          maxWidth: radioButtonLabelMaxWidth
        } ),
        tandemName: 'continuousLaunchRadioButton'
      }
    ], {
      left: this.launchButton.right + 15,
      centerY: this.launchButton.centerY,
      spacing: 10,
      tandem: options.tandem.createTandem( 'launchControlRadioButtonGroup' )
    } );

    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'timeControlNode' ),
      playPauseStepButtonOptions: {
        includeStepForwardButton: false
      },
      timeSpeedProperty: model.timeSpeedProperty,
      timeSpeeds: model.timeSpeedValues,
      buttonGroupXSpacing: 18
    } );

    // Create the eraser button
    this.eraserButton = new EraserButton( {
      right: this.layoutBounds.right - PDLConstants.SCREEN_VIEW_X_MARGIN,
      centerY: PDLConstants.FIELD_SIGN_CENTER_Y,
      iconWidth: 27,
      listener: () => {
        model.clearCurrentField();
      },
      tandem: options.tandem.createTandem( 'eraserButton' )
    } );

    // Expand the canvas bounds so that the projectile paths are not clipped if they go beyond the field
    const canvasMarginRight = this.modelViewTransform.modelToViewDeltaX( PDLConstants.MAX_FIELD_DISTANCE / 2 );
    const canvasBounds = ScreenView.DEFAULT_LAYOUT_BOUNDS.dilatedX( canvasMarginRight / 2 )
      .shiftedX( canvasMarginRight / 2 );

    const projectileCanvas = new PDLCanvasNode( model.fieldProperty, model.isPathsVisibleProperty, this.modelViewTransform,
      model.selectedSampleProperty, {
        canvasBounds: canvasBounds
      } );

    this.addChild( backgroundNode );
    this.addChild( fieldBack );
    this.addChild( this.launcher );
    this.addChild( fieldFront );
    this.addChild( fieldOverlayNode );

    this.addChild( this.behindProjectilesLayer );

    this.addChild( projectileCanvas );
    this.addChild( this.launchButton );
    this.addChild( this.launchControlRadioButtonGroup );
    this.addChild( noAirResistanceText );
    this.addChild( this.resetAllButton );
    this.addChild( this.timeControlNode );
    this.addChild( this.eraserButton );

    // layout
    ManualConstraint.create(
      this,
      [ noAirResistanceText, this.timeControlNode, this.resetAllButton ],
      ( noAirResistanceTextProxy, timeControlNodeProxy, resetAllButtonProxy ) => {
        // Position the no air resistance text so that it is centered between the time control node and the reset all button
        noAirResistanceTextProxy.centerX = 0.5 * ( timeControlNodeProxy.right + resetAllButtonProxy.left );
        noAirResistanceTextProxy.centerY = resetAllButtonProxy.centerY;
      }
    );

    // Position the time control node so that the play/pause button is centered at the 50-meter mark
    ManualConstraint.create( this, [ this.timeControlNode ], timeControlNodeProxy => {
      const playPauseCenterOffsetX = 0.5 * this.timeControlNode.width - this.timeControlNode.getPlayPauseButtonCenter().x;
      timeControlNodeProxy.centerX = this.layoutBounds.centerX + PDLConstants.FIELD_CENTER_OFFSET_X + playPauseCenterOffsetX;
      timeControlNodeProxy.bottom = this.layoutBounds.maxY - PDLConstants.SCREEN_VIEW_Y_MARGIN;
    } );
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
    // implement me
  }
}

projectileDataLab.register( 'PDLScreenView', PDLScreenView );

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
import { Image, ManualConstraint, Text } from '../../../../scenery/js/imports.js';
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
import PDLCanvas from './PDLCanvas.js';

type SelfOptions = EmptySelfOptions;
type PDLScreenViewOptions = SelfOptions & ScreenViewOptions;

export class PDLScreenView extends ScreenView {

  private readonly launcher: LauncherNode;

  protected readonly resetAllButton: ResetAllButton;
  protected readonly timeControlNode: TimeControlNode;
  protected readonly launchButton: RectangularPushButton;
  protected readonly launchControlRadioButtonGroup: VerticalAquaRadioButtonGroup<boolean>;

  public constructor( model: PDLModel, options: PDLScreenViewOptions ) {
    super( options );

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
    this.addChild( backgroundNode );

    const noAirResistanceText = new PDLText( ProjectileDataLabStrings.noAirResistanceStringProperty, {
      maxWidth: 200
    } );
    this.addChild( noAirResistanceText );

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
    this.addChild( this.resetAllButton );

    // Create the field and field overlay
    const fieldX = this.layoutBounds.centerX + PDLConstants.FIELD_CENTER_OFFSET_X;
    const fieldY = PDLConstants.FIELD_CENTER_Y;

    const fieldBack = new FieldNode( fieldX, fieldY, false, model.binWidthProperty, {} );
    const fieldFront = new FieldNode( fieldX, fieldY, true, model.binWidthProperty, {} );
    const fieldOverlayNode = new FieldOverlayNode( fieldX, fieldY, {} );

    // Create the launcher
    const originX = fieldX - 0.5 * PDLConstants.FIELD_WIDTH;
    this.launcher = new LauncherNode(
      originX,
      fieldY,
      model.launcherAngleProperty,
      model.launcherHeightProperty,
      model.launcherTypeProperty,
      {}
    );

    this.addChild( fieldBack );
    this.addChild( this.launcher );
    this.addChild( fieldFront );
    this.addChild( fieldOverlayNode );

    // Create the launch button
    this.launchButton = new RectangularPushButton( {
      content: new Image( launchButton_png ),
      left: this.layoutBounds.centerX + PDLConstants.FIELD_CENTER_OFFSET_X - 0.42 * PDLConstants.FIELD_WIDTH,
      bottom: this.layoutBounds.maxY - PDLConstants.SCREEN_VIEW_Y_MARGIN,
      baseColor: PDLColors.launchButtonColorProperty,
      size: new Dimension2( 85, 45 ),
      yMargin: 5,
      tandem: options.tandem.createTandem( 'launchButton' )
    } );

    this.addChild( this.launchButton );

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

    this.addChild( this.launchControlRadioButtonGroup );

    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'timeControlNode' ),
      playPauseStepButtonOptions: {
        includeStepForwardButton: false
      },
      timeSpeedProperty: model.timeSpeedProperty,
      timeSpeeds: model.timeSpeedValues,
      buttonGroupXSpacing: 18
    } );
    this.addChild( this.timeControlNode );

    // Create the eraser button
    const eraserButton = new EraserButton( {
      right: this.layoutBounds.right - PDLConstants.SCREEN_VIEW_X_MARGIN,
      centerY: PDLConstants.FIELD_SIGN_CENTER_Y,
      iconWidth: 25,
      listener: () => {
        console.log( 'eraser button clicked' );
      },
      tandem: options.tandem.createTandem( 'eraserButton' )
    } );

    this.addChild( eraserButton );

    const projectileCanvas = new PDLCanvas( model.fieldProperty, {
      canvasBounds: ScreenView.DEFAULT_LAYOUT_BOUNDS
    } );
    this.addChild( projectileCanvas );

    // layout
    ManualConstraint.create(
      this,
      [ noAirResistanceText, this.resetAllButton ],
      ( noAirResistanceTextProxy, resetAllButtonProxy ) => {
        noAirResistanceTextProxy.right =
          resetAllButtonProxy.left - PDLConstants.SCREEN_VIEW_X_MARGIN;
        noAirResistanceTextProxy.bottom = resetAllButtonProxy.bottom;
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

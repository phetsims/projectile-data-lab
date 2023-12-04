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
import { Image, Node, Path, Text } from '../../../../scenery/js/imports.js';
import PDLConstants from '../PDLConstants.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLColors from '../PDLColors.js';
import GradientBackgroundNode from '../../../../scenery-phet/js/GradientBackgroundNode.js';
import FieldNode from './FieldNode.js';
import PDLModel from '../model/PDLModel.js';
import FieldOverlayNode from './FieldOverlayNode.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import PDLText from './PDLText.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Field from '../model/Field.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import stopSolidShape from '../../../../sherpa/js/fontawesome-5/stopSolidShape.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import launchButtonSingle_png from '../../../images/launchButtonSingle_png.js';
import launchButtonContinuous_png from '../../../images/launchButtonContinuous_png.js';
import LauncherNode from './LauncherNode.js';
import { PDLLaunchPanel } from './PDLLaunchPanel.js';
import PDLAccordionBox from './PDLAccordionBox.js';

type SelfOptions = EmptySelfOptions;
type PDLScreenViewOptions = SelfOptions & ScreenViewOptions;

export default abstract class PDLScreenView<T extends Field> extends ScreenView {

  protected readonly modelViewTransform;
  protected readonly canvasBounds: Bounds2;

  protected readonly launcherLayer = new Node();
  protected readonly projectileCanvasLayer = new Node();
  protected readonly behindProjectilesLayer = new Node();

  protected abstract readonly launcherNode: LauncherNode;

  protected abstract readonly launchPanel: PDLLaunchPanel;
  protected abstract readonly accordionBox: PDLAccordionBox;

  protected readonly launchButton;
  protected readonly launchControlRadioButtonGroup;
  protected readonly eraserButton: EraserButton;
  protected readonly resetAllButton;
  protected readonly noAirResistanceText: PDLText;

  protected constructor( model: PDLModel<T>, options: PDLScreenViewOptions ) {
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

    // This instance lives for the lifetime of the simulation, so we don't need to remove this listener
    this.visibleBoundsProperty.link( visibleBounds => {
      background.translation = visibleBounds.leftTop;
      background.setScaleMagnitude( visibleBounds.width, visibleBounds.height );
    } );

    this.noAirResistanceText = new PDLText( ProjectileDataLabStrings.noAirResistanceStringProperty, {
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
    const fieldOverlayBack = new FieldOverlayNode( this.modelViewTransform, {} );
    const fieldOverlayFront = new FieldOverlayNode( this.modelViewTransform, { isLeftSide: true } );
    fieldOverlayBack.x = fieldX;
    fieldOverlayBack.y = fieldY;
    fieldOverlayFront.x = fieldX;
    fieldOverlayFront.y = fieldY;
    // Create the launch button
    const launchIconToggleNode = new ToggleNode<'single' | 'continuous', Image>( model.launchModeProperty, [ {
      value: 'single',
      createNode: () => new Image( launchButtonSingle_png )
    }, {
      value: 'continuous',
      createNode: () => new Image( launchButtonContinuous_png )
    } ], {} );

    const launchButtonToggleNode = new ToggleNode<boolean, Node>( new DerivedProperty( [
      model.isContinuousLaunchingProperty,
      model.launchModeProperty
    ], ( isContinuousLaunching, launchMode ) => isContinuousLaunching && launchMode === 'continuous' ), [ {
      value: false,
      createNode: () => launchIconToggleNode
    }, {
      value: true,
      createNode: () => new Path( stopSolidShape, { fill: 'black', maxWidth: 50 } )
    } ], {} );

    this.launchButton = new RectangularPushButton( {
      content: launchButtonToggleNode,
      fireOnDown: true,
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
    this.launchControlRadioButtonGroup = new VerticalAquaRadioButtonGroup( model.launchModeProperty, [ {
      value: 'single' as const,
      createNode: () => new Text( ProjectileDataLabStrings.singleLaunchStringProperty, {
        font: PDLConstants.LAUNCH_CONTROL_FONT,
        maxWidth: radioButtonLabelMaxWidth
      } ),
      tandemName: 'singleLaunchRadioButton'
    }, {
      value: 'continuous' as const,
      createNode: () => new Text( ProjectileDataLabStrings.continuousLaunchStringProperty, {
        font: PDLConstants.LAUNCH_CONTROL_FONT,
        maxWidth: radioButtonLabelMaxWidth
      } ),
      tandemName: 'continuousLaunchRadioButton'
    } ], {
      left: this.launchButton.right + 15,
      centerY: this.launchButton.centerY,
      spacing: 10,
      tandem: options.tandem.createTandem( 'launchControlRadioButtonGroup' )
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

    this.addChild( background );
    this.addChild( fieldBack );
    this.addChild( fieldOverlayBack );
    this.addChild( this.behindProjectilesLayer );
    this.addChild( this.projectileCanvasLayer );
    this.addChild( this.launcherLayer );
    this.addChild( fieldFront );
    this.addChild( fieldOverlayFront );
    this.addChild( this.launchButton );
    this.addChild( this.launchControlRadioButtonGroup );
    this.addChild( this.noAirResistanceText );
    this.addChild( this.resetAllButton );
    this.addChild( this.eraserButton );
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

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
import { ManualConstraint, Text } from '../../../../scenery/js/imports.js';
import PDLConstants from '../PDLConstants.js';
import ProjectileDataLabStrings from '../../ProjectileDataLabStrings.js';
import PDLColors from '../PDLColors.js';
import GradientBackgroundNode from '../../../../scenery-phet/js/GradientBackgroundNode.js';
import FieldNode from './FieldNode.js';
import PDLModel from '../model/PDLModel.js';
import FieldOverlayNode from './FieldOverlayNode.js';
import LauncherNode from './LauncherNode.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';

type SelfOptions = EmptySelfOptions;
type PDLScreenViewOptions = SelfOptions & ScreenViewOptions;

export class PDLScreenView extends ScreenView {
  protected readonly resetAllButton: ResetAllButton;
  private readonly field: FieldNode;
  private readonly launcher: LauncherNode;

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

    const noAirResistanceText = new Text( ProjectileDataLabStrings.noAirResistanceStringProperty, {
      font: PDLConstants.PRIMARY_FONT,
      maxWidth: 120.046875 * 1.25 // 25% larger than the default English text
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

    this.field = new FieldNode( fieldX, fieldY, model.binWidthProperty, {} );
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

    this.addChild( this.field );
    this.addChild( this.launcher );
    this.addChild( fieldOverlayNode );

    const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'timeControlNode' ),
      playPauseStepButtonOptions: {
        includeStepForwardButton: false
      },
      timeSpeedProperty: model.timeSpeedProperty,
      timeSpeeds: model.timeSpeedValues
    } );
    this.addChild( timeControlNode );

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

    ManualConstraint.create( this, [ timeControlNode ], timeControlNodeProxy => {
      timeControlNodeProxy.centerX = this.layoutBounds.centerX;
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
